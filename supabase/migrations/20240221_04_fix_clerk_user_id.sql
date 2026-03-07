-- Migration to convert UUID user_id references to TEXT for Clerk compatibility 
-- Applies to our newly created tables

-- 1. Modify v2_prompts
ALTER TABLE public.v2_prompts 
  ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- 2. Modify v2_api_keys
-- Because v2_api_keys is already actively used and created via 2024...api_keys.sql we must also patch it
ALTER TABLE public.v2_api_keys 
  ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- Note: v2_prompt_versions and v2_execution_logs reference prompt_id / version_id which are true UUIDs. 
-- Only user_id needs this change for Clerk.
