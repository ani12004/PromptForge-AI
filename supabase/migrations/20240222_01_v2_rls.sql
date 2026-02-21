-- Add RLS Policies for V2 tables (Selective reading for users)

-- V2 Prompts
DROP POLICY IF EXISTS "Users can view their own v2 prompts" ON public.v2_prompts;
CREATE POLICY "Users can view their own v2 prompts" 
ON public.v2_prompts FOR SELECT 
USING (auth.uid() = user_id);

-- V2 Prompt Versions (Viewable if the parent prompt is viewable)
DROP POLICY IF EXISTS "Users can view versions of their own prompts" ON public.v2_prompt_versions;
CREATE POLICY "Users can view versions of their own prompts" 
ON public.v2_prompt_versions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.v2_prompts 
    WHERE public.v2_prompts.id = public.v2_prompt_versions.prompt_id 
    AND public.v2_prompts.user_id = auth.uid()
  )
);
