
import React, { useState } from 'react';
import { TopNavigation } from './TopNavigation';
import { ControllerBar } from '../controller/ControllerBar';
import { Credits } from '../credits/Credits';
import { BellRing, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TVLayoutProps {
  children: React.ReactNode;
}

export const TVLayout: React.FC<TVLayoutProps> = ({ children }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // In a real app, this would come from auth context
  const username = "Demo User";
  
  const handleLogout = () => {
    // In a real app, this would clear auth tokens, etc.
    navigate('/auth');
  };
  
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      <header className="w-full py-4 px-8 flex items-center justify-between bg-gaming shadow-md">
        <div className="flex items-center space-x-6">
          <nav className="flex">
            <TopNavigation />
          </nav>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <button 
              className="p-2 rounded-full hover:bg-gaming-dark focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <BellRing className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </button>
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-card rounded-lg shadow-lg overflow-hidden z-50">
                <div className="p-4 border-b border-muted">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="p-2">
                  <p className="text-sm text-muted-foreground p-4 text-center">No new notifications</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gaming-dark focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <User className="h-5 w-5" />
              <span className="font-medium">{username}</span>
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg overflow-hidden z-50">
                <div className="p-1">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted rounded-md"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <Credits />
          <ControllerBar />
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
