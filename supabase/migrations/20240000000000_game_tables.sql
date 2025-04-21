-- Create games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create user_games table to track game progress
CREATE TABLE user_games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  play_time INTEGER DEFAULT 0, -- in minutes
  last_played_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, game_id)
);

-- Create achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create user_achievements table
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, achievement_id)
);

-- Add RLS (Row Level Security) policies
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Games are readable by all authenticated users
CREATE POLICY "Games are viewable by all users"
  ON games FOR SELECT
  TO authenticated
  USING (true);

-- User game progress is only viewable by the owner
CREATE POLICY "Users can view their own game progress"
  ON user_games FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own game progress"
  ON user_games FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Achievements are readable by all authenticated users
CREATE POLICY "Achievements are viewable by all users"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- User achievements are only viewable by the owner
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create functions to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_games_updated_at
  BEFORE UPDATE ON user_games
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column(); 