-- First, disable foreign key checks temporarily
SET session_replication_role = 'replica';

-- Delete all data from tables (in correct order to respect foreign keys)
DELETE FROM user_achievements;
DELETE FROM user_games;
DELETE FROM achievements;
DELETE FROM games;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

-- Reset sequences if any
ALTER SEQUENCE IF EXISTS user_achievements_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS user_games_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS achievements_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS games_id_seq RESTART WITH 1;

-- Verify the cleanup
SELECT COUNT(*) FROM user_achievements;
SELECT COUNT(*) FROM user_games;
SELECT COUNT(*) FROM achievements;
SELECT COUNT(*) FROM games; 