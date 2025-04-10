
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from 'lucide-react';

interface TVOAuthFlowProps {
  onAuthSuccess: (userData: any) => void;
}

// This would be implemented with a proper OAuth provider API in a production app
// The code below simulates an API response but would be replaced with actual API calls
const fetchDeviceCode = async () => {
  // In a real implementation, this would call an OAuth provider API
  // Example: POST https://oauth2.googleapis.com/device/code
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // This simulates the response that would come from an OAuth provider
    return {
      device_code: "ABC-" + Math.random().toString(36).substring(2, 10),
      user_code: "ABCD-1234",
      verification_url: "https://example.com/device",
      expires_in: 1800,
      interval: 5
    };
  } catch (error) {
    throw new Error("Failed to fetch device code");
  }
};

export const TVOAuthFlow: React.FC<TVOAuthFlowProps> = ({ onAuthSuccess }) => {
  const [deviceCode, setDeviceCode] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string | null>(null);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Request a new device code
  const requestDeviceCode = async () => {
    try {
      setIsLoading(true);
      setIsRefreshing(true);
      
      // This would be an actual API call in production
      const response = await fetchDeviceCode();
      
      setDeviceCode(response.device_code);
      setUserCode(response.user_code);
      setVerificationUrl(response.verification_url);
      
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize the authentication flow. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Request device code on component mount
    requestDeviceCode();
  }, []);

  return (
    <div className="w-full max-w-md animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-center">Sign in with Device Code</h2>
      
      {isLoading && !isRefreshing ? (
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
            
            <button
              onClick={requestDeviceCode}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-card hover:bg-muted transition-colors rounded-lg"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              <span>Refresh Code</span>
            </button>
          </div>
        </div>
      )}
      
      <div className="text-center mt-8">
        <p className="text-muted-foreground mb-4">
          Don't have an account?
        </p>
        <a href="#signup" className="text-primary hover:underline focus:tv-focus-text px-4 py-2 bg-card hover:bg-muted transition-colors rounded-lg" tabIndex={0}>
          Create a CloudPlay Account
        </a>
      </div>
    </div>
  );
};
