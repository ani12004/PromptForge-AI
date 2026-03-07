-- Add tags and category to v2_prompts
ALTER TABLE public.v2_prompts 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS category TEXT;

-- Index for category-based filtering
CREATE INDEX IF NOT EXISTS idx_v2_prompts_category ON public.v2_prompts(category);
