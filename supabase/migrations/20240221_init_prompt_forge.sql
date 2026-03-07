-- 1. Prompts Table (The container)
CREATE TABLE IF NOT EXISTS public.v2_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Hook to auth.users if you have full auth running
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Prompt Versions Table (The linear history)
CREATE TABLE IF NOT EXISTS public.v2_prompt_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id UUID NOT NULL REFERENCES public.v2_prompts(id) ON DELETE CASCADE,
    version_tag TEXT NOT NULL, -- e.g., 'v1', 'v2'
    system_prompt TEXT NOT NULL,
    template TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure version tags are unique per prompt (e.g., only one 'v1' per prompt)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'idx_v2_prompt_versions_unique' AND n.nspname = 'public'
    ) THEN
        CREATE UNIQUE INDEX idx_v2_prompt_versions_unique ON public.v2_prompt_versions(prompt_id, version_tag);
    END IF;
END
$$;

-- 3. Telemetry/Execution Logs (For billing/analytics later)
CREATE TABLE IF NOT EXISTS public.v2_execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID NOT NULL REFERENCES public.v2_prompt_versions(id) ON DELETE CASCADE,
    latency_ms INTEGER NOT NULL,
    model_used TEXT NOT NULL,
    cached_hit BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Assuming basic authenticated access)
ALTER TABLE public.v2_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_prompt_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_execution_logs ENABLE ROW LEVEL SECURITY;

-- Note: For the API route using the SERVICE_ROLE_KEY, RLS is bypassed. 
-- You will need to add specific user policies later when building the frontend UI.
