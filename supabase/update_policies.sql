-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own games" ON user_games;
DROP POLICY IF EXISTS "Users can insert their own games" ON user_games;
DROP POLICY IF EXISTS "Users can update their own games" ON user_games;
DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON user_achievements;

-- Enable Row Level Security
ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for user_games table
CREATE POLICY "Users can view their own games"
ON user_games FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own games"
ON user_games FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own games"
ON user_games FOR UPDATE
USING (auth.uid() = user_id);

-- Create policies for user_achievements table
CREATE POLICY "Users can view their own achievements"
ON user_achievements FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
ON user_achievements FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a function to automatically set the user_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- You can add any additional setup here
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically set the user_id
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 