
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Gamepad2, ChevronRight, User, Users } from 'lucide-react';
import { ProfileSelection } from '../components/auth/ProfileSelection';

export default function Auth() {
  const navigate = useNavigate();
  const [authStep, setAuthStep] = useState<'welcome' | 'method' | 'profiles'>('welcome');
  
  const handleContinue = () => {
    if (authStep === 'welcome') {
      setAuthStep('method');
    } else if (authStep === 'method') {
      setAuthStep('profiles');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-card">
      {authStep === 'welcome' && (
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cloud to-gaming-light bg-clip-text text-transparent">
            Welcome to CloudPlay
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto">
            Dive into a universe of infinite gameplay, where cutting-edge cloud technology transforms your TV into a portal to extraordinary gaming realms. No wait times. No limits. Just pure gaming magic at your fingertips.
          </p>
          
          <button 
            className="tv-btn bg-cloud hover:bg-cloud-dark text-white"
            onClick={handleContinue}
            tabIndex={0}
          >
            Get Started
          </button>
        </div>
      )}
      
      {authStep === 'method' && (
        <div className="w-full max-w-md animate-fade-in">
          <h2 className="text-3xl font-bold mb-8 text-center">Choose how to sign in</h2>
          
          <div className="space-y-4">
            <button 
              className="tv-btn w-full flex items-center justify-between bg-card hover:bg-muted text-foreground"
              onClick={handleContinue}
              tabIndex={0}
            >
              <div className="flex items-center">
                <Mail className="h-6 w-6 mr-4 text-cloud" />
                <span>Sign in with Gmail</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            
            <button 
              className="tv-btn w-full flex items-center justify-between bg-card hover:bg-muted text-foreground"
              onClick={handleContinue}
              tabIndex={0}
            >
              <div className="flex items-center">
                <Gamepad2 className="h-6 w-6 mr-4 text-gaming" />
                <span>Sign in with Controller</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          
          <p className="text-center mt-8 text-muted-foreground">
            Don't have an account? <a href="#" className="text-cloud hover:underline focus:tv-focus-text" tabIndex={0}>Create one</a>
          </p>
        </div>
      )}
      
      {authStep === 'profiles' && (
        <ProfileSelection onProfileSelect={() => navigate('/')} />
      )}
    </div>
  );
}
