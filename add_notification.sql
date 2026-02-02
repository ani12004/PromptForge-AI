-- Add Global Notification for Playground Update

INSERT INTO notifications (title, message, user_id, created_at)
VALUES (
    '🚀 New: Prompt Engineering Playground & Gamification!', 
    'We are excited to announce the launch of the **Prompt Engineering Playground**! 

🎮 **New Game Modes**:
- Fixer: Debug broken prompts
- Builder: Learn templates
- Battle: Compete with AI models
- Precision: Master constraints

🏆 **Gamification System**:
- Earn 15+ Unique Badges
- Track your progress on your Profile
- Level up your skills

👉 **Try it now**: Click the "Playground" button on the home page or visit /playground.',
    NULL, -- NULL user_id means it is visible to ALL users (Global)
    NOW()
);
