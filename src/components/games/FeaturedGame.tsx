
import React from 'react';
import { Play, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  genres: string[];
  creditCost: number;
}

interface FeaturedGameProps {
  game: Game;
}

export const FeaturedGame: React.FC<FeaturedGameProps> = ({ game }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden h-[400px]">
      <div className="absolute inset-0">
        <img 
          src={game.image} 
          alt={game.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div className="mb-6 md:mb-0 max-w-2xl">
            <h1 className="text-4xl font-bold text-white mb-2">{game.title}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-6">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="text-white">{game.rating}</span>
              </div>
              <div className="flex items-center mr-6">
                <Clock className="h-5 w-5 text-cloud mr-1" />
                <span className="text-white">{game.creditCost} credits</span>
              </div>
            </div>
            
            <div className="flex flex-wrap mb-4">
              {game.genres.map((genre) => (
                <span 
                  key={genre} 
                  className="game-category"
                >
                  {genre}
                </span>
              ))}
            </div>
            
            <p className="text-white/80 mb-6 hidden md:block">{game.description}</p>
          </div>
          
          <div className="flex space-x-4">
            <Link
              to={`/game/${game.id}`}
              className="tv-btn bg-muted/40 backdrop-blur-sm hover:bg-muted/60 text-white"
              tabIndex={0}
            >
              Details
            </Link>
            <Link
              to={`/game/${game.id}/play`}
              className="tv-btn bg-cloud hover:bg-cloud-dark text-white flex items-center"
              tabIndex={0}
            >
              <Play className="h-5 w-5 mr-2" />
              Play Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
