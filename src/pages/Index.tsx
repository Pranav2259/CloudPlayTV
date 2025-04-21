import React from "react";
import { TVLayout } from "../components/layout/TVLayout";
import { useAuth } from "../contexts/AuthContext";
import { useGame } from "../contexts/GameContext";
import {
  Gamepad2,
  Clock,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const { user } = useAuth();
  const {
    recentGames,
    totalPlayTime,
    gamesPlayed,
    totalAchievements,
    isLoading,
  } = useGame();
  const username = user?.email?.split("@")[0] || "Guest";

  return (
    <TVLayout>
      <div className="h-full overflow-y-auto py-6 px-8 tv-scrollbar">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {username}!
          </h1>
          <p className="text-white/80">
            Ready to play some games? Check out your library or start a new
            session.
          </p>
        </div>

        {/* Recently Played Games */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recently Played</h2>
            <div className="flex space-x-2">
              <button
                className="p-2 rounded-lg bg-[#2B4B6F] hover:bg-[#3A5A7E] transition-colors"
                aria-label="Previous games"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                className="p-2 rounded-lg bg-[#2B4B6F] hover:bg-[#3A5A7E] transition-colors"
                aria-label="Next games"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : recentGames.length > 0 ? (
              recentGames.map((game) => (
                <Link
                  key={game.id}
                  to={`/game/${game.id}`}
                  className="group relative rounded-lg overflow-hidden aspect-[4/3] bg-[#2B4B6F]"
                >
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white">
                      {game.title}
                    </h3>
                    <p className="text-sm text-white/80">{game.lastPlayed}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full bg-gaming-dark rounded-lg p-6 text-center">
                <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No recent games</p>
                <p className="text-sm text-muted-foreground">
                  Start playing to see your recent games here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gaming rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center justify-between sm:block bg-gaming-dark p-4 rounded-lg">
              <div className="flex items-center space-x-3 sm:mb-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-white">Total Play Time</span>
              </div>
              <span className="text-white text-lg font-semibold">
                {Math.round(totalPlayTime / 60)} hours
              </span>
            </div>
            <div className="flex items-center justify-between sm:block bg-gaming-dark p-4 rounded-lg">
              <div className="flex items-center space-x-3 sm:mb-2">
                <Gamepad2 className="w-5 h-5 text-muted-foreground" />
                <span className="text-white">Games Played</span>
              </div>
              <span className="text-white text-lg font-semibold">
                {gamesPlayed}
              </span>
            </div>
            <div className="flex items-center justify-between sm:block bg-gaming-dark p-4 rounded-lg">
              <div className="flex items-center space-x-3 sm:mb-2">
                <Trophy className="w-5 h-5 text-muted-foreground" />
                <span className="text-white">Achievements</span>
              </div>
              <span className="text-white text-lg font-semibold">
                {totalAchievements}
              </span>
            </div>
          </div>
        </div>
      </div>
    </TVLayout>
  );
}
