import { useState } from "react";
import DayCountdown from "../../components/DayCountdown/DayCountdown";
import { GlassButton } from "../../components/GlassButton";
import { GlassButtonGroup } from "../../components/GlassButtonGroup";
import MemoryGame from "./components/MemoryGame";

const ChocolatePage = () => {
  const [gameKey, setGameKey] = useState(0);

  const handleReset = () => {
    setGameKey((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-rose-900 overflow-hidden flex items-center">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      {/* Left Side - Content */}
      <div className="w-1/2 flex items-center justify-center z-10">
        <div className="text-right pr-20">
          <div className="flex flex-col items-end gap-6">
            <div className="space-y-2">
              <h1
                className="text-6xl font-bold tracking-tight"
                style={{
                  background:
                    "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
                }}
              >
                Match
              </h1>
              <h1
                className="text-6xl font-bold tracking-tight"
                style={{
                  background:
                    "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
                }}
              >
                Chocolates
              </h1>
            </div>

            <div className="space-y-1 text-white/80">
              <p className="text-lg font-light">Click tiles to reveal</p>
              <p className="text-lg font-light">Find all 6 pairs</p>
            </div>

            <div className="mt-4">
              <GlassButtonGroup>
                <GlassButton icon="🔄" onClick={handleReset}>
                  Reset Game
                </GlassButton>
              </GlassButtonGroup>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Game */}
      <div className="w-1/2 flex items-center justify-center z-10">
        <MemoryGame key={gameKey} />
      </div>

      {/* Header */}
      <header className="absolute top-8 left-8 z-20">
        <h2
          className="text-xl font-light text-white/90"
          style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)" }}
        >
          🍫 Chocolate Memory
        </h2>
      </header>

      {/* Footer */}
      <footer className="absolute bottom-8 left-8 text-white/50 text-sm">
        <span>Day 3 - Chocolate Day</span>
      </footer>

      <DayCountdown currentDay={3} />
    </div>
  );
};

export default ChocolatePage;
