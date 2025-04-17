import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<
    "checking" | "connected" | "error"
  >("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test authentication capabilities
        const { data: authData, error: authError } =
          await supabase.auth.getSession();

        if (authError) {
          throw authError;
        }

        // Test database connection
        const { data: dbData, error: dbError } = await supabase
          .from("test_table")
          .select("*")
          .limit(1);

        if (dbError) {
          // It's okay if the table doesn't exist, we're just testing the connection
          if (dbError.code !== "42P01") {
            // Table doesn't exist error
            throw dbError;
          }
        }

        setConnectionStatus("connected");
      } catch (err) {
        setConnectionStatus("error");
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 rounded-lg bg-card">
      <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>
      <div className="space-y-2">
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              connectionStatus === "checking"
                ? "bg-yellow-500"
                : connectionStatus === "connected"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />
          <span>Connection Status: {connectionStatus}</span>
        </div>
        {error && <div className="text-red-500">Error: {error}</div>}
        {connectionStatus === "connected" && (
          <div className="text-green-500">
            Successfully connected to Supabase!
          </div>
        )}
      </div>
    </div>
  );
};
