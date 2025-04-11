
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export const GameGrid = ({ games, viewMode }) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const handleKeyNavigation = (e, index) => {
    const rowSize = viewMode === 'grid' ? 4 : 1; // 4 items per row in grid mode, 1 in list mode
    
    // Handle TV remote navigation
    if (e.key === 'ArrowRight') {
      if (index % rowSize < rowSize - 1 && index < games.length - 1) {
        // Move to the next item in the same row
        const nextItem = document.getElementById(`game-${index + 1}`);
        nextItem?.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      if (index % rowSize > 0) {
        // Move to the previous item in the same row
        const prevItem = document.getElementById(`game-${index - 1}`);
        prevItem?.focus();
      }
    } else if (e.key === 'ArrowDown') {
      if (index + rowSize < games.length) {
        // Move to the item below
        const belowItem = document.getElementById(`game-${index + rowSize}`);
        belowItem?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      if (index - rowSize >= 0) {
        // Move to the item above
        const aboveItem = document.getElementById(`game-${index - rowSize}`);
        aboveItem?.focus();
      }
    }
  };

  return (
    <div className={viewMode === 'grid' 
      ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
      : 'space-y-4'
    }>
      {games.map((game, index) => (
        <Link
          key={game.id}
          id={`game-${index}`}
          to={`/game/${game.id}`}
          className={`game-card focus:outline-none ${
            focusedIndex === index ? 'tv-focus' : ''
          } ${viewMode === 'list' ? 'flex items-center bg-card p-3' : ''}`}
          onFocus={() => setFocusedIndex(index)}
          onKeyDown={(e) => handleKeyNavigation(e, index)}
          tabIndex={0}
        >
          {viewMode === 'grid' ? (
            // Grid view
            <div className="relative">
              <div className="rounded-xl overflow-hidden aspect-[3/4]">
                <img 
                  src={game.image} 
                  alt={game.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="game-card-overlay rounded-xl"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-bold text-white">{game.title}</h3>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-white text-sm">{game.rating}</span>
                </div>
              </div>
            </div>
          ) : (
            // List view
            <>
              <div className="rounded-lg overflow-hidden mr-4">
                <img 
                  src={game.image} 
                  alt={game.title} 
                  className="w-20 h-20 object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{game.title}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm">{game.rating}</span>
                </div>
                <div className="flex flex-wrap mt-1">
                  {game.genres.map((genre) => (
                    <span 
                      key={genre} 
                      className="text-xs bg-muted px-2 py-0.5 rounded-full mr-1"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </Link>
      ))}
    </div>
  );
};
