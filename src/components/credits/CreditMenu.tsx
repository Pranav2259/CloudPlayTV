
import React from 'react';
import { Clock, CreditCard, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CreditMenuProps {
  credits: number;
  timeRemaining: string;
  onClose: () => void;
}

export const CreditMenu: React.FC<CreditMenuProps> = ({ credits, timeRemaining, onClose }) => {
  // Credit package options
  const packages = [
    { id: 'basic', credits: 100, price: '$4.99' },
    { id: 'standard', credits: 250, price: '$9.99', popular: true },
    { id: 'premium', credits: 500, price: '$17.99' },
  ];

  return (
    <div 
      className="absolute right-0 top-full mt-2 w-80 rounded-lg bg-card shadow-lg z-50 animate-fade-in"
      tabIndex={-1}
      onBlur={(e) => {
        // Close if focus moves outside
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onClose();
        }
      }}
    >
      <div className="p-4 border-b border-muted">
        <h3 className="text-lg font-medium">Your Credits</h3>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
            <span className="font-medium">Available:</span>
          </div>
          <span className="text-xl font-bold">{credits}</span>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <span className="font-medium">Play time:</span>
          </div>
          <span className="text-lg">{timeRemaining}</span>
        </div>
        
        <h4 className="text-md font-medium mb-3">Purchase Credits</h4>
        
        <div className="space-y-2">
          {packages.map((pkg) => (
            <button 
              key={pkg.id}
              className={`w-full py-3 px-4 rounded-lg flex justify-between items-center transition-all ${
                pkg.popular ? 'bg-gray-600 text-white' : 'bg-muted hover:bg-muted/80'
              } focus:outline-none focus:ring-2 focus:ring-gray-500`}
              tabIndex={0}
            >
              <div className="flex items-center">
                <PlusCircle className="h-5 w-5 mr-2" />
                <span>{pkg.credits} credits</span>
              </div>
              <span className="font-bold">{pkg.price}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-muted">
          <Link 
            to="/credits"
            className="block w-full py-2 text-center text-gray-400 hover:underline focus:outline-none focus:text-gray-300"
            onClick={onClose}
            tabIndex={0}
          >
            View All Options
          </Link>
        </div>
      </div>
    </div>
  );
};
