-- Migration to add slugs to prompts and ensure profiles have usernames
-- This enables the "user/slug" registry pattern

-- 1. Add slug to v2_prompts
ALTER TABLE public.v2_prompts 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Generate initial slugs from names
UPDATE public.v2_prompts 
SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Make slug NOT NULL and add uniqueness constraint per user
-- (We might have multiple prompts with same name across different users, but same user can't have duplicate slugs)
ALTER TABLE public.v2_prompts ALTER COLUMN slug SET NOT NULL;
ALTER TABLE public.v2_prompts ADD CONSTRAINT v2_prompts_user_id_slug_key UNIQUE (user_id, slug);

-- 2. Ensure profiles has username
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT;

-- Create an index on username for fast lookups in registry
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
