import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<
    "checking" | "connected" | "error"
  >("checking");
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test authentication capabilities
        const { data: authData, error: authError } =
          await supabase.auth.getSession();

        if (authError) {
          throw authError;
        }

        // Test database connection and check required tables
        const { data: tablesData, error: tablesError } = await supabase
          .from("games")
          .select("*")
          .limit(1);

        if (tablesError) {
          throw tablesError;
        }

        // Check if all required tables exist
        const requiredTables = [
          "games",
          "user_games",
          "achievements",
          "user_achievements",
        ];
        const existingTables = await Promise.all(
          requiredTables.map(async (table) => {
            const { error } = await supabase.from(table).select("*").limit(1);
            return error ? null : table;
          })
        );

        const availableTables = existingTables.filter(Boolean) as string[];
        setTables(availableTables);

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
          <div className="space-y-2">
            <div className="text-green-500">
              Successfully connected to Supabase!
            </div>
            <div>
              <h3 className="font-semibold">Available Tables:</h3>
              <ul className="list-disc pl-5">
                {tables.map((table) => (
                  <li key={table}>{table}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
