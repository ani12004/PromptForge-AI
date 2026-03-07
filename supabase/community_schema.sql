-- Community Discussion Schema Updates

-- 1. Community Posts Table
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Community Replies Table
CREATE TABLE IF NOT EXISTS public.community_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Community Likes Table
CREATE TABLE IF NOT EXISTS public.community_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    reply_id UUID REFERENCES public.community_replies(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Ensure a user can only like a specific post or reply once
    CONSTRAINT one_like_per_user_per_item UNIQUE NULLS NOT DISTINCT (user_id, post_id, reply_id),
    -- Ensure exactly one target is liked (either post or reply, not both, not neither)
    CHECK (
        (post_id IS NOT NULL AND reply_id IS NULL) OR 
        (post_id IS NULL AND reply_id IS NOT NULL)
    )
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

-- Post Policies
CREATE POLICY "Anyone can read posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own posts" ON public.community_posts FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own posts" ON public.community_posts FOR DELETE USING (auth.uid()::text = user_id);

-- Reply Policies
CREATE POLICY "Anyone can read replies" ON public.community_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.community_replies FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own replies" ON public.community_replies FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own replies" ON public.community_replies FOR DELETE USING (auth.uid()::text = user_id);

-- Like Policies
CREATE POLICY "Anyone can read likes" ON public.community_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage likes" ON public.community_likes FOR ALL USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);
