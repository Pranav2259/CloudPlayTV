import React, { useState, useEffect } from "react";
import { TVLayout } from "../components/layout/TVLayout";
import { Search, Filter, Grid3X3, List, Download } from "lucide-react";
import { GameGrid } from "../components/games/GameGrid";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface Game {
  id: string;
  title: string;
  image: string;
  rating?: number;
  genres?: string[];
}

export default function Library() {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch games from Supabase
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("games")
          .select(
            `
            id,
            title,
            image_url,
            user_games!inner (
              user_id
            )
          `
          )
          .eq("user_games.user_id", user?.id);

        if (error) {
          console.error("Error fetching games:", error);
          return;
        }

        const formattedGames = data.map((game) => ({
          id: game.id,
          title: game.title,
          image: game.image_url,
        }));

        setGames(formattedGames);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchGames();
    }
  }, [user]);

  // Filter games based on search query
  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearFilters = () => {
    setSearchQuery("");
  };

  return (
    <TVLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Search and filter bar */}
        <div className="bg-card p-6 border-b border-muted">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 max-w-xl relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                className="w-full py-3 pl-10 pr-4 bg-muted rounded-lg text-foreground focus:tv-focus"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                tabIndex={0}
              />
            </div>

            <div className="flex items-center space-x-4 ml-4">
              <Link to="/library/import">
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 focus:tv-focus"
                  tabIndex={0}
                >
                  <Download className="h-5 w-5" />
                  <span>Import Games</span>
                </Button>
              </Link>

              <div className="flex rounded-lg overflow-hidden">
                <button
                  className={`p-3 ${
                    viewMode === "grid" ? "bg-cloud text-white" : "bg-muted"
                  } focus:tv-focus`}
                  onClick={() => setViewMode("grid")}
                  tabIndex={0}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  className={`p-3 ${
                    viewMode === "list" ? "bg-cloud text-white" : "bg-muted"
                  } focus:tv-focus`}
                  onClick={() => setViewMode("list")}
                  tabIndex={0}
                  aria-label="List view"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Game grid/list */}
        <div className="flex-1 overflow-y-auto p-6 tv-scrollbar">
          <h2 className="text-2xl font-bold mb-6">Your Game Library</h2>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Loading your games...
              </p>
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {searchQuery
                  ? "No games match your search."
                  : "Your library is empty."}
              </p>
              {searchQuery && (
                <button
                  className="mt-4 tv-btn bg-cloud text-white"
                  onClick={clearFilters}
                  tabIndex={0}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <GameGrid games={filteredGames} viewMode={viewMode} />
          )}
        </div>
      </div>
    </TVLayout>
  );
}
