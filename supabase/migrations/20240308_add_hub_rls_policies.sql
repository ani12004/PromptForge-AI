-- Add missing RLS policies for CRUD operations on V2 tables
-- This allows authenticated users (via Clerk) to manage their own data
-- Using (auth.jwt() ->> 'sub') because Clerk IDs are strings, not UUIDs

-- 1. Profiles Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR ALL 
USING ((auth.jwt() ->> 'sub') = id)
WITH CHECK ((auth.jwt() ->> 'sub') = id);

-- 2. V2 Prompts Policies
DROP POLICY IF EXISTS "Users can insert their own v2 prompts" ON public.v2_prompts;
CREATE POLICY "Users can insert their own v2 prompts" 
ON public.v2_prompts FOR INSERT 
WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

DROP POLICY IF EXISTS "Users can update their own v2 prompts" ON public.v2_prompts;
CREATE POLICY "Users can update their own v2 prompts" 
ON public.v2_prompts FOR UPDATE 
USING ((auth.jwt() ->> 'sub') = user_id)
WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

DROP POLICY IF EXISTS "Public prompts are viewable by everyone" ON public.v2_prompts;
CREATE POLICY "Public prompts are viewable by everyone" 
ON public.v2_prompts FOR SELECT 
USING (is_public = true OR (auth.jwt() ->> 'sub') = user_id);

-- 3. V2 Prompt Versions Policies
DROP POLICY IF EXISTS "Users can insert versions of their own prompts" ON public.v2_prompt_versions;
CREATE POLICY "Users can insert versions of their own prompts" 
ON public.v2_prompt_versions FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.v2_prompts 
    WHERE public.v2_prompts.id = public.v2_prompt_versions.prompt_id 
    AND public.v2_prompts.user_id = (auth.jwt() ->> 'sub')
  )
);

DROP POLICY IF EXISTS "Public prompt versions are viewable by everyone" ON public.v2_prompt_versions;
CREATE POLICY "Public prompt versions are viewable by everyone" 
ON public.v2_prompt_versions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.v2_prompts 
    WHERE public.v2_prompts.id = public.v2_prompt_versions.prompt_id 
    AND (public.v2_prompts.is_public = true OR public.v2_prompts.user_id = (auth.jwt() ->> 'sub'))
  )
);
