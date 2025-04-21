import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const UserInfo = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const { user: authUser } = useAuth();

  useEffect(() => {
    const getUserInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserInfo(user);
    };

    getUserInfo();
  }, []);

  const user = userInfo || authUser;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your User ID</h1>

      {user ? (
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">
              Copy this ID for the SQL script:
            </h2>
            <p className="font-mono text-lg break-all">{user.id}</p>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Steps to follow:</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Copy the ID above</li>
              <li>Go to Supabase SQL Editor</li>
              <li>Replace 'YOUR-ACTUAL-UUID' in the SQL script with this ID</li>
              <li>Run the SQL script</li>
            </ol>
          </div>
        </div>
      ) : (
        <p>Please log in to see your user ID</p>
      )}
    </div>
  );
};
