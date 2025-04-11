
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, Settings, Library } from 'lucide-react';

export const TopNavigation = () => {
  const location = useLocation();
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Library', path: '/library', icon: Library },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleKeyDown = (e, index) => {
    // Handle TV remote navigation
    if (e.key === 'ArrowRight') {
      setFocusedIndex(Math.min(focusedIndex + 1, navItems.length - 1));
    } else if (e.key === 'ArrowLeft') {
      setFocusedIndex(Math.max(focusedIndex - 1, 0));
    }
  };

  return (
    <ul className="flex space-x-8 items-center">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        const isFocused = focusedIndex === index;
        
        return (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`flex items-center space-x-2 py-2 px-4 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-muted text-cloud-focus' : 'text-foreground'
              } ${isFocused ? 'tv-focus' : ''}`}
              onFocus={() => setFocusedIndex(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={0}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-lg">{item.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
