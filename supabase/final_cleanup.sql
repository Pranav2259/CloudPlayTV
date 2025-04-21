-- First, disable RLS temporarily
ALTER TABLE user_achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_games DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE games DISABLE ROW LEVEL SECURITY;

-- Delete all data
TRUNCATE TABLE user_achievements CASCADE;
TRUNCATE TABLE user_games CASCADE;
TRUNCATE TABLE achievements CASCADE;
TRUNCATE TABLE games CASCADE;

-- Re-enable RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Verify cleanup
SELECT 
  'games' as table_name, 
  COUNT(*) as count 
FROM games
UNION ALL
SELECT 
  'user_games', 
  COUNT(*) 
FROM user_games
UNION ALL
SELECT 
  'achievements', 
  COUNT(*) 
FROM achievements
UNION ALL
SELECT 
  'user_achievements', 
  COUNT(*) 
FROM user_achievements; 