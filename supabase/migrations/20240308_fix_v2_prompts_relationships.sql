-- MASTER FIX: ULTRA-ROBUST RLS & TYPE STANDARDIZATION
-- This script dynamically clears any existing policies to avoid "cannot alter type" errors

-- 1. DYNAMICALLY DROP ALL POLICIES on relevant tables
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN ('v2_prompts', 'v2_prompt_versions', 'profiles')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END
$$;

-- 2. DROP FOREIGN KEYS Temporarily
DO $$
BEGIN
    ALTER TABLE IF EXISTS public.v2_prompts DROP CONSTRAINT IF EXISTS v2_prompts_user_id_fkey;
    ALTER TABLE IF EXISTS public.v2_prompt_versions DROP CONSTRAINT IF EXISTS v2_prompt_versions_prompt_id_fkey;
EXCEPTION WHEN OTHERS THEN
    NULL;
END
$$;

-- 3. STANDARDIZE TYPES TO TEXT (Required for Clerk IDs)
-- We use USING to ensure existing UUIDs/Strings are preserved correctly
ALTER TABLE public.v2_prompts ALTER COLUMN user_id TYPE TEXT USING user_id::text;
ALTER TABLE public.profiles ALTER COLUMN id TYPE TEXT USING id::text;

-- 4. ENSURE COLUMNS EXIST
ALTER TABLE public.v2_prompts ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE public.v2_prompts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.v2_prompts ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.v2_prompt_versions ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE public.v2_prompt_versions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 5. RESTORE CONSTRAINTS
ALTER TABLE public.v2_prompts 
ADD CONSTRAINT v2_prompts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.v2_prompt_versions
ADD CONSTRAINT v2_prompt_versions_prompt_id_fkey
FOREIGN KEY (prompt_id) REFERENCES public.v2_prompts(id) ON DELETE CASCADE;

-- 6. APPLY UNIFIED AUTHENTICATED POLICIES (Clerk Optimized)
-- We check (auth.jwt() ->> 'sub') which is the standard for Clerk in Supabase

-- PROFILES
CREATE POLICY "profiles_owner_access" 
ON public.profiles FOR ALL 
USING ((auth.jwt() ->> 'sub') = id OR auth.uid()::text = id)
WITH CHECK ((auth.jwt() ->> 'sub') = id OR auth.uid()::text = id);

CREATE POLICY "profiles_public_view" 
ON public.profiles FOR SELECT 
USING (true);

-- PROMPTS
CREATE POLICY "v2_prompts_owner_access" 
ON public.v2_prompts FOR ALL 
USING ((auth.jwt() ->> 'sub') = user_id OR auth.uid()::text = user_id)
WITH CHECK ((auth.jwt() ->> 'sub') = user_id OR auth.uid()::text = user_id);

CREATE POLICY "v2_prompts_public_view" 
ON public.v2_prompts FOR SELECT 
USING (is_public = true);

-- VERSIONS
CREATE POLICY "v2_versions_owner_access" 
ON public.v2_prompt_versions FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.v2_prompts 
    WHERE public.v2_prompts.id = public.v2_prompt_versions.prompt_id 
    AND (public.v2_prompts.user_id = (auth.jwt() ->> 'sub') OR public.v2_prompts.user_id = auth.uid()::text)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.v2_prompts 
    WHERE public.v2_prompts.id = public.v2_prompt_versions.prompt_id 
    AND (public.v2_prompts.user_id = (auth.jwt() ->> 'sub') OR public.v2_prompts.user_id = auth.uid()::text)
  )
);

CREATE POLICY "v2_versions_public_view" 
ON public.v2_prompt_versions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.v2_prompts 
    WHERE public.v2_prompts.id = public.v2_prompt_versions.prompt_id 
    AND public.v2_prompts.is_public = true
  )
);

-- 7. ENABLE RLS
ALTER TABLE public.v2_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_prompt_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
