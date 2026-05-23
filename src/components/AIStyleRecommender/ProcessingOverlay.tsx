import { useEffect, useState } from 'react';

const ProcessingOverlay = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prevOffset) => (prevOffset + 2) % 200);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-96">
      <div className="absolute inset-0 bg-obsidian-800/50 rounded-lg overflow-hidden">
        {/* Holographic scan line */}
        <div
          className={`absolute left-0 right-0 h-1 bg-neon-blue/40 -translate-y-1/2 
                     animate-[scan_2s_linear_infinite] 
                     bg-gradient-to-r from-neon-blue/40 via-neon-purple/40 to-neon-blue/40 
                     bg-[length:200%_100%] 
                     bg-[position:${offset}%_0%] 
                     `}
        ></div>
        {/* Optional: add some scan line dots or particles */}
        <div className="absolute inset-0 pointer-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-neon-blue/50 rounded-full animate-pulse"></div>
          <div className="absolute left-1/4 top-3/4 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-neon-purple/50 rounded-full animate-pulse delay-100"></div>
          <div className="absolute left-3/4 top-1/4 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-neon-blue/50 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-none">
        <div className="text-neon-blue/80 text-sm font-mono">SCANNING</div>
        <div className="text-neon-blue/60 text-xs mt-1">FACIAL LANDMARKS</div>
      </div>
    </div>
  );
};

export default ProcessingOverlay;