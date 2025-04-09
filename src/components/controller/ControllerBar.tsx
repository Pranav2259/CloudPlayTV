
import React, { useState } from 'react';
import { Gamepad2, ChevronDown, User, UserPlus } from 'lucide-react';
import { ControllerDropdown } from './ControllerDropdown';

export const ControllerBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Mock controller data
  const controllers = [
    { id: 'controller1', name: 'Controller 1', user: 'Player 1', status: 'connected', battery: 80 },
    { id: 'controller2', name: 'Controller 2', user: 'Player 2', status: 'connected', battery: 45 },
    { id: 'controller3', name: 'Controller 3', user: null, status: 'disconnected', battery: 0 },
  ];

  const connectedControllers = controllers.filter(c => c.status === 'connected');

  return (
    <div className="relative">
      <button 
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${isDropdownOpen ? 'bg-muted' : ''}`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onKeyDown={(e) => e.key === 'Enter' && setIsDropdownOpen(!isDropdownOpen)}
        tabIndex={0}
      >
        <div className="flex items-center">
          <Gamepad2 className="h-6 w-6 text-cloud" />
          <span className="ml-2 font-medium">{connectedControllers.length}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {isDropdownOpen && <ControllerDropdown controllers={controllers} onClose={() => setIsDropdownOpen(false)} />}
    </div>
  );
};
