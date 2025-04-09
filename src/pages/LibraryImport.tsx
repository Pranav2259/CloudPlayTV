
import React, { useState } from 'react';
import { TVLayout } from '../components/layout/TVLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, RefreshCw, Filter, SortDesc, Gamepad2 } from 'lucide-react';

// Platform connection data
const platforms = [
  { 
    id: 'steam', 
    name: 'Steam', 
    logo: 'https://via.placeholder.com/40x40/0F172A/60A5FA?text=Steam',
    color: '#1a9fff',
    connected: true
  },
  { 
    id: 'epic', 
    name: 'Epic Games', 
    logo: 'https://via.placeholder.com/40x40/0F172A/F9D923?text=Epic',
    color: '#f4bd27',
    connected: false
  },
  { 
    id: 'microsoft', 
    name: 'Microsoft', 
    logo: 'https://via.placeholder.com/40x40/0F172A/7CBB00?text=MS',
    color: '#7CBB00',
    connected: false
  },
  { 
    id: 'xbox', 
    name: 'Xbox', 
    logo: 'https://via.placeholder.com/40x40/0F172A/107C10?text=Xbox',
    color: '#107C10',
    connected: true
  }
];

// Mock imported games data
const importedGames = [
  {
    id: 'game1',
    title: 'Cyberpunk 2077',
    image: 'https://via.placeholder.com/300x400/0F172A/60A5FA?text=Cyberpunk',
    platform: 'steam',
    installed: true,
    size: 62.4,
    lastPlayed: '2 days ago'
  },
  {
    id: 'game2',
    title: 'Fortnite',
    image: 'https://via.placeholder.com/300x400/0F172A/F9D923?text=Fortnite',
    platform: 'epic',
    installed: false,
    size: 25.7,
    lastPlayed: 'Never'
  },
  {
    id: 'game3',
    title: 'Halo Infinite',
    image: 'https://via.placeholder.com/300x400/0F172A/107C10?text=Halo',
    platform: 'xbox',
    installed: true,
    size: 75.2,
    lastPlayed: '3 weeks ago'
  },
  {
    id: 'game4',
    title: 'Red Dead 2',
    image: 'https://via.placeholder.com/300x400/0F172A/E8372A?text=RDR2',
    platform: 'steam',
    installed: false,
    size: 112.8,
    lastPlayed: '2 months ago'
  },
  {
    id: 'game5',
    title: 'Flight Simulator',
    image: 'https://via.placeholder.com/300x400/0F172A/00A8E8?text=MSFS',
    platform: 'microsoft',
    installed: true,
    size: 98.3,
    lastPlayed: 'Yesterday'
  },
  {
    id: 'game6',
    title: 'Elden Ring',
    image: 'https://via.placeholder.com/300x400/0F172A/FAAE2B?text=Elden',
    platform: 'steam',
    installed: false,
    size: 45.6,
    lastPlayed: 'Never'
  },
  {
    id: 'game7',
    title: 'Destiny 2',
    image: 'https://via.placeholder.com/300x400/0F172A/0F172A?text=Destiny',
    platform: 'steam',
    installed: true,
    size: 82.1,
    lastPlayed: '1 week ago'
  },
  {
    id: 'game8',
    title: 'Forza Horizon 5',
    image: 'https://via.placeholder.com/300x400/0F172A/FF9F0A?text=Forza',
    platform: 'xbox',
    installed: true,
    size: 110.5,
    lastPlayed: '5 days ago'
  }
];

// Downloads in progress
const activeDownloads = [
  {
    id: 'dl1',
    title: 'Starfield',
    platform: 'xbox',
    progress: 65,
    size: 95.2,
    speed: '24.5 MB/s'
  }
];

