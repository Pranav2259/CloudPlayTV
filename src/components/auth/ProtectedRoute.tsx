import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gaming">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cloud mx-auto mb-4"></div>
          <p className="text-cloud">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to auth page but save the attempted location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
