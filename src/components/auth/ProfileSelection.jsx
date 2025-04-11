
import React, { useState } from 'react';
import { User, UserPlus, Check } from 'lucide-react';

export const ProfileSelection = ({ onProfileSelect }) => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  // Mock profiles
  const profiles = [
    { id: 'profile1', name: 'Player 1', avatar: '👨‍🚀' },
    { id: 'profile2', name: 'Player 2', avatar: '👩‍🚀' },
    { id: 'profile3', name: 'Kid', avatar: '👶' },
    { id: 'profile4', name: 'Guest', avatar: '👤' },
  ];

  const handleKeyNavigation = (e, index) => {
    // Handle TV remote navigation
    if (e.key === 'ArrowRight') {
      setFocusedIndex(Math.min(focusedIndex + 1, profiles.length));
    } else if (e.key === 'ArrowLeft') {
      setFocusedIndex(Math.max(focusedIndex - 1, 0));
    } else if (e.key === 'Enter') {
      if (index < profiles.length) {
        setSelectedProfile(profiles[index].id);
        setTimeout(onProfileSelect, 1000);
      } else {
        // Handle add profile
        console.log("Add new profile");
      }
    }
  };

  return (
    <div className="w-full max-w-3xl animate-fade-in">
      <h2 className="text-3xl font-bold mb-12 text-center">Who's playing?</h2>
      
      <div className="grid grid-cols-5 gap-6">
        {profiles.map((profile, index) => (
          <button
            key={profile.id}
            className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
              selectedProfile === profile.id 
                ? 'bg-cloud/20 scale-110' 
                : 'hover:bg-muted'
            } ${focusedIndex === index ? 'tv-focus' : ''}`}
            onClick={() => {
              setSelectedProfile(profile.id);
              setTimeout(onProfileSelect, 1000);
            }}
            onFocus={() => setFocusedIndex(index)}
            onKeyDown={(e) => handleKeyNavigation(e, index)}
            tabIndex={0}
          >
            <div className={`relative w-20 h-20 text-4xl flex items-center justify-center rounded-full mb-4 ${
              selectedProfile === profile.id ? 'bg-cloud' : 'bg-muted'
            }`}>
              {profile.avatar}
              {selectedProfile === profile.id && (
                <div className="absolute -bottom-2 -right-2 bg-gaming rounded-full p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <span className="text-lg font-medium">{profile.name}</span>
          </button>
        ))}
        
        <button
          className={`flex flex-col items-center p-4 rounded-xl hover:bg-muted transition-all duration-300 ${
            focusedIndex === profiles.length ? 'tv-focus' : ''
          }`}
          onFocus={() => setFocusedIndex(profiles.length)}
          onKeyDown={(e) => handleKeyNavigation(e, profiles.length)}
          tabIndex={0}
        >
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-muted mb-4">
            <UserPlus className="h-10 w-10 text-muted-foreground" />
          </div>
          <span className="text-lg font-medium">Add Profile</span>
        </button>
      </div>
      
      <p className="text-center mt-12 text-muted-foreground">
        Tip: Press and hold your controller button to quickly sign in next time
      </p>
    </div>
  );
};
