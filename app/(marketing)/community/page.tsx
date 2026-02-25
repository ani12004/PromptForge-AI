"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCommunityPosts, createPost, createReply, toggleLike, CommunityPost, CommunityReply } from '@/app/actions/community'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MessageSquare, Heart, CornerDownRight, Send, Loader2, Sparkles } from 'lucide-react'

export default function CommunityPage() {
    const [posts, setPosts] = useState<CommunityPost[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [newPostContent, setNewPostContent] = useState('')
    const [isPosting, setIsPosting] = useState(false)

    useEffect(() => {
        loadPosts()
    }, [])

    const loadPosts = async () => {
        try {
            const data = await getCommunityPosts()
            setPosts(data)
            setIsLoading(false)
        } catch (error) {
            console.error("Failed to load posts", error)
            setIsLoading(false)
        }
    }

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newPostContent.trim()) return

        setIsPosting(true)
        try {
            await createPost(newPostContent)
            setNewPostContent('')
            await loadPosts() // Refresh the feed
        } catch (error) {
            console.error("Error creating post:", error)
            alert("Failed to create post. Are you logged in?")
        } finally {
            setIsPosting(false)
        }
    }

    return (
        <div className="flex flex-col gap-16 pt-32 pb-32 px-6 overflow-hidden selection:bg-brand-purple/30 min-h-screen">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-brand-purple/10 blur-[120px] rounded-full opacity-40 pointer-events-none" />

            <section className="container mx-auto max-w-4xl relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 mb-6"
                >
                    <Sparkles className="h-4 w-4 text-brand-indigo" />
                    <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">The Forge Alliance</span>
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
                    Prompting <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-violet">Discussions</span>
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-12">
                    Share your prompt architectures, discuss optimization strategies, and learn from other prompt engineers.
                </p>

                {/* New Post Input */}
                <Card className="p-6 bg-white/[0.02] border-white/5 border-l-4 border-l-brand-purple backdrop-blur-md text-left mb-16 shadow-lg shadow-brand-purple/5 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                    <form onSubmit={handleCreatePost} className="relative z-10">
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="Share an insight, ask a question, or post a prompt architecture..."
                            className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-white placeholder:text-white/30 resize-none h-24 mb-4 text-lg"
                        />
                        <div className="flex justify-between items-center border-t border-white/10 pt-4">
                            <span className="text-xs text-gray-500">Supports Markdown-like formatting</span>
                            <Button
                                type="submit"
                                disabled={isPosting || !newPostContent.trim()}
                                className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-full px-6 transition-all shadow-glow hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isPosting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-2" /> Post Insight</>}
                            </Button>
                        </div>
                    </form>
                </Card>
            </section>

            {/* Feed Section */}
            <section className="container mx-auto max-w-4xl relative z-10">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
                    </div>
                ) : (
                    <div className="space-y-8">
                        <AnimatePresence>
                            {posts.map((post) => (
                                <ThreadItem key={post.id} post={post} onRefresh={loadPosts} />
                            ))}
                        </AnimatePresence>
                        {posts.length === 0 && (
                            <div className="text-center text-gray-500 py-12">
                                No discussions yet. Be the first to forge a post!
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    )
}

function ThreadItem({ post, onRefresh }: { post: CommunityPost, onRefresh: () => void }) {
    const [isReplying, setIsReplying] = useState(false)
    const [replyContent, setReplyContent] = useState('')
    const [submittingReply, setSubmittingReply] = useState(false)

    // Optimistic UI states
    const [localLikes, setLocalLikes] = useState(post.likeCount)
    const [localHasLiked, setLocalHasLiked] = useState(post.hasLiked)

    const handleLike = async () => {
        // Optimistic toggle
        setLocalHasLiked(!localHasLiked)
        setLocalLikes(prev => localHasLiked ? prev - 1 : prev + 1)

        try {
            await toggleLike('post', post.id)
            // Silently refresh in background without resetting UI immediately if possible, but standard is fine
        } catch (error) {
            console.error(error)
            // Revert on failure
            setLocalHasLiked(localHasLiked)
            setLocalLikes(post.likeCount)
        }
    }

    const submitReply = async () => {
        if (!replyContent.trim()) return
        setSubmittingReply(true)
        try {
            await createReply(post.id, replyContent)
            setReplyContent('')
            setIsReplying(false)
            onRefresh()
        } catch (error) {
            console.error(error)
            alert("Failed to submit reply.")
        } finally {
            setSubmittingReply(false)
        }
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="p-6 bg-[#0A0A0A] border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-purple to-brand-indigo flex items-center justify-center font-bold text-white shrink-0">
                        {post.user_id.slice(post.user_id.length - 2).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-white/80 text-sm">User_{post.user_id.slice(-6)}</span>
                            <span className="text-xs text-gray-600">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed text-[15px]">{post.content}</p>

                        <div className="flex items-center gap-6 pt-2">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors text-sm font-medium ${localHasLiked ? 'text-brand-purple bg-brand-purple/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                                <Heart className={`h-4 w-4 ${localHasLiked ? 'fill-brand-purple' : ''}`} />
                                {localLikes > 0 && <span>{localLikes}</span>}
                            </button>
                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className="flex items-center gap-2 text-gray-500 hover:text-white hover:bg-white/5 px-2 py-1 rounded-md transition-colors text-sm font-medium"
                            >
                                <MessageSquare className="h-4 w-4" />
                                {post.replies?.length > 0 && <span>{post.replies.length}</span>}
                                <span>Reply</span>
                            </button>
                        </div>

                        {/* Reply Input Area */}
                        <AnimatePresence>
                            {isReplying && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-4 overflow-hidden"
                                >
                                    <div className="flex items-start gap-3 pl-2 border-l-2 border-brand-purple/30 pb-2">
                                        <CornerDownRight className="h-5 w-5 text-gray-600 shrink-0 mt-2" />
                                        <div className="flex-1">
                                            <textarea
                                                autoFocus
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                placeholder="Write your response..."
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:outline-none focus:ring-0 focus:border-brand-purple/50 resize-none h-20 mb-2"
                                            />
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => setIsReplying(false)} className="text-gray-400">Cancel</Button>
                                                <Button size="sm" onClick={submitReply} disabled={submittingReply || !replyContent.trim()} className="bg-brand-purple hover:bg-brand-purple/90 text-white">
                                                    {submittingReply ? <Loader2 className="h-3 w-3 animate-spin" /> : "Reply"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Nested Replies Rendering */}
                        {post.replies && post.replies.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                                {post.replies.map((reply) => (
                                    <ReplyItem key={reply.id} reply={reply} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}

function ReplyItem({ reply }: { reply: CommunityReply }) {
    const [localLikes, setLocalLikes] = useState(reply.likeCount)
    const [localHasLiked, setLocalHasLiked] = useState(reply.hasLiked)

    const handleLike = async () => {
        setLocalHasLiked(!localHasLiked)
        setLocalLikes(prev => localHasLiked ? prev - 1 : prev + 1)
        try {
            await toggleLike('reply', reply.id)
        } catch (error) {
            console.error(error)
            setLocalHasLiked(localHasLiked)
            setLocalLikes(reply.likeCount)
        }
    }

    return (
        <div className="flex items-start gap-3 pl-4 border-l-2 border-white/10">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-gray-400 text-xs shrink-0">
                {reply.user_id.slice(reply.user_id.length - 2).toUpperCase()}
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-400 text-xs">User_{reply.user_id.slice(-6)}</span>
                    <span className="text-[10px] text-gray-600">{new Date(reply.created_at).toLocaleTimeString()}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{reply.content}</p>
                <div className="flex items-center pt-1">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded transition-colors text-xs font-medium ${localHasLiked ? 'text-brand-purple bg-brand-purple/10' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Heart className={`h-3 w-3 ${localHasLiked ? 'fill-brand-purple' : ''}`} />
                        {localLikes > 0 && <span>{localLikes}</span>}
                    </button>
                </div>
            </div>
        </div>
    )
}
