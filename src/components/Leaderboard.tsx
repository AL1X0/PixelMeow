import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy } from 'lucide-react';

type LeaderboardEntry = {
    user_name: string;
    pixel_count: number;
};

export const Leaderboard: React.FC = () => {
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const { data, error } = await supabase
                .from('leaderboard')
                .select('*');
            if (!error && data) {
                setLeaders(data);
            }
        };

        fetchLeaderboard();

        // Subscribe to NEW pixels to refresh leaderboard instantly
        const channel = supabase.channel('leaderboard-updates')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pixels' }, () => {
                fetchLeaderboard();
            })
            .subscribe();

        // Polling leaderboard every 30 seconds as fallback
        const interval = setInterval(fetchLeaderboard, 30000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-5 w-72 shadow-2xl border border-gray-700/50">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-700/50">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                    Leaderboard
                </h2>
            </div>
            <div className="space-y-3">
                {leaders.map((l, idx) => (
                    <div key={idx} className="flex justify-between items-center group">
                        <span className="text-gray-300 font-medium truncate max-w-[170px] text-sm group-hover:text-white transition-colors">
                            <span className="text-gray-500 mr-2">{idx + 1}.</span>
                            {l.user_name}
                        </span>
                        <span className="bg-gray-800 text-blue-400 text-xs py-1 px-2.5 rounded-lg border border-gray-700 font-bold shadow-inner">
                            {l.pixel_count}
                        </span>
                    </div>
                ))}
                {leaders.length === 0 && (
                    <div className="py-4 text-center">
                        <p className="text-gray-500 text-sm font-medium">No pixels placed yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};
