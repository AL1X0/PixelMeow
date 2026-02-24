import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { usePixelSync } from './hooks/usePixelSync';
import { Login } from './components/Login';
import { Canvas } from './components/Canvas';
import { Leaderboard } from './components/Leaderboard';
import { ColorPicker } from './components/ColorPicker';
import { CooldownTimer } from './components/CooldownTimer';
import { LogOut, Rocket, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { user, loading: authLoading, logout } = useAuth();
  const { pixels, loading: pixelsLoading, placePixel, cooldownEnd, lastPixel } = usePixelSync(user);
  const [selectedColor, setSelectedColor] = useState('#E50000');

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030712] text-white">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-6 shadow-[0_0_30px_rgba(0,209,255,0.2)]"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-blue-400 font-black uppercase tracking-[0.3em] text-xs"
        >
          Authentification...
        </motion.p>
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
    <div className="relative w-screen h-screen bg-[#030712] overflow-hidden flex select-none font-['Outfit']">

      {/* HUD Layer (Z-Index Hierarchy) */}
      <AnimatePresence>
        {pixelsLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#030712]/80 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center max-w-sm w-full p-8 text-center">
              <Rocket className="w-12 h-12 text-blue-500 mb-6 animate-bounce" />
              <h2 className="text-2xl font-black text-white mb-2">Chargement du Canevas</h2>
              <p className="text-gray-400 text-sm mb-8">Nous récupérons les {pixels.size || '...'} pixels déjà posés par la communauté.</p>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Main Game Interface */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Canvas pixels={pixels} lastPixel={lastPixel} onPlacePixel={handlePlacePixel} />
      </div>

      {/* Modern HUD Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-8">

        {/* Top HUD */}
        <div className="flex justify-between items-start w-full">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="pointer-events-auto"
          >
            <Leaderboard />
          </motion.div>

          <div className="flex flex-col gap-4 items-end pointer-events-auto">
            <CooldownTimer cooldownEnd={cooldownEnd} />

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4"
            >
              <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                <span className="text-xs font-black text-white uppercase tracking-widest">{user.displayName || 'Creator'}</span>
                <ShieldCheck className="w-4 h-4 text-blue-400 opacity-80" />
              </div>

              <button
                onClick={logout}
                className="glass-panel p-3.5 rounded-2xl text-gray-300 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all active:scale-90 group"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Bottom HUD: Color System */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, type: "spring" }}
          className="flex justify-center w-full pointer-events-none pb-4"
        >
          <ColorPicker selectedColor={selectedColor} onSelect={setSelectedColor} />
        </motion.div>

      </div>

      {/* Subtle Scanline Effect for extra retro-pro feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-[60]" />
    </div>
  );
}

export default App;
