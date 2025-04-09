
import React from 'react';
import { TopNavigation } from './TopNavigation';
import { ControllerBar } from '../controller/ControllerBar';
import { Credits } from '../credits/Credits';

interface TVLayoutProps {
  children: React.ReactNode;
}

export const TVLayout: React.FC<TVLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      <header className="w-full py-4 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cloud to-gaming-light bg-clip-text text-transparent">
            CloudPlay
          </h1>
          <nav className="hidden md:flex">
            <TopNavigation />
          </nav>
        </div>
        <div className="flex items-center space-x-6">
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
