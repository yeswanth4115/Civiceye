import React, { useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImg: string;
  afterImg: string;
  category: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImg, afterImg, category }) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Before & After Simulation Slider</span>
        <span className="text-[9px] text-indigo-400 font-mono font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" /> Drag slider handle left or right
        </span>
      </div>

      <div
        ref={containerRef}
        className="relative h-[240px] w-full rounded-xl overflow-hidden border border-zinc-800 select-none cursor-ew-resize bg-[#0c0c0e]"
        onMouseDown={handleMouseDown}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* After Image (Background, visible on the right) */}
        <img
          src={afterImg}
          alt="After remediation"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2.5 right-2.5 bg-emerald-950/80 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider text-emerald-300 font-mono uppercase z-10">
          After: Clean & Resolved
        </div>

        {/* Before Image (Overlay with clip, visible on the left) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <img
            src={beforeImg}
            alt="Before remediation"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2.5 left-2.5 bg-red-950/80 border border-red-500/20 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider text-red-300 font-mono uppercase z-10">
            Before: {category}
          </div>
        </div>

        {/* Separator Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Handle knob */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-zinc-900 border-2 border-white rounded-full shadow-lg flex items-center justify-center text-[10px] font-bold text-white">
            ↔
          </div>
        </div>
      </div>
    </div>
  );
};
