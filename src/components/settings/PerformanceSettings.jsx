
import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Gauge, 
  Wifi, 
  ArrowDown, 
  ArrowUp, 
  HardDrive, 
  Clock 
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const PerformanceSettings = () => {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState({
    serverLocation: 'US East (N. Virginia)',
    latency: '45ms',
    downloadSpeed: '125 Mbps',
    uploadSpeed: '35 Mbps',
    dataUsed: '2.5 GB',
    storageUsed: '4.2 GB / 10 GB',
    lastRefresh: new Date().toLocaleTimeString()
  });

  // Simulate fetching performance data
  const refreshPerformanceData = () => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // In a real app, this would be replaced with actual API calls
      const updatedData = {
        ...performanceData,
        latency: `${Math.floor(Math.random() * 40 + 20)}ms`,
        downloadSpeed: `${Math.floor(Math.random() * 50 + 100)} Mbps`,
        uploadSpeed: `${Math.floor(Math.random() * 20 + 25)} Mbps`,
        lastRefresh: new Date().toLocaleTimeString()
      };
      
      setPerformanceData(updatedData);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    refreshPerformanceData();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Performance Settings</h2>
        <Button 
          onClick={refreshPerformanceData} 
          variant="outline"
          className="tv-btn"
          disabled={loading}
          tabIndex={0}
        >
          Refresh Metrics
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-6">
        View and monitor your system performance metrics
      </p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Server className="mr-2 h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Server Location</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-6 w-full" />
              ) : (
                <p className="text-lg">{performanceData.serverLocation}</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Latency</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-6 w-full" />
              ) : (
                <p className="text-lg">{performanceData.latency}</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Wifi className="mr-2 h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Internet Speed</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <ArrowDown className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Download: {performanceData.downloadSpeed}</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowUp className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Upload: {performanceData.uploadSpeed}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <HardDrive className="mr-2 h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Storage</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                <div className="space-y-2">
                  <div>
                    <span>Storage Used: {performanceData.storageUsed}</span>
                    <div className="w-full bg-muted rounded-full h-2 mt-1">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  <div>
                    <span>Data Used: {performanceData.dataUsed}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-right text-sm text-muted-foreground">
              Last updated: {performanceData.lastRefresh}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceSettings;
