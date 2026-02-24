import React, { useState } from 'react';
import { Palette, X } from 'lucide-react';

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
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-800/90 hover:bg-gray-700 text-white p-4 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md border border-gray-600 transition-all flex items-center justify-center active:scale-95"
                title="Choose color"
            >
                {isOpen ? (
                    <X className="w-7 h-7" />
                ) : (
                    <div className="flex items-center gap-3">
                        <Palette className="w-7 h-7" />
                        <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-inner"
                            style={{ backgroundColor: selectedColor }}
                        />
                    </div>
                )}
            </button>

            {/* Retractable Picker Panel */}
            <div
                className={`absolute bottom-[calc(100%+1rem)] left-1/2 -translate-x-1/2 bg-gray-900/95 p-4 rounded-3xl shadow-2xl backdrop-blur-xl border border-gray-700 transition-all duration-300 flex gap-3 flex-wrap justify-center w-[280px] sm:w-[320px] origin-bottom ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'
                    }`}
            >
                {COLORS.map((c) => (
                    <button
                        key={c}
                        style={{ backgroundColor: c }}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl transition-all ${selectedColor === c
                                ? 'ring-4 ring-white scale-125 z-10 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                                : 'hover:scale-110 opacity-80 hover:opacity-100 hover:shadow-md border border-gray-800'
                            }`}
                        onClick={() => {
                            onSelect(c);
                            setIsOpen(false);
                        }}
                        title={c}
                    />
                ))}
            </div>
        </div>
    );
};
