import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { usePixelSync } from './hooks/usePixelSync';
import { Login } from './components/Login';
import { Canvas } from './components/Canvas';
import { Leaderboard } from './components/Leaderboard';
import { ColorPicker } from './components/ColorPicker';
import { CooldownTimer } from './components/CooldownTimer';
import { LogOut } from 'lucide-react';

function App() {
  const { user, loading: authLoading, logout } = useAuth();
  const { pixels, loading: pixelsLoading, placePixel, cooldownEnd, lastPixel } = usePixelSync(user);
  const [selectedColor, setSelectedColor] = useState('#E50000');

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handlePlacePixel = async (x: number, y: number) => {
    await placePixel(x, y, selectedColor);
  };

  return (
    <div className="relative w-screen h-screen bg-gray-950 overflow-hidden flex font-sans select-none">

      {/* Background Map / Canvas Wrapper */}
      <div className="absolute inset-0 z-0 p-0 sm:p-4 md:p-8">
        {(pixelsLoading) ? (
          <div className="w-full h-full rounded-3xl border border-gray-800 bg-gray-900/50 flex flex-col items-center justify-center text-gray-500 shadow-inner">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
            Loading canvas...
          </div>
        ) : (
          <Canvas pixels={pixels} lastPixel={lastPixel} onPlacePixel={handlePlacePixel} />
        )}
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">

        {/* Top Header */}
        <div className="flex justify-between items-start w-full">
          <div className="pointer-events-auto">
            <Leaderboard />
          </div>

          <div className="flex gap-4 items-start pointer-events-auto">
            <CooldownTimer cooldownEnd={cooldownEnd} />

            <button
              onClick={logout}
              className="bg-gray-800/80 hover:bg-red-500 border border-gray-700 hover:border-red-400 text-white p-3 rounded-2xl shadow-xl backdrop-blur-md transition-all active:scale-95 group flex items-center justify-center"
              title="Logout"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Bar: Color Picker */}
        <div className="flex justify-center w-full pointer-events-none pb-8 sm:pb-4">
          <ColorPicker selectedColor={selectedColor} onSelect={setSelectedColor} />
        </div>

      </div>

    </div>
  );
}

export default App;
