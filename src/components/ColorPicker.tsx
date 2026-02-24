import React, { useState } from 'react';
import { Palette, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = [
    '#FFFFFF', '#E4E4E4', '#888888', '#222222', '#FFA7D1', '#E50000', '#E59500',
    '#A06A42', '#E5D900', '#94E044', '#02BE01', '#00D3DD', '#0083C7', '#0000EA',
    '#CF6EE4', '#820080'
];

export const ColorPicker: React.FC<{
    selectedColor: string;
    onSelect: (color: string) => void;
}> = ({ selectedColor, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative pointer-events-auto">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                        exit={{ opacity: 0, y: 10, scale: 0.9, x: "-50%" }}
                        className="absolute bottom-[calc(100%+1.5rem)] left-1/2 p-6 glass-panel rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex gap-3 flex-wrap justify-center w-[300px] sm:w-[350px] origin-bottom z-50"
                    >
                        {COLORS.map((c, i) => (
                            <motion.button
                                key={c}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.02 }}
                                style={{ backgroundColor: c }}
                                className={`w-12 h-12 rounded-2xl transition-all relative group shadow-sm flex items-center justify-center ${selectedColor === c ? 'scale-110' : 'hover:scale-110 hover:shadow-xl'
                                    } cursor-pointer`}
                                onClick={() => {
                                    onSelect(c);
                                    setIsOpen(false);
                                }}
                            >
                                {selectedColor === c && (
                                    <motion.div
                                        layoutId="check"
                                        className="bg-black/20 backdrop-blur-sm rounded-full p-1"
                                    >
                                        <Check className={`w-5 h-5 ${c === '#FFFFFF' ? 'text-black' : 'text-white'}`} strokeWidth={4} />
                                    </motion.div>
                                )}
                                <div className="absolute inset-0 rounded-2xl border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="glass-panel p-5 rounded-[2rem] shadow-2xl flex items-center gap-4 group transition-all"
            >
                <div className="relative">
                    <Palette className={`w-7 h-7 transition-colors ${isOpen ? 'text-blue-400' : 'text-gray-400'}`} />
                    {isOpen && (
                        <motion.div
                            layoutId="active-dot"
                            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-gray-900"
                        />
                    )}
                </div>
                <div className="flex flex-col items-start pr-2">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Couleur</span>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded-full border border-white/20 shadow-inner"
                            style={{ backgroundColor: selectedColor }}
                        />
                        <span className="text-sm font-black text-white">{selectedColor.toUpperCase()}</span>
                    </div>
                </div>
                <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-500'}`}>
                    {isOpen ? <X className="w-4 h-4" /> : <Palette className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
            </motion.button>
        </div>
    );
};