export default function LibraryImport() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('lastPlayed');
  const [storageUsed, setStorageUsed] = useState(430.5);
  const [storageTotal, setStorageTotal] = useState(1000);
  
  // Filter games by selected platform
  const filteredGames = selectedPlatform 
    ? importedGames.filter(game => game.platform === selectedPlatform)
    : importedGames;
    
  // Get platform by ID
  const getPlatform = (id: string) => {
    return platforms.find(p => p.id === id) || { name: 'Unknown', color: '#808080' };
  };
  
  // Calculate storage usage percentage
  const storagePercentage = (storageUsed / storageTotal) * 100;

  return (
    <TVLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="bg-card p-6 border-b border-muted">
          <h2 className="text-2xl font-bold mb-6">Import Your Game Library</h2>
          
          {/* Platform connections */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium">Connect Platforms</h3>
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2 focus:tv-focus"
                  tabIndex={0}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {platforms.map(platform => (
                <Card 
                  key={platform.id}
                  className={`p-4 border-2 ${platform.connected ? `border-${platform.id} hover:bg-${platform.id}/10` : 'border-muted'} cursor-pointer focus:tv-focus`}
                  onClick={() => setSelectedPlatform(platform.id === selectedPlatform ? null : platform.id)}
                  tabIndex={0}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded overflow-hidden">
                        <img src={platform.logo} alt={platform.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-medium">{platform.name}</h4>
                        <span className={`text-sm ${platform.connected ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {platform.connected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      variant={platform.connected ? "secondary" : "default"}
                      size="sm"
                      className="focus:tv-focus"
                      tabIndex={0}
                    >
                      {platform.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                  
                  {platform.connected && (
                    <div className="mt-4 flex items-center">
                      <input
                        type="checkbox"
                        id={`sync-${platform.id}`}
                        className="mr-2 rounded focus:tv-focus"
                        defaultChecked
                        tabIndex={0}
                      />
                      <label htmlFor={`sync-${platform.id}`} className="text-sm">
                        Sync my library automatically
                      </label>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
          
          {/* Storage usage */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-medium">Storage</h3>
              <span className="text-muted-foreground">{storageUsed.toFixed(1)}GB / {storageTotal}GB used</span>
            </div>
            <Progress value={storagePercentage} className="h-4" />
          </div>
          
          {/* Active downloads */}
          {activeDownloads.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-4">Downloads in Progress</h3>
              <div className="space-y-4">
                {activeDownloads.map(download => (
                  <Card key={download.id} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-3">
                        <span className={`w-3 h-3 rounded-full bg-${download.platform}`}></span>
                        <h4 className="font-medium">{download.title}</h4>
                      </div>
                      <span className="text-sm text-muted-foreground">{download.speed}</span>
                    </div>
                    <div className="mb-2">
                      <Progress value={download.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{download.progress}%</span>
                      <span>{(download.size * download.progress / 100).toFixed(1)}GB / {download.size}GB</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Game library grid */}
        <div className="flex-1 overflow-y-auto p-6 tv-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Game Library</h2>
            <div className="flex space-x-4">
              <div className="flex rounded-lg overflow-hidden border border-muted">
                <Button 
                  variant="ghost"
                  className="flex items-center p-2 focus:tv-focus"
                  onClick={() => setSortBy('lastPlayed')}
                  tabIndex={0}
                  aria-label="Sort games"
                >
                  <SortDesc className="h-5 w-5 mr-2" />
                  Sort
                </Button>
                <Button 
                  variant="ghost"
                  className="flex items-center p-2 focus:tv-focus"
                  tabIndex={0}
                  aria-label="Filter games"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </div>
          
          {/* Controller shortcuts */}
          <div className="flex space-x-6 mb-6 p-3 bg-card rounded-lg">
            <div className="flex items-center">
              <Gamepad2 className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Controller shortcuts:</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-bold mr-2">Y</span>
              <span className="text-sm">Refresh Library</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-bold mr-2">X</span>
              <span className="text-sm">Sort Games</span>
            </div>
          </div>
          
          {/* Game grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredGames.map(game => (
              <div 
                key={game.id}
                className="game-card focus:outline-none"
                tabIndex={0}
              >
                <div className="relative">
                  <div className="rounded-xl overflow-hidden aspect-[3/4]">
                    <img 
                      src={game.image} 
                      alt={game.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Platform badge */}
                  <div className="absolute top-2 left-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: getPlatform(game.platform).color }}
                    >
                      <span className="text-xs font-bold text-white">
                        {game.platform.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="game-card-overlay rounded-xl"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white">{game.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-white text-sm">{game.size} GB</span>
                      <span className="text-white/70 text-xs">{game.lastPlayed}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  className="w-full mt-2 focus:tv-focus"
                  variant={game.installed ? "secondary" : "default"}
                  tabIndex={0}
                >
                  {game.installed ? 'Play' : (
                    <span className="flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      Install
                    </span>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TVLayout>
  );
}
