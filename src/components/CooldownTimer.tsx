import React, { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

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
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [cooldownEnd]);

    if (timeLeft === 0) return null;

    return (
        <div className="fixed top-6 right-6 bg-red-600 border border-red-500 text-white px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center gap-3 animate-pulse backdrop-blur-md z-50">
            <Timer className="w-5 h-5" />
            <span className="font-extrabold tracking-wide">Cooldown: {timeLeft}s</span>
        </div>
    );
};
