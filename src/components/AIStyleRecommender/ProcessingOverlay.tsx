const ProcessingOverlay = () => {
  return (
    <div className="relative w-full h-96">
      <div className="processing-overlay absolute inset-0 rounded-lg">
        <div className="scan-line" aria-hidden="true" />
        {/* Scan line dots/particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-neon-blue/50 rounded-full animate-pulse"></div>
          <div className="absolute left-1/4 top-3/4 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-neon-purple/50 rounded-full animate-pulse delay-100"></div>
          <div className="absolute left-3/4 top-1/4 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-neon-blue/50 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-neon-blue/80 text-sm font-mono">SCANNING</div>
        <div className="text-neon-blue/60 text-xs mt-1">FACIAL LANDMARKS</div>
      </div>
    </div>
  );
};

export default ProcessingOverlay;
