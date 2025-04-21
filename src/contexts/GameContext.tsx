import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

interface Game {
  id: string;
  title: string;
  image: string;
  lastPlayed?: string;
  playTime?: number;
  achievements?: number;
}

interface GameContextType {
  recentGames: Game[];
  totalPlayTime: number;
  gamesPlayed: number;
  totalAchievements: number;
  isLoading: boolean;
  updateGameProgress: (gameId: string, playTime: number) => Promise<void>;
  updateAchievement: (gameId: string, achievementId: string) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [totalAchievements, setTotalAchievements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserGameData();
    }
  }, [user]);

  const fetchUserGameData = async () => {
    try {
      setIsLoading(true);

      // Fetch user's game data with a join to get game details
      const { data: userGames, error: userGamesError } = await supabase
        .from("user_games")
        .select(
          `
          *,
          game:games (
            id,
            title,
            image_url
          )
        `
        )
        .order("last_played_at", { ascending: false });

      if (userGamesError) throw userGamesError;

      // Fetch achievement counts for each game
      const { data: achievementCounts, error: achievementsError } =
        await supabase.from("user_achievements").select("game_id");

      if (achievementsError) throw achievementsError;

      // Count achievements per game
      const achievementsByGame = achievementCounts?.reduce((acc, curr) => {
        acc[curr.game_id] = (acc[curr.game_id] || 0) + 1;
        return acc;
      }, {});

      // Transform the data
      const games =
        userGames?.map((userGame) => ({
          id: userGame.game.id,
          title: userGame.game.title,
          image: userGame.game.image_url,
          lastPlayed: new Date(userGame.last_played_at).toLocaleString(),
          playTime: userGame.play_time || 0,
          achievements: achievementsByGame?.[userGame.game_id] || 0,
        })) || [];

      console.log("User Games:", userGames);
      console.log("Achievement Counts:", achievementCounts);
      console.log("Achievements by Game:", achievementsByGame);
      console.log("Processed Games:", games);

      setRecentGames(games);
      setTotalPlayTime(
        games.reduce((total, game) => total + (game.playTime || 0), 0)
      );
      setGamesPlayed(games.length);
      setTotalAchievements(
        games.reduce((total, game) => total + (game.achievements || 0), 0)
      );
    } catch (error) {
      console.error("Error fetching game data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGameProgress = async (gameId: string, playTime: number) => {
    try {
      const { error } = await supabase.from("user_games").upsert({
        game_id: gameId,
        play_time: playTime,
        last_played_at: new Date().toISOString(),
      });

      if (error) throw error;
      await fetchUserGameData(); // Refresh the data
    } catch (error) {
      console.error("Error updating game progress:", error);
    }
  };

  const updateAchievement = async (gameId: string, achievementId: string) => {
    try {
      const { error } = await supabase.from("user_achievements").insert({
        game_id: gameId,
        achievement_id: achievementId,
        unlocked_at: new Date().toISOString(),
      });

      if (error) throw error;
      await fetchUserGameData(); // Refresh the data
    } catch (error) {
      console.error("Error updating achievement:", error);
    }
  };

  return (
    <GameContext.Provider
      value={{
        recentGames,
        totalPlayTime,
        gamesPlayed,
        totalAchievements,
        isLoading,
        updateGameProgress,
        updateAchievement,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
