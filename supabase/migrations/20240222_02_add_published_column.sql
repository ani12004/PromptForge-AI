-- Migration to add 'published' column to v2_prompt_versions
-- This allows users to control which versions are available via the SDK

-- 1. Add published column
ALTER TABLE public.v2_prompt_versions 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;

-- 2. Ensure existing rows are published
UPDATE public.v2_prompt_versions SET published = true WHERE published IS NULL;

-- 3. Update execution logs to track if version was published (optional, but good for debug)
-- ALTER TABLE public.v2_execution_logs ADD COLUMN IF NOT EXISTS version_published BOOLEAN;
