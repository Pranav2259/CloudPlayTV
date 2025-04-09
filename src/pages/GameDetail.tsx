
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, ArrowLeft, Star, Clock, Download, Share, Heart } from 'lucide-react';
import { TVLayout } from '../components/layout/TVLayout';
import { GameScreenshots } from '../components/games/GameScreenshots';

// Mock game data
const gameData = {
  id: 'game1',
  title: 'Cyber Odyssey 2077',
  description: 'Embark on an epic adventure in a futuristic open world. Battle corporations, customize your character, and change the fate of the city. With branching storylines and deep character progression, every choice matters in this immersive RPG experience.',
  longDescription: 'In Cyber Odyssey 2077, you take on the role of V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality. You can customize your character's cyberware, skillset and playstyle, and explore a vast city where the choices you make shape the story and the world around you.\n\nFeaturing a non-linear storyline, player-driven choices, and multiple endings, this open-world adventure redefines the gaming experience with its detailed character creation, deep progression systems, and stunning visual design.',
  image: 'https://via.placeholder.com/1200x500/0F172A/60A5FA?text=Cyber+Odyssey+2077',
  rating: 4.7,
  releaseDate: 'June 15, 2023',
  developer: 'Night City Studios',
  publisher: 'Cloud Gaming Inc.',
  genres: ['RPG', 'Open World', 'Action', 'Cyberpunk'],
  tags: ['Single Player', 'Controller Support', 'First-Person', 'Third-Person', 'Futuristic'],
  creditCost: 20,
  playtime: '40+ hours',
  ageRating: 'M (Mature)',
  screenshots: [
    'https://via.placeholder.com/800x450/0F172A/60A5FA?text=Screenshot+1',
    'https://via.placeholder.com/800x450/0F172A/10B981?text=Screenshot+2',
    'https://via.placeholder.com/800x450/0F172A/F97316?text=Screenshot+3',
    'https://via.placeholder.com/800x450/0F172A/8B5CF6?text=Screenshot+4',
  ]
};

export default function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // In a real app, we would fetch the game data based on the id
  const game = gameData;
  
  return (
    <TVLayout>
      <div className="h-full overflow-y-auto tv-scrollbar">
        {/* Hero section with game cover */}
        <div className="relative h-[400px]">
          <img 
            src={game.image} 
            alt={game.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          
          <div className="absolute top-6 left-6">
            <Link 
              to="/"
              className="flex items-center text-white hover:text-cloud p-2 rounded-full bg-black/30 focus:tv-focus"
              tabIndex={0}
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </div>
        </div>
        
        {/* Game details */}
        <div className="px-8 py-6">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-3">{game.title}</h1>
              <div className="flex flex-wrap items-center mb-4">
                <div className="flex items-center mr-6">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span>{game.rating}</span>
                </div>
                <div className="flex items-center mr-6">
                  <Clock className="h-5 w-5 text-muted-foreground mr-1" />
                  <span>{game.playtime}</span>
                </div>
                <span className="mr-6">{game.releaseDate}</span>
                <span className="mr-6">{game.ageRating}</span>
              </div>
              
              <div className="flex flex-wrap mb-4">
                {game.genres.map((genre) => (
                  <span key={genre} className="game-category">{genre}</span>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                className="p-3 rounded-full bg-muted hover:bg-muted/80 focus:tv-focus"
                tabIndex={0}
                aria-label="Download game"
              >
                <Download className="h-6 w-6" />
              </button>
              <button 
                className="p-3 rounded-full bg-muted hover:bg-muted/80 focus:tv-focus"
                tabIndex={0}
                aria-label="Add to favorites"
              >
                <Heart className="h-6 w-6" />
              </button>
              <button 
                className="p-3 rounded-full bg-muted hover:bg-muted/80 focus:tv-focus"
                tabIndex={0}
                aria-label="Share game"
              >
                <Share className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              {/* Tabs */}
              <div className="border-b border-muted mb-6">
                <div className="flex space-x-8">
                  {['overview', 'screenshots', 'details'].map((tab) => (
                    <button
                      key={tab}
                      className={`py-3 px-1 font-medium capitalize transition-all ${
                        selectedTab === tab 
                          ? 'text-cloud border-b-2 border-cloud' 
                          : 'text-muted-foreground hover:text-foreground'
                      } focus:tv-focus-text`}
                      onClick={() => setSelectedTab(tab)}
                      tabIndex={0}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tab content */}
              <div className="mb-8">
                {selectedTab === 'overview' && (
                  <div>
                    <p className="text-lg mb-6">{game.longDescription}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Developer</h3>
                        <p>{game.developer}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Publisher</h3>
                        <p>{game.publisher}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedTab === 'screenshots' && (
                  <GameScreenshots screenshots={game.screenshots} />
                )}
                
                {selectedTab === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Tags</h3>
                      <div className="flex flex-wrap">
                        {game.tags.map((tag) => (
                          <span key={tag} className="game-category">{tag}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">System Requirements</h3>
                      <p>This game runs in the cloud, so you don't need a powerful system.</p>
                      <p>Minimum: 15 Mbps internet connection</p>
                      <p>Recommended: 25+ Mbps internet connection</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="bg-card rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Play Now</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground">Cost per session:</span>
                  <span className="credit-amount">{game.creditCost}</span>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Your current balance:</p>
                  <div className="credits-display w-full text-center">250 credits</div>
                </div>
                
                <Link
                  to={`/game/${game.id}/play`}
                  className="tv-btn w-full bg-cloud hover:bg-cloud-dark text-white flex items-center justify-center"
                  tabIndex={0}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Play Now
                </Link>
              </div>
              
              <div className="bg-card rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Players Also Like</h3>
                <div className="space-y-4">
                  {['Neon Samurai', 'Future City', 'Robot Wars'].map((game) => (
                    <Link
                      key={game}
                      to="#"
                      className="flex items-center p-2 rounded-lg hover:bg-muted focus:tv-focus"
                      tabIndex={0}
                    >
                      <div className="w-16 h-16 rounded-md overflow-hidden mr-3">
                        <img 
                          src={`https://via.placeholder.com/64x64/0F172A/60A5FA?text=${game.replace(' ', '+')}`} 
                          alt={game} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{game}</h4>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          <span className="text-sm text-muted-foreground">4.5</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TVLayout>
  );
}
