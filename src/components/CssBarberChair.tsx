"use client";
import { useRef, useState, useCallback } from "react";

export default function CssBarberChair() {
  const chairRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dragSpeed, setDragSpeed] = useState(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!chairRef.current) return;
      const rect = chairRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const centerX = rect.width / 2;
      // -1 to 1 based on how far left/right from center
      const factor = ((x - centerX) / centerX) * 0.5;
      setDragSpeed(factor);
    },
    []
  );

  const handleMouseLeave = () => {
    setIsHovered(false);
    setDragSpeed(0);
  };

  // Rotation speed: base slow rotation + drag influence
  const rotationSpeed = isHovered
    ? 2 + dragSpeed * 10
    : 0.5;

  return (
    <div
      className="relative w-full h-80 flex justify-center items-center select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={chairRef}
        className="w-60 h-80 relative"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${isHovered ? 'auto' : '0'})`,
          animation: isHovered
            ? `spin ${3 / rotationSpeed}s linear infinite`
            : `spin ${10}s linear infinite`,
        }}
      >
        {/* Base */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full" />
        {/* Central pole */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3 h-40 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full" />
        {/* Seat */}
        <div className="absolute bottom-44 left-1/2 -translate-x-1/2 w-28 h-8 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-full" />
        {/* Backrest */}
        <div className="absolute bottom-52 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-full rounded-b-lg" />
        {/* Headrest */}
        <div className="absolute bottom-76 left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-amber-500 to-amber-700 rounded-t-full" />
        {/* Armrests */}
        <div className="absolute bottom-48 left-8 w-4 h-14 bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg" />
        <div className="absolute bottom-48 right-8 w-4 h-14 bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg" />
        {/* Footrest */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-16 h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full" />
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}