import React, { useRef, useEffect, useState, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PixelData } from '../hooks/usePixelSync';

interface CanvasProps {
    pixels: Map<string, PixelData>;
    lastPixel: PixelData | null;
    onPlacePixel: (x: number, y: number) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ pixels, lastPixel, onPlacePixel }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hasDragged, setHasDragged] = useState(false);

    // Hover state
    const [hoverPixel, setHoverPixel] = useState<{ x: number, y: number } | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            const { clientWidth, clientHeight } = containerRef.current;
            let targetX = 250;
            let targetY = 250;
            let initialScale = 1;

            if (pixels.size > 0) {
                const densities = new Map<string, number>();
                let maxDensity = 0;
                let bestCell = '5,5';

                pixels.forEach((_, key) => {
                    const [x, y] = key.split(',').map(Number);
                    const cellKey = `${Math.floor(x / 50)},${Math.floor(y / 50)}`;
                    const newDensity = (densities.get(cellKey) || 0) + 1;
                    densities.set(cellKey, newDensity);
                    if (newDensity > maxDensity) {
                        maxDensity = newDensity;
                        bestCell = cellKey;
                    }
                });

                const [cx, cy] = bestCell.split(',').map(Number);
                targetX = cx * 50 + 25;
                targetY = cy * 50 + 25;
                initialScale = 4;
            }

            setScale(initialScale);
            setOffset({
                x: clientWidth / 2 - targetX * initialScale,
                y: clientHeight / 2 - targetY * initialScale
            });
        }
    }, [containerRef]);

    useEffect(() => {
        if (!canvasRef.current || pixels.size === 0) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 500, 500);
        pixels.forEach((pixelData) => {
            ctx.fillStyle = pixelData.color;
            ctx.fillRect(pixelData.x, pixelData.y, 1, 1);
        });
    }, [pixels.size === 0]);

    useEffect(() => {
        if (!canvasRef.current || !lastPixel) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = lastPixel.color;
        ctx.fillRect(lastPixel.x, lastPixel.y, 1, 1);
    }, [lastPixel]);

    const handleMouseDown = (e: MouseEvent) => {
        setIsDragging(true);
        setHasDragged(false);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!canvasRef.current) return;
        if (isDragging) {
            setHasDragged(true);
            setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
            setHoverPixel(null);
            return;
        }
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / scale);
        const y = Math.floor((e.clientY - rect.top) / scale);
        if (x >= 0 && x < 500 && y >= 0 && y < 500) {
            setHoverPixel({ x, y });
        } else {
            setHoverPixel(null);
        }
    };

    const handleMouseUp = (e: MouseEvent) => {
        setIsDragging(false);
        if (!hasDragged && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / scale);
            const y = Math.floor((e.clientY - rect.top) / scale);
            if (x >= 0 && x < 500 && y >= 0 && y < 500) {
                onPlacePixel(x, y);
            }
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (!containerRef.current) return;

        const zoomSpeed = 0.15;
        const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
        const newScale = Math.max(0.2, Math.min(25, scale * (1 + delta)));

        // Get mouse position relative to container
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate the world coordinates (on canvas) under the mouse before zoom
        const worldX = (mouseX - offset.x) / scale;
        const worldY = (mouseY - offset.y) / scale;

        // Calculate the new offset to keep the same world point under the mouse
        const newOffsetX = mouseX - worldX * newScale;
        const newOffsetY = mouseY - worldY * newScale;

        setScale(newScale);
        setOffset({ x: newOffsetX, y: newOffsetY });
    };

    return (
        <div
            ref={containerRef}
            className={`w-full h-full overflow-hidden bg-[#030712] ${isDragging ? 'cursor-grabbing' : (hoverPixel ? 'cursor-none' : 'cursor-grab')} relative`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { setIsDragging(false); setHoverPixel(null); }}
            onWheel={handleWheel}
            style={{ touchAction: 'none' }}
        >
            <motion.div
                className="absolute"
                animate={{ x: offset.x, y: offset.y, scale }}
                transition={{ type: "spring", stiffness: 400, damping: 40, mass: 1 }}
                style={{ transformOrigin: '0 0' }}
            >
                <div className="relative">
                    <canvas
                        ref={canvasRef}
                        width={500}
                        height={500}
                        className="shadow-[0_0_100px_rgba(0,209,255,0.05)] ring-1 ring-white/10"
                        style={{ imageRendering: 'pixelated' }}
                    />

                    {/* Hover Selection Box */}
                    {hoverPixel && !isDragging && (
                        <motion.div
                            initial={false}
                            animate={{ left: hoverPixel.x, top: hoverPixel.y }}
                            transition={{ type: "spring", stiffness: 1000, damping: 50 }}
                            className="absolute pointer-events-none z-10"
                            style={{
                                width: 1,
                                height: 1,
                                boxShadow: `0 0 0 ${1 / scale}px black, 0 0 0 ${2 / scale}px white`
                            }}
                        />
                    )}
                </div>
            </motion.div>

            {/* Hover Tooltip */}
            <AnimatePresence>
                {hoverPixel && !isDragging && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute pointer-events-none z-50 glass-panel px-4 py-3 rounded-2xl flex flex-col gap-1 shadow-2xl"
                        style={{
                            left: Math.min(offset.x + (hoverPixel.x * scale) + 20, (containerRef.current?.clientWidth || 0) - 200),
                            top: Math.min(offset.y + (hoverPixel.y * scale) + 20, (containerRef.current?.clientHeight || 0) - 80)
                        }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest leading-none">Coordonnées</span>
                        </div>
                        <span className="text-white font-black text-lg tracking-tight leading-none mb-2">
                            {hoverPixel.x}, {hoverPixel.y}
                        </span>

                        <div className="pt-2 border-t border-white/5">
                            {pixels.has(`${hoverPixel.x},${hoverPixel.y}`) ? (
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter mb-1">Créateur</span>
                                    <span className="text-blue-400 font-black truncate max-w-[140px] text-sm">
                                        {pixels.get(`${hoverPixel.x},${hoverPixel.y}`)?.user_name}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-gray-400 font-bold italic text-xs">Canevas vierge</span>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scale indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-32 left-1/2 -translate-x-1/2 glass-panel px-6 py-2 rounded-full text-[10px] font-black text-white/70 uppercase tracking-[0.3em] backdrop-blur-md border-white/5 pointer-events-none"
            >
                Zoom {Math.round(scale * 100)}% <span className="mx-2 opacity-20">|</span> Molette pour zoomer
            </motion.div>
        </div>
    );
};
