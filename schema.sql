-- Create Badges Table
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    rarity TEXT NOT NULL CHECK (rarity IN ('Common', 'Skilled', 'Advanced', 'Expert', 'Legendary')),
    unlock_condition TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Ensure names are unique so we can update them safely later
    CONSTRAINT badges_name_key UNIQUE (name)
);

-- Create User Badges Table
CREATE TABLE IF NOT EXISTS user_badges (
    user_id TEXT NOT NULL,
    badge_id UUID NOT NULL REFERENCES badges(id),
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);

-- Safely add Unique Constraint if it was missing from an earlier version
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'badges_name_key') THEN
        ALTER TABLE badges ADD CONSTRAINT badges_name_key UNIQUE (name);
    END IF;
EXCEPTION
    -- If there are duplicates, we can't add the constraint. 
    -- In that case, you might need to manually clean up duplicates first:
    -- DELETE FROM badges a USING badges b WHERE a.id < b.id AND a.name = b.name;
    WHEN others THEN 
        RAISE NOTICE 'Could not add unique constraint. Check for duplicate badge names.';
END $$;

-- Enable RLS
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- DROP POLICIES IF EXISTS (To allow re-running this script)
DROP POLICY IF EXISTS "Public read badges" ON badges;
DROP POLICY IF EXISTS "Users read own badges" ON user_badges;
DROP POLICY IF EXISTS "Users insert own badges" ON user_badges;

-- Re-Create Policies
CREATE POLICY "Public read badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Users read own badges" ON user_badges FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid()::text = user_id);


-- SEED DATA (Using UPSERT to avoid duplicates and update images)
INSERT INTO badges (name, description, icon, rarity, unlock_condition) VALUES
-- Common
('Prompt Rookie', 'Complete your first playground challenge.', '/badges/Prompt_Rookie.png', 'Common', 'first_challenge'),
('Curious Mind', 'Try out all 4 game modes.', '/badges/Curious_Mind.png', 'Common', 'all_modes_played'),
('Helper', 'Fix 3 prompts in Prompt Fixer.', '/badges/Helper.png', 'Common', 'fixer_3'),

-- Skilled
('Constraint Master', 'Pass 5 Accuracy Challenges with 100% constraint match.', '/badges/Constraint_Master.png', 'Skilled', 'precision_5_perfect'),
('Battle Analyst', 'Correctly predict 5 Prompt Battles.', '/badges/Battle_Analyst.png', 'Skilled', 'battle_5_wins'),
('Builder Apprentice', 'Build 5 prompts using templates.', '/badges/Builder_Apprentice.png', 'Skilled', 'builder_5'),
('Consistent', 'Login and play for 3 days in a row.', '/badges/Consistent.png', 'Skilled', 'streak_3'),

-- Advanced
('Prompt Surgeon', 'Fix 10 broken prompts in Prompt Fixer.', '/badges/Prompt_Surgeon.png', 'Advanced', 'fixer_10'),
('Precision Engineer', 'Win an Accuracy Challenge with zero retries.', '/badges/Precision_Engineer.png', 'Advanced', 'precision_perfect_first_try'),
('Battle Commander', 'Win 20 Prompt Battles.', '/badges/Battle_Commander.png', 'Advanced', 'battle_20_wins'),
('Streak Mindset', '7-day consecutive playground usage.', '/badges/Streak_Mindset.png', 'Advanced', 'streak_7'),

-- Expert
('Prompt Architect', 'Build 10 prompts using Prompt Builder templates.', '/badges/Prompt_Architect.png', 'Expert', 'builder_10'),
('Master Fixer', 'Fix 50 prompts.', '/badges/Master_Fixer.png', 'Expert', 'fixer_50'),
('Oracle', 'Getting 10 Battle predictions correct in a row.', '/badges/Oracle.png', 'Expert', 'battle_10_streak'),

-- Legendary
('Legend of PromptForge', 'Unlock all expert-level badges.', '/badges/Legend_of_PromptForge.png', 'Legendary', 'all_expert')

ON CONFLICT (name) DO UPDATE SET
    icon = EXCLUDED.icon,
    description = EXCLUDED.description,
    rarity = EXCLUDED.rarity,
    unlock_condition = EXCLUDED.unlock_condition;
