import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Users, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type LeaderboardEntry = {
    user_name: string;
    pixel_count: number;
};

export const Leaderboard: React.FC = () => {
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

    const fetchLeaderboard = async () => {
        const { data, error } = await supabase
            .from('leaderboard')
            .select('*');
        if (!error && data) {
            setLeaders(data);
        }
    };

    useEffect(() => {
        fetchLeaderboard();

        const channel = supabase.channel('leaderboard-updates')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pixels' }, () => {
                fetchLeaderboard();
            })
            .subscribe();

        const interval = setInterval(fetchLeaderboard, 30000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(interval);
        };
    }, []);

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="glass-panel p-6 w-80 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.3)]"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-yellow-500/20 rounded-xl shadow-inner">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tight">Classement</h2>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">Live</span>
                </div>
            </div>

            <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                    {leaders.map((l, idx) => (
                        <motion.div
                            key={l.user_name}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`flex justify-between items-center p-3 rounded-2xl group transition-all duration-300 ${idx === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20' :
                                    idx === 1 ? 'bg-gradient-to-r from-gray-400/10 to-transparent border border-gray-400/20' :
                                        idx === 2 ? 'bg-gradient-to-r from-orange-400/10 to-transparent border border-orange-400/20' :
                                            'hover:bg-white/5'
                                }`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${idx === 0 ? 'bg-yellow-500 text-black' :
                                        idx === 1 ? 'bg-gray-400 text-black' :
                                            idx === 2 ? 'bg-orange-400 text-black' :
                                                'text-gray-400 bg-white/5'
                                    }`}>
                                    {idx + 1}
                                </span>
                                <span className="text-gray-100 font-bold truncate text-sm tracking-tight group-hover:text-blue-400 transition-colors">
                                    {l.user_name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-black text-sm">
                                    {l.pixel_count}
                                </span>
                                {idx < 3 && <Zap className={`w-3 h-3 ${idx === 0 ? 'text-yellow-500' : 'text-blue-400 opacity-50'}`} />}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {leaders.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-10 text-center"
                    >
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Users className="w-6 h-6 text-gray-500" />
                        </div>
                        <p className="text-gray-300 text-sm font-bold lowercase tracking-tight">En attente de créateurs...</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};
