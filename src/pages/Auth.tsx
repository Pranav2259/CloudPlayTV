
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ProfileSelection } from '../components/auth/ProfileSelection';
import { TVOAuthFlow } from '../components/auth/TVOAuthFlow';

export default function Auth() {
  const navigate = useNavigate();
  const [authStep, setAuthStep] = useState<'welcome' | 'oauth' | 'profiles'>('welcome');
  
  const handleContinue = () => {
    if (authStep === 'welcome') {
      setAuthStep('oauth');
    } else {
      navigate('/');
    }
  };

  const handleAuthSuccess = () => {
    setAuthStep('profiles');
  };

  const handleBack = () => {
    if (authStep === 'oauth') {
      setAuthStep('welcome');
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-card">
      {authStep !== 'welcome' && (
        <button 
          className="absolute top-8 left-8 p-2 rounded-full bg-card hover:bg-muted transition-colors"
          onClick={handleBack}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </button>
      )}

      {authStep === 'welcome' && (
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cloud to-secondary bg-clip-text text-transparent">
            Welcome to CloudPlay
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto">
            Dive into a universe of infinite gameplay, where cutting-edge cloud technology transforms your TV into a portal to extraordinary gaming realms. No wait times. No limits. Just pure gaming magic at your fingertips.
          </p>
          
          <button 
            className="tv-btn bg-primary hover:bg-primary/90 text-background"
            onClick={handleContinue}
            tabIndex={0}
          >
            Get Started
          </button>
        </div>
      )}
      
      {authStep === 'oauth' && (
        <TVOAuthFlow onAuthSuccess={handleAuthSuccess} />
      )}
      
      {authStep === 'profiles' && (
        <ProfileSelection onProfileSelect={() => navigate('/')} />
      )}
    </div>
  );
}
