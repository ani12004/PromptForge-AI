CREATE TABLE IF NOT EXISTS public.v2_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    prefix TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    revoked BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_v2_api_keys_hash ON public.v2_api_keys(key_hash);

ALTER TABLE public.v2_execution_logs
ADD COLUMN IF NOT EXISTS api_key_id UUID REFERENCES public.v2_api_keys(id);
