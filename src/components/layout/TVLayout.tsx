
import React, { useState } from 'react';
import { TopNavigation } from './TopNavigation';
import { ControllerBar } from '../controller/ControllerBar';
import { Credits } from '../credits/Credits';
import { BellRing, ChevronDown } from 'lucide-react';

interface TVLayoutProps {
  children: React.ReactNode;
}

export const TVLayout: React.FC<TVLayoutProps> = ({ children }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      <header className="w-full py-4 px-8 flex items-center justify-between bg-gray-800">
        <div className="flex items-center space-x-6">
          <h1 className="flex items-center text-3xl font-bold">
            <span className="text-white mr-1">Game</span>
            <span className="bg-white text-black px-1 rounded">X</span>
          </h1>
          <nav className="hidden md:flex">
            <TopNavigation />
          </nav>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <button 
              className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
          <Credits />
          <ControllerBar />
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};
