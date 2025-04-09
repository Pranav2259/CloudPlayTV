
import React, { useState } from 'react';
import { Gamepad } from 'lucide-react';
import { ControllerDropdown } from './ControllerDropdown';

interface Controller {
  id: string;
  name: string;
  user: string;
  status: "connected" | "disconnected";
  battery: number;
}

export const ControllerBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Mock controller data
  const controllers: Controller[] = [
    {
      id: 'controller1',
      name: 'Xbox Controller',
      user: 'Player 1',
      status: "connected",
      battery: 85
    },
    {
      id: 'controller2',
      name: 'PlayStation Controller',
      user: 'Player 2',
      status: "connected",
      battery: 62
    },
    {
      id: 'controller3',
      name: 'Switch Controller',
      user: 'Guest',
      status: "disconnected",
      battery: 20
    }
  ];
  
  const connectedCount = controllers.filter(c => c.status === "connected").length;

  return (
    <div className="relative">
      <button 
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label="Controller status"
        tabIndex={0}
      >
        <Gamepad className="h-5 w-5" />
        <span>{connectedCount}</span>
      </button>
      
      {isDropdownOpen && <ControllerDropdown controllers={controllers} onClose={() => setIsDropdownOpen(false)} />}
    </div>
  );
};
