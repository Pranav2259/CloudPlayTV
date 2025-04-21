import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { GameProvider } from "./contexts/GameContext";
import { Toaster } from "./components/ui/Toaster";
import Routes from "./Routes";
import { SupabaseTest } from "./components/test/SupabaseTest";
import GameDetail from "./pages/GameDetail";

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/test" element={<SupabaseTest />} />
            <Route path="/game/:gameId" element={<GameDetail />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
