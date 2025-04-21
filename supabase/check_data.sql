-- Check games table
SELECT * FROM games;

-- Check achievements table
SELECT * FROM achievements;

-- Check user_games table
SELECT 
    ug.*,
    g.title as game_title
FROM user_games ug
JOIN games g ON ug.game_id = g.id;

-- Check user_achievements table
SELECT 
    ua.*,
    g.title as game_title,
    a.title as achievement_title
FROM user_achievements ua
JOIN games g ON ua.game_id = g.id
JOIN achievements a ON ua.achievement_id = a.id; 