
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

interface TVOAuthFlowProps {
  onAuthSuccess: (userData: any) => void;
}

// Mock data for the device code flow (in a real app, this would come from the OAuth provider API)
const MOCK_DEVICE_CODE = {
  device_code: "GmRhmhcxhwAzkoEqiQ5m",
  user_code: "WDJB-MJHT",
  verification_url: "https://accounts.google.com/device",
  expires_in: 1800,
  interval: 5
};

export const TVOAuthFlow: React.FC<TVOAuthFlowProps> = ({ onAuthSuccess }) => {
  const [deviceCode, setDeviceCode] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string | null>(null);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pollCount, setPollCount] = useState(0);

  // In a real app, this would call the OAuth provider's API to get a device code
  const requestDeviceCode = async () => {
    try {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use mock data (in real app, this would be the API response)
      setDeviceCode(MOCK_DEVICE_CODE.device_code);
      setUserCode(MOCK_DEVICE_CODE.user_code);
      setVerificationUrl(MOCK_DEVICE_CODE.verification_url);
      setIsLoading(false);
      setIsPolling(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize the authentication flow. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // In a real app, this would poll the OAuth provider's token endpoint
  const pollForToken = async () => {
    if (!deviceCode || !isPolling) return;
    
    // Increment poll count to simulate the process
    setPollCount(prev => prev + 1);
    
    // Simulate success after several polls (in a real app, this would check if the user completed auth)
    if (pollCount > 4) {
      setIsPolling(false);
      // Mock successful authentication
      onAuthSuccess({ name: "Demo User", email: "demo@example.com" });
      toast({
        title: "Success",
        description: "You've successfully signed in!",
      });
    }
  };

  useEffect(() => {
    // Request device code on component mount
    requestDeviceCode();
  }, []);

  useEffect(() => {
    // Poll for token at regular intervals if polling is active
    let pollInterval: number | null = null;
    
    if (isPolling) {
      pollInterval = window.setInterval(pollForToken, 5000); // Poll every 5 seconds
    }
    
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isPolling, deviceCode, pollCount]);

  return (
    <div className="w-full max-w-md animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-center">Sign in with Google</h2>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-center">Initializing sign-in process...</p>
        </div>
      ) : (
        <div className="bg-card p-8 rounded-xl shadow-lg">
          <div className="flex flex-col items-center">
            {verificationUrl && (
              <div className="mb-8 p-2 bg-white rounded-lg">
                <QRCodeSVG 
                  value={`${verificationUrl}?user_code=${userCode}`}
                  size={200}
                  bgColor="#FFFFFF"
                  fgColor="#143D60"
                  level="H"
                  includeMargin={true}
                />
              </div>
            )}
            
            {userCode && (
              <div className="text-center mb-8">
                <p className="mb-2">Enter this code on your phone or computer:</p>
                <div className="flex justify-center mb-4">
                  <span className="text-3xl font-mono bg-secondary text-gaming tracking-wider p-3 rounded-lg">
                    {userCode}
                  </span>
                </div>
                <p>at <span className="text-secondary font-semibold">{verificationUrl}</span></p>
              </div>
            )}
            
            {isPolling && (
              <div className="flex items-center mt-4">
                <Loader2 className="h-5 w-5 text-primary animate-spin mr-2" />
                <span>Waiting for authentication...</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      <p className="text-center mt-8 text-muted-foreground">
        Don't have a Google account? <a href="#" className="text-primary hover:underline focus:tv-focus-text" tabIndex={0}>Sign in with another method</a>
      </p>
    </div>
  );
};
