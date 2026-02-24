import React, { useRef, useEffect, useState, type MouseEvent } from 'react';

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
        // Center canvas on the most dense area on first load
        if (containerRef.current) {
            const { clientWidth, clientHeight } = containerRef.current;

            let targetX = 250;
            let targetY = 250;
            let initialScale = 1;

            if (pixels.size > 0) {
                // Divide the canvas into a 10x10 grid (50x50 chunks) to find the highest density
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
                targetX = cx * 50 + 25; // center of the dense cell
                targetY = cy * 50 + 25;
                initialScale = 4; // Zoom in level
            }

            setScale(initialScale);
            setOffset({
                x: clientWidth / 2 - targetX * initialScale,
                y: clientHeight / 2 - targetY * initialScale
            });
        }
    }, [containerRef]); // Run once on mount (refs should be ready)

    // INITIAL FULL DRAW
    useEffect(() => {
        if (!canvasRef.current || pixels.size === 0) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Reset and draw background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 500, 500);

        // Batch draw everyone
        pixels.forEach((pixelData) => {
            ctx.fillStyle = pixelData.color;
            ctx.fillRect(pixelData.x, pixelData.y, 1, 1);
        });
    }, [pixels.size === 0]); // Trigger only when data first arrives or reset

    // INCREMENTAL DRAW (The optimization)
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

        // Handle dragging
        if (isDragging) {
            setHasDragged(true);
            setOffset({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
            setHoverPixel(null);
            return;
        }

        // Handle hover calculation for the black border box 
        const rect = canvasRef.current.getBoundingClientRect();
        const rawX = e.clientX - rect.left;
        const rawY = e.clientY - rect.top;

        const x = Math.floor(rawX / scale);
        const y = Math.floor(rawY / scale);

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
            const rawX = e.clientX - rect.left;
            const rawY = e.clientY - rect.top;

            const x = Math.floor(rawX / scale);
            const y = Math.floor(rawY / scale);

            if (x >= 0 && x < 500 && y >= 0 && y < 500) {
                onPlacePixel(x, y);
            }
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        // Custom zoom on wheel to keep things in view
        const zoomIntensity = 0.2;
        const newScale = e.deltaY > 0
            ? Math.max(0.5, scale - zoomIntensity)
            : Math.min(25, scale + zoomIntensity);

        // We would need robust calculations to zoom towards mouse pos
        // But for simplicity, we zoom relative to the top left of the wrapper
        setScale(newScale);
    };

    return (
        <div
            ref={containerRef}
            className={`w-full h-full overflow-hidden bg-gray-950 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} rounded-3xl shadow-inner relative`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { setIsDragging(false); setHoverPixel(null); }}
            onWheel={handleWheel}
            style={{ touchAction: 'none' }}
        >
            <div
                className="absolute"
                style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                    transformOrigin: '0 0',
                    transition: isDragging ? 'none' : 'transform 0.05s linear'
                }}
            >
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={500}
                    className="shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-gray-800"
                    style={{ imageRendering: 'pixelated' }}
                />

                {/* Hover Selection Box outline */}
                {hoverPixel && !isDragging && (
                    <div
                        className="absolute pointer-events-none z-10"
                        style={{
                            left: hoverPixel.x,
                            top: hoverPixel.y,
                            width: 1,
                            height: 1,
                            boxShadow: `0 0 0 ${1 / scale}px black, 0 0 0 ${2 / scale}px white`
                        }}
                    />
                )}
            </div>

            {/* Hover Data Overlay */}
            {hoverPixel && !isDragging && (
                <div
                    className="absolute pointer-events-none bg-gray-900/90 text-white text-xs px-3 py-2 rounded-xl shadow-xl backdrop-blur-md border border-gray-700/50 flex flex-col gap-1 transition-opacity z-50"
                    style={{
                        left: Math.min(offset.x + (hoverPixel.x * scale) + 15, containerRef.current?.clientWidth! - 200),
                        top: Math.min(offset.y + (hoverPixel.y * scale) + 15, containerRef.current?.clientHeight! - 60)
                    }}
                >
                    <span className="font-bold text-gray-300">
                        Pixel ({hoverPixel.x}, {hoverPixel.y})
                    </span>
                    {pixels.has(`${hoverPixel.x},${hoverPixel.y}`) ? (
                        <span className="text-blue-400 font-medium break-all">
                            Posé par : {pixels.get(`${hoverPixel.x},${hoverPixel.y}`)?.user_name}
                        </span>
                    ) : (
                        <span className="text-gray-500 italic">Vide</span>
                    )}
                </div>
            )}

            {/* Zoom hint */}
            <div className="absolute bottom-4 right-4 bg-gray-900/80 px-4 py-2 rounded-xl text-xs text-gray-400 backdrop-blur-md pointer-events-none">
                Zoom: {Math.round(scale * 100)}% | Scroll to zoom, Drag to pan
            </div>
        </div>
    );
};
