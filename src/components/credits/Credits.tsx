
import React, { useState } from 'react';
import { CreditCard, Clock, ChevronDown } from 'lucide-react';
import { CreditMenu } from './CreditMenu';

export const Credits = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Mock credit data
  const credits = 250;
  const timeRemaining = "14h 30m";

  return (
    <div className="relative">
      <button 
        className="credits-display flex items-center space-x-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        onKeyDown={(e) => e.key === 'Enter' && setIsMenuOpen(!isMenuOpen)}
        tabIndex={0}
      >
        <CreditCard className="h-5 w-5" />
        <span>{credits}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isMenuOpen && <CreditMenu credits={credits} timeRemaining={timeRemaining} onClose={() => setIsMenuOpen(false)} />}
    </div>
  );
};
