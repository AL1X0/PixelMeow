import React, { useEffect, useState } from 'react';
import { Timer, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CooldownTimer: React.FC<{ cooldownEnd: number | null }> = ({ cooldownEnd }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (!cooldownEnd) {
            setTimeLeft(0);
            return;
        }

        const updateTimer = () => {
            const remaining = Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000));
            setTimeLeft(remaining);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 100);
        return () => clearInterval(interval);
    }, [cooldownEnd]);

    return (
        <AnimatePresence>
            {timeLeft > 0 && (
                <motion.div
                    initial={{ y: -20, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -10, opacity: 0, scale: 0.9 }}
                    className="relative"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />

                        <div className="relative bg-red-950/40 backdrop-blur-2xl border border-red-500/30 text-white px-6 py-4 rounded-[1.5rem] flex items-center gap-4 shadow-2xl">
                            <div className="relative">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="p-2 bg-red-500/20 rounded-xl"
                                >
                                    <Timer className="w-5 h-5 text-red-500" />
                                </motion.div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.2, 1] }}
                                    className="absolute -top-1 -right-1"
                                >
                                    <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                </motion.div>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-red-300 uppercase tracking-[0.2em]">Chargement</span>
                                <span className="text-xl font-black tabular-nums tracking-tight">
                                    {timeLeft}<span className="text-sm ml-0.5 opacity-50">s</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
