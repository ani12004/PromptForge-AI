"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { createClerkSupabaseClient } from "@/lib/supabaseClient"
import { createAdminClient } from "@/lib/supabaseAdmin"
import { revalidatePath } from "next/cache"
import { MAX_CONTENT_LENGTH, isValidUUID } from "@/lib/security"

// Interfaces for our return types
export interface CommunityLike {
    id: string;
    post_id: string | null;
    reply_id: string | null;
    user_id: string;
}

export interface CommunityUser {
    id: string;
    username: string | null;
    firstName: string | null;
    imageUrl: string;
}

export interface CommunityReply {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    likesData?: CommunityLike[];
    likeCount: number;
    hasLiked: boolean;
    user?: CommunityUser;
}

export interface CommunityPost {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    repliesData?: CommunityReply[];
    likesData?: CommunityLike[];
    replies: CommunityReply[];
    likeCount: number;
    hasLiked: boolean;
    user?: CommunityUser;
}

export async function getCommunityPosts() {
    const { userId, getToken } = await auth();
    let supabase;

    // Unauthenticated users can still view posts using the anon key (assuming RLS allows it, which our policies do)
    if (userId) {
        const token = await getToken({ template: "supabase" });
        supabase = createClerkSupabaseClient(token);
    } else {
        // Fallback to a client with anon key if needed, or if createClerkSupabaseClient handles null tokens gracefully.
        // For simplicity, we just create a client without the custom auth header.
        const { createClient } = await import('@supabase/supabase-js');
        supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }

    // Fetch posts, ideally joining with replies and likes.
    // Due to Supabase RPC/Join limits on nested arrays, we fetch them and map manually or use a view.
    // For this implementation, we will fetch posts, then their replies and likes in separate queries or joined.

    const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select(`
            *,
            repliesData:community_replies(*, likesData:community_likes(*)),
            likesData:community_likes(*)
        `)
        .order('created_at', { ascending: false });

    if (postsError) {
        console.error("Error fetching posts:", postsError);
        return [];
    }

    // Format the response to calculate like counts and 'hasLiked' booleans
    let formattedPosts: CommunityPost[] = (postsData || []).map((post: any) => {

        const formatReply = (reply: any): CommunityReply => ({
            ...reply,
            likeCount: reply.likesData?.length || 0,
            hasLiked: userId ? reply.likesData?.some((l: CommunityLike) => l.user_id === userId) : false,
        });

        const replies = (post.repliesData || []).map(formatReply).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        return {
            ...post,
            replies,
            likeCount: post.likesData?.length || 0,
            hasLiked: userId ? post.likesData?.some((l: CommunityLike) => l.user_id === userId) : false,
        };
    });

    // Extract unique user IDs
    const userIds = new Set<string>();
    formattedPosts.forEach(post => {
        userIds.add(post.user_id);
        post.replies.forEach(reply => userIds.add(reply.user_id));
    });

    if (userIds.size > 0) {
        try {
            const client = await clerkClient();
            const users = await client.users.getUserList({ userId: Array.from(userIds) });
            const userMap = new Map<string, CommunityUser>();

            users.data?.forEach(u => {
                userMap.set(u.id, {
                    id: u.id,
                    username: u.username,
                    firstName: u.firstName,
                    imageUrl: u.imageUrl
                });
            });

            // Inject users into posts and replies
            formattedPosts = formattedPosts.map(post => ({
                ...post,
                user: userMap.get(post.user_id),
                replies: post.replies.map(reply => ({
                    ...reply,
                    user: userMap.get(reply.user_id)
                }))
            }));

            // For the seeded system admin post
            formattedPosts.forEach(post => {
                if (post.user_id === 'admin_forge_system') {
                    post.user = {
                        id: 'admin_forge_system',
                        username: 'PromptForge',
                        firstName: 'System',
                        imageUrl: '/logo.png' // Make sure you have a logo.png in public
                    }
                }
            });

        } catch (error) {
            console.error("Failed to fetch user profiles from Clerk:", error);
        }
    }

    return formattedPosts;
}

export async function createPost(content: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    if (!content.trim()) throw new Error("Content cannot be empty");
    if (content.length > MAX_CONTENT_LENGTH) throw new Error(`Content cannot exceed ${MAX_CONTENT_LENGTH} characters`);

    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('community_posts')
        .insert({ user_id: userId, content: content.trim() })
        .select()
        .single();

    if (error) {
        console.error("Failed to create post:", error);
        throw new Error("Failed to create post");
    }

    revalidatePath("/community");
    return data;
}

export async function createReply(postId: string, content: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    if (!content.trim()) throw new Error("Content cannot be empty");
    if (content.length > MAX_CONTENT_LENGTH) throw new Error(`Content cannot exceed ${MAX_CONTENT_LENGTH} characters`);
    if (!isValidUUID(postId)) throw new Error("Invalid post ID format");

    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('community_replies')
        .insert({ post_id: postId, user_id: userId, content: content.trim() })
        .select()
        .single();

    if (error) {
        console.error("Failed to create reply:", error);
        throw new Error("Failed to create reply");
    }

    revalidatePath("/community");
    return data;
}

export async function toggleLike(targetType: 'post' | 'reply', targetId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const supabase = createAdminClient();

    const columnMatch = targetType === 'post' ? 'post_id' : 'reply_id';

    // Check if like exists
    const { data: existingLike, error: findError } = await supabase
        .from('community_likes')
        .select('id')
        .eq('user_id', userId)
        .eq(columnMatch, targetId)
        .single();

    if (findError && findError.code !== 'PGRST116') {
        // PGRST116 means zero rows returned, which is fine
        console.error("Error finding like:", findError);
        throw new Error("Error fetching like status");
    }

    if (existingLike) {
        // Unlike
        const { error: deleteError } = await supabase
            .from('community_likes')
            .delete()
            .eq('id', existingLike.id);

        if (deleteError) {
            console.error("Error deleting like:", deleteError);
            throw new Error("Failed to unlike");
        }
    } else {
        // Like
        const { error: insertError } = await supabase
            .from('community_likes')
            .insert({ user_id: userId, [columnMatch]: targetId });

        if (insertError) {
            console.error("Error inserting like:", insertError);
            throw new Error("Failed to like");
        }
    }

    revalidatePath("/community");
    return { success: true, action: existingLike ? 'unliked' : 'liked' };
}
