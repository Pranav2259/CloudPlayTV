import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Checking...");
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test authentication
        const { data: authData, error: authError } =
          await supabase.auth.getSession();
        if (authError) throw authError;

        // Test database access
        const { data: gamesData, error: gamesError } = await supabase
          .from("games")
          .select("*")
          .limit(5);

        if (gamesError) throw gamesError;

        setGames(gamesData || []);
        setConnectionStatus("Connected successfully!");
      } catch (error) {
        console.error("Connection test failed:", error);
        setConnectionStatus("Connection failed. Check console for details.");
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <div className="mb-4">
        <p className="text-lg">Status: {connectionStatus}</p>
      </div>
      {games.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Sample Games:</h2>
          <ul className="list-disc pl-6">
            {games.map((game) => (
              <li key={game.id}>{game.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
