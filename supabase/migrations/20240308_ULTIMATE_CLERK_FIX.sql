-- ULTIMATE CLERK FIX v2: THE "HEAVY HITTER"
-- This script will bypass almost any dependency to force Clerk ID compliance.

DO $$
DECLARE
    pol RECORD;
BEGIN
    -- 1. DROP ALL POLICIES on all current/potential user tables
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN ('v2_prompts', 'v2_prompt_versions', 'profiles', 'v2_api_keys', 'prompts')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END
$$;

-- 2. BREAK ALL LOCKS/CONSTRAINTS
DO $$
BEGIN
    -- Force drop all foreign keys pointing to profiles
    ALTER TABLE IF EXISTS public.v2_prompts DROP CONSTRAINT IF EXISTS v2_prompts_user_id_fkey CASCADE;
    ALTER TABLE IF EXISTS public.prompts DROP CONSTRAINT IF EXISTS prompts_author_id_fkey CASCADE; -- Legacy table
    
    -- Drop profiles Primary Key
    ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_pkey CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END
$$;

-- 3. FORCE COLUMN CONVERSIONS (The syntax error killer)
-- We use explicit casting to TEXT for every user-related column
ALTER TABLE public.profiles ALTER COLUMN id SET DATA TYPE TEXT USING id::text;
ALTER TABLE public.v2_prompts ALTER COLUMN user_id SET DATA TYPE TEXT USING user_id::text;
ALTER TABLE IF EXISTS public.v2_api_keys ALTER COLUMN user_id SET DATA TYPE TEXT USING user_id::text;

-- 4. ENSURE HUB COLUMNS (Schema Cache Insurance)
ALTER TABLE public.v2_prompts ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE public.v2_prompts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.v2_prompts ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.v2_prompt_versions ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE public.v2_prompt_versions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 5. RE-LOCK THE DATABASE
-- Restore Profiles PK
ALTER TABLE public.profiles ADD PRIMARY KEY (id);

-- Restore Prompts FK
ALTER TABLE public.v2_prompts 
ADD CONSTRAINT v2_prompts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 6. RE-APPLY POLICIES (With Defensive Casting)
-- We cast both sides to TEXT to guarantee no "uuid vs text" comparison errors

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_owner_all" ON public.profiles FOR ALL 
USING (id::text = (auth.jwt() ->> 'sub')::text OR id::text = auth.uid()::text);
CREATE POLICY "profiles_public_select" ON public.profiles FOR SELECT USING (true);

-- PROMPTS
ALTER TABLE public.v2_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "v2_prompts_owner_all" ON public.v2_prompts FOR ALL 
USING (user_id::text = (auth.jwt() ->> 'sub')::text OR user_id::text = auth.uid()::text);
CREATE POLICY "v2_prompts_public_select" ON public.v2_prompts FOR SELECT USING (is_public = true);

-- VERSIONS
ALTER TABLE public.v2_prompt_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "v2_versions_owner_all" ON public.v2_prompt_versions FOR ALL 
USING (EXISTS (SELECT 1 FROM public.v2_prompts WHERE public.v2_prompts.id = public.v2_prompt_versions.prompt_id AND (public.v2_prompts.user_id::text = (auth.jwt() ->> 'sub')::text OR public.v2_prompts.user_id::text = auth.uid()::text)));
CREATE POLICY "v2_versions_public_select" ON public.v2_prompt_versions FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.v2_prompts WHERE public.v2_prompts.id = public.v2_prompt_versions.prompt_id AND is_public = true));

-- 7. REFRESH EVERYTHING
NOTIFY pgrst, 'reload schema';
