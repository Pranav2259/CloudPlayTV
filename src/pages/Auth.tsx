
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { TVOAuthFlow } from '../components/auth/TVOAuthFlow';
import { SignUp } from '../components/auth/SignUp';
import { Login } from '../components/auth/Login';

export default function Auth() {
  const navigate = useNavigate();
  const [authStep, setAuthStep] = useState<'welcome' | 'oauth' | 'signup' | 'login'>('welcome');
  
  const handleContinue = () => {
    if (authStep === 'welcome') {
      setAuthStep('login');
    }
  };

  const handleAuthSuccess = (userData: any) => {
    // In a real app, store user data in context or state management
    console.log("Authentication successful:", userData);
    navigate('/');
  };

  const handleBack = () => {
    if (authStep === 'oauth' || authStep === 'signup' || authStep === 'login') {
      setAuthStep('welcome');
    }
  };

  // Handle anchor hash changes
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#oauth') {
        setAuthStep('oauth');
      } else if (hash === '#signup') {
        setAuthStep('signup');
      } else if (hash === '#signin') {
        setAuthStep('login');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Check hash on initial load
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

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
            Experience gaming without limits. Instant access to hundreds of premium games, no hardware constraints, and seamless play across all your devices. It's not just cloud gaming - it's gaming evolved.
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
      
      {authStep === 'signup' && (
        <SignUp onSignUpSuccess={handleAuthSuccess} />
      )}
      
      {authStep === 'login' && (
        <Login onLoginSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}
