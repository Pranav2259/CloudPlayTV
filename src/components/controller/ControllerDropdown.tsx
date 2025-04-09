
import React from 'react';
import { User, UserPlus, Battery, BatteryWarning, BatteryFull, BatteryMedium, BatteryLow } from 'lucide-react';

interface Controller {
  id: string;
  name: string;
  user: string | null;
  status: 'connected' | 'disconnected';
  battery: number;
}

interface ControllerDropdownProps {
  controllers: Controller[];
  onClose: () => void;
}

export const ControllerDropdown: React.FC<ControllerDropdownProps> = ({ controllers, onClose }) => {
  // Get appropriate battery icon based on level
  const getBatteryIcon = (level: number) => {
    if (level > 70) return <BatteryFull className="h-5 w-5 text-gaming" />;
    if (level > 30) return <BatteryMedium className="h-5 w-5 text-yellow-500" />;
    if (level > 10) return <BatteryLow className="h-5 w-5 text-red-500" />;
    return <BatteryWarning className="h-5 w-5 text-red-500" />;
  };

  return (
    <div 
      className="absolute right-0 top-full mt-2 w-80 rounded-lg bg-card shadow-lg z-50 animate-fade-in overflow-hidden"
      tabIndex={-1}
      onBlur={(e) => {
        // Close if focus moves outside the dropdown
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onClose();
        }
      }}
    >
      <div className="p-4 border-b border-muted">
        <h3 className="text-lg font-medium">Controllers</h3>
      </div>
      
      <ul className="py-2">
        {controllers.map((controller) => (
          <li key={controller.id} className="px-4 py-3 hover:bg-muted focus-within:bg-muted">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  controller.status === 'connected' ? 'bg-gaming' : 'bg-muted-foreground'
                }`} />
                <div>
                  <p className="font-medium">{controller.name}</p>
                  {controller.user ? (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-1" />
                      <span>{controller.user}</span>
                    </div>
                  ) : (
                    <button 
                      className="flex items-center text-sm text-cloud hover:underline focus:tv-focus-text"
                      tabIndex={0}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      <span>Assign user</span>
                    </button>
                  )}
                </div>
              </div>
              {controller.status === 'connected' && (
                <div className="flex items-center">
                  {getBatteryIcon(controller.battery)}
                  <span className="ml-1 text-sm">{controller.battery}%</span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      
      <div className="p-4 border-t border-muted">
        <button 
          className="w-full py-2 bg-muted rounded-lg text-center hover:bg-accent focus:tv-focus"
          tabIndex={0}
        >
          Pair New Controller
        </button>
      </div>
    </div>
  );
};
