
import React, { useState } from 'react';
import { TVLayout } from '../components/layout/TVLayout';
import { Search, Filter, Grid3X3, List } from 'lucide-react';
import { GameGrid } from '../components/games/GameGrid';

// Mock game data
const allGames = [
  { id: 'game1', title: 'Cyber Odyssey 2077', image: 'https://via.placeholder.com/300x400/0F172A/60A5FA?text=Cyber+Odyssey', rating: 4.7, genres: ['RPG', 'Open World'] },
  { id: 'game2', title: 'Racing Champions', image: 'https://via.placeholder.com/300x400/0F172A/10B981?text=Racing+Champions', rating: 4.5, genres: ['Racing', 'Sports'] },
  { id: 'game3', title: 'Fantasy Quest IX', image: 'https://via.placeholder.com/300x400/0F172A/F97316?text=Fantasy+Quest', rating: 4.8, genres: ['RPG', 'Adventure'] },
  { id: 'game4', title: 'Space Explorers', image: 'https://via.placeholder.com/300x400/0F172A/8B5CF6?text=Space+Explorers', rating: 4.2, genres: ['Simulation', 'Strategy'] },
  { id: 'game5', title: 'Zombie Survival', image: 'https://via.placeholder.com/300x400/0F172A/EC4899?text=Zombie+Survival', rating: 4.4, genres: ['Survival', 'Horror'] },
  { id: 'game6', title: 'Strategy Masters', image: 'https://via.placeholder.com/300x400/0F172A/EAB308?text=Strategy+Masters', rating: 4.6, genres: ['Strategy', 'Simulation'] },
  { id: 'game7', title: 'Sports Challenge', image: 'https://via.placeholder.com/300x400/0F172A/14B8A6?text=Sports+Challenge', rating: 4.3, genres: ['Sports', 'Simulation'] },
  { id: 'game8', title: 'Adventure Time', image: 'https://via.placeholder.com/300x400/0F172A/F43F5E?text=Adventure+Time', rating: 4.1, genres: ['Adventure', 'Platformer'] },
  { id: 'game9', title: 'Combat Legends', image: 'https://via.placeholder.com/300x400/0F172A/6366F1?text=Combat+Legends', rating: 4.9, genres: ['Fighting', 'Action'] },
  { id: 'game10', title: 'Puzzle World', image: 'https://via.placeholder.com/300x400/0F172A/0EA5E9?text=Puzzle+World', rating: 4.0, genres: ['Puzzle', 'Casual'] },
  { id: 'game11', title: 'Medieval Kingdom', image: 'https://via.placeholder.com/300x400/0F172A/A855F7?text=Medieval+Kingdom', rating: 4.5, genres: ['Strategy', 'RPG'] },
  { id: 'game12', title: 'Ninja Warriors', image: 'https://via.placeholder.com/300x400/0F172A/EC4899?text=Ninja+Warriors', rating: 4.7, genres: ['Action', 'Fighting'] },
];

// Available genres for filtering
const availableGenres = Array.from(
  new Set(allGames.flatMap(game => game.genres))
).sort();

export default function Library() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter games based on search query and selected genres
  const filteredGames = allGames.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenres = selectedGenres.length === 0 || 
      selectedGenres.some(genre => game.genres.includes(genre));
    
    return matchesSearch && matchesGenres;
  });
  
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };
  
  const clearFilters = () => {
    setSelectedGenres([]);
    setSearchQuery('');
  };

  return (
    <TVLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Search and filter bar */}
        <div className="bg-card p-6 border-b border-muted">
          <div className="flex items-center justify-between">
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
              <button
                className={`p-3 rounded-lg ${isFilterOpen ? 'bg-cloud text-white' : 'bg-muted'} focus:tv-focus`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                tabIndex={0}
                aria-label="Toggle filters"
              >
                <Filter className="h-5 w-5" />
              </button>
              
              <div className="flex rounded-lg overflow-hidden">
                <button
                  className={`p-3 ${viewMode === 'grid' ? 'bg-cloud text-white' : 'bg-muted'} focus:tv-focus`}
                  onClick={() => setViewMode('grid')}
                  tabIndex={0}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  className={`p-3 ${viewMode === 'list' ? 'bg-cloud text-white' : 'bg-muted'} focus:tv-focus`}
                  onClick={() => setViewMode('list')}
                  tabIndex={0}
                  aria-label="List view"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Genre filters */}
          {isFilterOpen && (
            <div className="mt-4 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Filter by Genre</h3>
                <button 
                  className="text-sm text-cloud hover:underline focus:tv-focus-text"
                  onClick={clearFilters}
                  tabIndex={0}
                >
                  Clear Filters
                </button>
              </div>
              
              <div className="flex flex-wrap">
                {availableGenres.map(genre => (
                  <button
                    key={genre}
                    className={`mr-2 mb-2 px-3 py-1 rounded-full text-sm focus:tv-focus ${
                      selectedGenres.includes(genre)
                        ? 'bg-cloud text-white'
                        : 'bg-muted text-foreground'
                    }`}
                    onClick={() => toggleGenre(genre)}
                    tabIndex={0}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Game grid/list */}
        <div className="flex-1 overflow-y-auto p-6 tv-scrollbar">
          <h2 className="text-2xl font-bold mb-6">Your Game Library</h2>
          
          {filteredGames.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No games match your filters.</p>
              <button 
                className="mt-4 tv-btn bg-cloud text-white"
                onClick={clearFilters}
                tabIndex={0}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <GameGrid games={filteredGames} viewMode={viewMode} />
          )}
        </div>
      </div>
    </TVLayout>
  );
}
