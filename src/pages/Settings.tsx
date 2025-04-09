
import React, { useState } from 'react';
import { TVLayout } from '../components/layout/TVLayout';
import { User, Users, CreditCard, Gamepad2, Display, BellRing, Shield, HelpCircle, LogOut } from 'lucide-react';

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState('profile');
  const [focusedSettingIndex, setFocusedSettingIndex] = useState(0);
  
  // Settings categories
  const settingsCategories = [
    { id: 'profile', name: 'User Profile', icon: User },
    { id: 'family', name: 'Family & Profiles', icon: Users },
    { id: 'credit', name: 'Credit & Billing', icon: CreditCard },
    { id: 'controllers', name: 'Controllers', icon: Gamepad2 },
    { id: 'display', name: 'Display & Sound', icon: Display },
    { id: 'notifications', name: 'Notifications', icon: BellRing },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'help', name: 'Help & Support', icon: HelpCircle },
  ];
  
  const handleKeyNavigation = (e: React.KeyboardEvent, index: number) => {
    // Handle TV remote navigation for settings sidebar
    if (e.key === 'ArrowDown') {
      if (index < settingsCategories.length - 1) {
        setFocusedSettingIndex(index + 1);
        const nextItem = document.getElementById(`setting-${index + 1}`);
        nextItem?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      if (index > 0) {
        setFocusedSettingIndex(index - 1);
        const prevItem = document.getElementById(`setting-${index - 1}`);
        prevItem?.focus();
      }
    }
  };
  
  // Mock user data
  const userData = {
    name: 'Player 1',
    email: 'player1@example.com',
    avatar: '👨‍🚀',
    memberSince: 'June 2023',
    language: 'English',
    timezone: 'Pacific Time (GMT-8)',
    parental: 'None',
  };

  return (
    <TVLayout>
      <div className="h-full flex">
        {/* Settings sidebar */}
        <div className="w-64 bg-card border-r border-muted">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Settings</h2>
            
            <nav className="space-y-1">
              {settingsCategories.map((category, index) => (
                <button
                  key={category.id}
                  id={`setting-${index}`}
                  className={`w-full flex items-center py-3 px-4 rounded-lg transition-colors ${
                    selectedTab === category.id
                      ? 'bg-cloud text-white'
                      : 'hover:bg-muted'
                  } ${focusedSettingIndex === index ? 'tv-focus' : ''}`}
                  onClick={() => setSelectedTab(category.id)}
                  onFocus={() => setFocusedSettingIndex(index)}
                  onKeyDown={(e) => handleKeyNavigation(e, index)}
                  tabIndex={0}
                >
                  <category.icon className="h-5 w-5 mr-3" />
                  <span>{category.name}</span>
                </button>
              ))}
            </nav>
            
            <div className="mt-auto pt-6 border-t border-muted mt-8">
              <button
                className="w-full flex items-center py-3 px-4 rounded-lg text-red-500 hover:bg-muted focus:tv-focus"
                tabIndex={0}
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Settings content */}
        <div className="flex-1 overflow-y-auto p-8 tv-scrollbar">
          {selectedTab === 'profile' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">User Profile</h2>
              
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-4xl mr-6">
                  {userData.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{userData.name}</h3>
                  <p className="text-muted-foreground">{userData.email}</p>
                  <p className="text-sm text-muted-foreground">Member since {userData.memberSince}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Profile Information</h3>
                    <div className="bg-card rounded-lg divide-y divide-muted">
                      <div className="p-4 flex justify-between items-center">
                        <span className="text-muted-foreground">Display Name</span>
                        <div className="flex items-center">
                          <span>{userData.name}</span>
                          <button 
                            className="ml-3 text-cloud hover:underline focus:tv-focus-text"
                            tabIndex={0}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <span className="text-muted-foreground">Email</span>
                        <span>{userData.email}</span>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <span className="text-muted-foreground">Avatar</span>
                        <div className="flex items-center">
                          <span>{userData.avatar}</span>
                          <button 
                            className="ml-3 text-cloud hover:underline focus:tv-focus-text"
                            tabIndex={0}
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Security</h3>
                    <div className="bg-card rounded-lg divide-y divide-muted">
                      <div className="p-4 flex justify-between items-center">
                        <span className="text-muted-foreground">Password</span>
                        <button 
                          className="text-cloud hover:underline focus:tv-focus-text"
                          tabIndex={0}
                        >
                          Change Password
                        </button>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <span className="text-muted-foreground">Two-Factor Authentication</span>
                        <button 
                          className="text-cloud hover:underline focus:tv-focus-text"
                          tabIndex={0}
                        >
                          Enable
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Preferences</h3>
                    <div className="bg-card rounded-lg divide-y divide-muted">
                      <div className="p-4 flex justify-between items-center">
                        <span className="text-muted-foreground">Language</span>
                        <div className="flex items-center">
                          <span>{userData.language}</span>
                          <button 
                            className="ml-3 text-cloud hover:underline focus:tv-focus-text"
                            tabIndex={0}
                          >
                            Change
                          </button>
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <span className="text-muted-foreground">Time Zone</span>
                        <div className="flex items-center">
                          <span>{userData.timezone}</span>
                          <button 
                            className="ml-3 text-cloud hover:underline focus:tv-focus-text"
                            tabIndex={0}
                          >
                            Change
                          </button>
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <span className="text-muted-foreground">Parental Controls</span>
                        <div className="flex items-center">
                          <span>{userData.parental}</span>
                          <button 
                            className="ml-3 text-cloud hover:underline focus:tv-focus-text"
                            tabIndex={0}
                          >
                            Setup
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Connected Accounts</h3>
                    <button 
                      className="w-full py-3 bg-muted rounded-lg text-center hover:bg-muted/80 focus:tv-focus"
                      tabIndex={0}
                    >
                      Connect Social Accounts
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Delete Account</h3>
                    <button 
                      className="w-full py-3 bg-red-500/10 text-red-500 rounded-lg text-center hover:bg-red-500/20 focus:tv-focus"
                      tabIndex={0}
                    >
                      Delete My Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {selectedTab !== 'profile' && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-2xl font-bold mb-4 capitalize">{
                settingsCategories.find(cat => cat.id === selectedTab)?.name
              } Settings</h2>
              <p className="text-muted-foreground mb-8">This settings section is not implemented in the demo.</p>
              <button 
                className="tv-btn bg-cloud text-white"
                onClick={() => setSelectedTab('profile')}
                tabIndex={0}
              >
                Return to Profile Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </TVLayout>
  );
}
