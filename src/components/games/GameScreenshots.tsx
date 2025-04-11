
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GameScreenshotsProps {
  screenshots: string[];
}

export const GameScreenshots: React.FC<GameScreenshotsProps> = ({ screenshots }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  
  const isFullscreen = fullscreenIndex !== null;
  
  const nextImage = () => {
    if (isFullscreen) {
      setFullscreenIndex((fullscreenIndex + 1) % screenshots.length);
    } else {
      setCurrentIndex((currentIndex + 1) % screenshots.length);
    }
  };
  
  const prevImage = () => {
    if (isFullscreen) {
      setFullscreenIndex((fullscreenIndex - 1 + screenshots.length) % screenshots.length);
    } else {
      setCurrentIndex((currentIndex - 1 + screenshots.length) % screenshots.length);
    }
  };
  
  const exitFullscreen = () => {
    setFullscreenIndex(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'Escape' && isFullscreen) {
      exitFullscreen();
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      {/* Main gallery */}
      <div className="relative">
        <div className="rounded-xl overflow-hidden mb-4 relative">
          <img 
            src={screenshots[currentIndex]} 
            alt={`Screenshot ${currentIndex + 1}`} 
            className="w-full h-auto"
          />
          
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 focus:tv-focus"
            onClick={prevImage}
            tabIndex={0}
            aria-label="Previous screenshot"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 focus:tv-focus"
            onClick={nextImage}
            tabIndex={0}
            aria-label="Next screenshot"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
          
          <button 
            className="absolute right-4 bottom-4 p-3 rounded-lg bg-black/50 hover:bg-black/70 text-white focus:tv-focus"
            onClick={() => setFullscreenIndex(currentIndex)}
            tabIndex={0}
          >
            View Fullscreen
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {screenshots.map((screenshot, index) => (
            <button
              key={index}
              className={`rounded-lg overflow-hidden focus:tv-focus ${
                index === currentIndex ? 'ring-2 ring-cloud' : ''
              }`}
              onClick={() => setCurrentIndex(index)}
              tabIndex={0}
            >
              <img 
                src={screenshot} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-auto"
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Fullscreen gallery */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <img 
            src={screenshots[fullscreenIndex]} 
            alt={`Screenshot ${fullscreenIndex + 1}`} 
            className="max-w-full max-h-screen object-contain"
          />
          
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 focus:tv-focus"
            onClick={prevImage}
            tabIndex={0}
            aria-label="Previous screenshot"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>
          
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 focus:tv-focus"
            onClick={nextImage}
            tabIndex={0}
            aria-label="Next screenshot"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>
          
          <button 
            className="absolute right-6 top-6 p-2 rounded-full bg-black/50 hover:bg-black/70 focus:tv-focus"
            onClick={exitFullscreen}
            tabIndex={0}
            aria-label="Close fullscreen view"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-lg">
            {fullscreenIndex + 1} / {screenshots.length}
          </div>
        </div>
      )}
    </div>
  );
};
