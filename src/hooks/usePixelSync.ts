import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type PixelData = {
    x: number;
    y: number;
    color: string;
    user_name: string;
};

export function usePixelSync(user: { uid: string, displayName: string | null } | undefined | null) {
    const userId = user?.uid;
    const userName = user?.displayName || 'Anonymous';

    // Store full PixelData instead of just colored strings to support hover info
    const [pixels, setPixels] = useState<Map<string, PixelData>>(new Map());
    const [lastPixel, setLastPixel] = useState<PixelData | null>(null);
    const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch initial grid state
    useEffect(() => {
        const fetchPixels = async () => {
            const { data, error } = await supabase
                .from('pixels')
                .select('x, y, color, user_name');

            if (!error && data) {
                const initialMap = new Map<string, PixelData>();
                data.forEach(p => {
                    initialMap.set(`${p.x},${p.y}`, { x: p.x, y: p.y, color: p.color, user_name: p.user_name });
                });
                setPixels(initialMap);
            }
            setLoading(false);
        };

        fetchPixels();
    }, []);

    // Subscribe to real-time changes
    useEffect(() => {
        const channel = supabase.channel('public:pixels')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pixels' }, (payload) => {
                const newPixel = payload.new as PixelData;
                setLastPixel(newPixel);
                setPixels(prev => {
                    const updated = new Map(prev);
                    updated.set(`${newPixel.x},${newPixel.y}`, newPixel);
                    return updated;
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Fetch initial cooldown
    useEffect(() => {
        if (!userId) return;

        const fetchCooldown = async () => {
            const { data, error } = await supabase
                .from('user_cooldowns')
                .select('last_placed_at')
                .eq('user_id', userId)
                .maybeSingle();

            if (!error && data) {
                const lastPlaced = new Date(data.last_placed_at).getTime();
                const tenSecondsLater = lastPlaced + 10000;
                if (tenSecondsLater > Date.now()) {
                    setCooldownEnd(tenSecondsLater);
                }
            }
        };

        fetchCooldown();
    }, [userId]);

    const placePixel = useCallback(async (x: number, y: number, color: string) => {
        if (!userId) return false;
        if (cooldownEnd && Date.now() < cooldownEnd) return false;

        const newPixelData = { x, y, color, user_name: userName };
        setLastPixel(newPixelData);
        setPixels(prev => {
            const updated = new Map(prev);
            updated.set(`${x},${y}`, newPixelData);
            return updated;
        });

        const newCooldownEnd = Date.now() + 10000;
        setCooldownEnd(newCooldownEnd);

        const { error } = await supabase
            .from('pixels')
            .insert([{ x, y, color, user_id: userId, user_name: userName }]);

        if (error) {
            console.error('Failed to place pixel:', error);
            // Wait for cooldown to end before allowing again to be safe
            return false;
        }

        return true;
    }, [userId, cooldownEnd]);

    return { pixels, loading, placePixel, cooldownEnd, lastPixel };
}
