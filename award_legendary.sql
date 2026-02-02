-- Award 'Legend of PromptForge' badge to specific Clerk User ID
-- ID provided by user: user_38evcl3LFSoK1JdL8lGhwedv90X

INSERT INTO user_badges (user_id, badge_id)
SELECT 
    'user_38evcl3LFSoK1JdL8lGhwedv90X', -- Direct Clerk ID
    id 
FROM badges 
WHERE name = 'Legend of PromptForge'
ON CONFLICT (user_id, badge_id) DO UPDATE SET earned_at = NOW();

-- Verify
/*
SELECT * FROM user_badges WHERE user_id = 'user_38evcl3LFSoK1JdL8lGhwedv90X';
*/
