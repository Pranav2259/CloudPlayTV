import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TVLayout } from "../components/layout/TVLayout";
import { useGame } from "../contexts/GameContext";
import { Timer } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function GameDetail() {
  const { gameId } = useParams<{ gameId: string }>();
  const { updateGameProgress } = useGame();
  const [playTime, setPlayTime] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  // Load initial play time
  useEffect(() => {
    const loadInitialPlayTime = async () => {
      if (!gameId) return;

      const { data: userGame, error } = await supabase
        .from("user_games")
        .select("play_time")
        .eq("game_id", gameId)
        .single();

      if (!error && userGame) {
        setPlayTime(userGame.play_time || 0);
      }
    };

    loadInitialPlayTime();
  }, [gameId]);

  // Automatically track and update play time
  useEffect(() => {
    if (!gameId) return;

    // Update every minute
    const interval = setInterval(async () => {
      const currentTime = new Date();
      const minutesPlayed = Math.floor(
        (currentTime.getTime() - lastUpdateTime.getTime()) / (1000 * 60)
      );

      if (minutesPlayed > 0) {
        const newPlayTime = playTime + minutesPlayed;
        setPlayTime(newPlayTime);
        await updateGameProgress(gameId, newPlayTime);
        setLastUpdateTime(currentTime);
      }
    }, 60000); // Check every minute

    // Update on component unmount or page refresh
    const handleBeforeUnload = async () => {
      const currentTime = new Date();
      const minutesPlayed = Math.floor(
        (currentTime.getTime() - lastUpdateTime.getTime()) / (1000 * 60)
      );
      if (minutesPlayed > 0) {
        await updateGameProgress(gameId, playTime + minutesPlayed);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Final update when component unmounts
      handleBeforeUnload();
    };
  }, [gameId, playTime, lastUpdateTime, updateGameProgress]);

  return (
    <TVLayout>
      <div className="h-full overflow-y-auto py-6 px-8 tv-scrollbar">
        <div className="max-w-4xl mx-auto">
          {/* Game Status */}
          <div className="bg-gaming rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Active Game Session
              </h2>
              <div className="flex items-center space-x-2 text-white">
                <Timer className="w-5 h-5" />
                <span className="text-lg font-semibold">
                  {Math.floor(playTime / 60)}h {playTime % 60}m
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gaming-dark rounded-lg">
              <p className="text-green-400">
                Your game progress is being tracked automatically!
              </p>
              <p className="text-white/80 mt-2">
                Time is tracked while this page is open and updates are sent to
                the server every minute.
              </p>
            </div>
          </div>
        </div>
      </div>
    </TVLayout>
  );
}
