
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GameCarousel = ({ title, games, showLastPlayed }) => {
  const carouselRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  const handleKeyNavigation = (e, index) => {
    // Handle TV remote navigation
    if (e.key === 'ArrowRight') {
      if (index < games.length - 1) {
        // Focus next game
        const nextItem = document.getElementById(`game-${index + 1}`);
        nextItem?.focus();
        // Ensure it's in view
        if (carouselRef.current && nextItem) {
          const itemRect = nextItem.getBoundingClientRect();
          const containerRect = carouselRef.current.getBoundingClientRect();
          
          if (itemRect.right > containerRect.right) {
            scrollRight();
          }
        }
      }
    } else if (e.key === 'ArrowLeft') {
      if (index > 0) {
        // Focus previous game
        const prevItem = document.getElementById(`game-${index - 1}`);
        prevItem?.focus();
        // Ensure it's in view
        if (carouselRef.current && prevItem) {
          const itemRect = prevItem.getBoundingClientRect();
          const containerRect = carouselRef.current.getBoundingClientRect();
          
          if (itemRect.left < containerRect.left) {
            scrollLeft();
          }
        }
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex space-x-2">
          <button 
            onClick={scrollLeft}
            className="p-2 rounded-full bg-muted hover:bg-muted/80 focus:tv-focus"
            tabIndex={0}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={scrollRight}
            className="p-2 rounded-full bg-muted hover:bg-muted/80 focus:tv-focus"
            tabIndex={0}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div 
        ref={carouselRef}
        className="flex space-x-4 overflow-x-auto py-4 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {games.map((game, index) => (
          <Link
            key={game.id}
            id={`game-${index}`}
            to={`/game/${game.id}`}
            className={`game-card flex-shrink-0 w-60 focus:outline-none ${
              focusedIndex === index ? 'scale-105' : ''
            }`}
            onFocus={() => setFocusedIndex(index)}
            onKeyDown={(e) => handleKeyNavigation(e, index)}
            tabIndex={0}
          >
            <div className="relative h-80 w-60 rounded-xl overflow-hidden">
              <img 
                src={game.image} 
                alt={game.title} 
                className="h-full w-full object-cover"
              />
              <div className="game-card-overlay"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-bold text-white">{game.title}</h3>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-white text-sm">{game.rating}</span>
                  
                  {showLastPlayed && game.lastPlayed && (
                    <span className="ml-auto text-xs text-white/80">{game.lastPlayed}</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
