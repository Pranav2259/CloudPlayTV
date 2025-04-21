-- Disable triggers and foreign key checks
SET session_replication_role = 'replica';

-- Truncate all tables (this is more forceful than DELETE)
TRUNCATE TABLE user_achievements CASCADE;
TRUNCATE TABLE user_games CASCADE;
TRUNCATE TABLE achievements CASCADE;
TRUNCATE TABLE games CASCADE;

-- Re-enable triggers and foreign key checks
SET session_replication_role = 'origin';

-- Verify the cleanup
SELECT 'games' as table_name, COUNT(*) as count FROM games
UNION ALL
SELECT 'user_games', COUNT(*) FROM user_games
UNION ALL
SELECT 'achievements', COUNT(*) FROM achievements
UNION ALL
SELECT 'user_achievements', COUNT(*) FROM user_achievements; 