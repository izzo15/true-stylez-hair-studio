import { FaceAnalysisResult } from '@/lib/faceAnalysis';

type ResultsPanelProps = {
  result: FaceAnalysisResult;
  onRetry: () => void;
};

const ResultsPanel = ({ result, onRetry }: ResultsPanelProps) => {
  const faceShapeLabels: Record<string, string> = {
    OVAL: 'Oval',
    ROUND: 'Round',
    SQUARE: 'Square',
    HEART: 'Heart',
    DIAMOND: 'Diamond',
    OBLONG: 'Oblong',
    UNKNOWN: 'Unknown'
  };

  // Map face shape to service ID (this would need to match your service IDs from the API)
  const getServiceIdForFaceShape = (faceShape: string): string | null => {
    // This is a simplified mapping - in reality, you'd fetch services and match by name
    const serviceNameMap: Record<string, string> = {
      OVAL: 'Haircut',
      ROUND: 'High/Mid/Low Skin Fade',
      SQUARE: 'Haircut & Beard',
      HEART: 'Mid Fade',
      OBLONG: 'Haircut & Beard',
      DIAMOND: 'Skin Fade',
      UNKNOWN: 'Haircut'
    };
    
    // For now, we'll return a placeholder - in a real implementation, 
    // you'd look up the actual service ID from your services array
    return serviceNameMap[faceShape] || null;
  };

  const handleBookNow = () => {
    // Dispatch a custom event to prefill the booking widget
    const serviceNameMap: Record<string, string> = {
      OVAL: 'Haircut',
      ROUND: 'High/Mid/Low Skin Fade',
      SQUARE: 'Haircut & Beard',
      HEART: 'Mid Fade',
      OBLONG: 'Haircut & Beard',
      DIAMOND: 'Skin Fade',
      UNKNOWN: 'Haircut'
    };
    
    const serviceName = serviceNameMap[result.faceShape] || 'Haircut';
    
    // In a real app, you would look up the actual service ID from your services data
    // For now, we'll dispatch the service name and let the booking widget handle matching
    window.dispatchEvent(new CustomEvent('prefill-service', { 
      detail: serviceName 
    }));
    
    // Scroll to booking widget
    const bookingElement = document.getElementById('book');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-obsidian-800/50 rounded-xl border border-neon-blue/20 p-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          Your Face Shape: <span className="text-neon-blue">{faceShapeLabels[result.faceShape] || result.faceShape}</span>
        </h2>
        {result.confidence > 0 && (
          <p className="text-center text-muted-foreground mb-4">
            Confidence: {Math.round(result.confidence * 100)}%
          </p>
        )}
        <div className="space-y-4">
          <div className="bg-obsidian-700 rounded-lg p-4 border border-neon-purple/20">
            <h3 className="font-semibold text-neon-purple mb-2">Recommended Service</h3>
            <p className="text-xl">{result.serviceRecommendation}</p>
            {/* Button to book the recommended service */}
            <button 
              onClick={handleBookNow}
              className="btn btn-primary w-full mt-3"
            >
              Book This Style →
            </button>
          </div>
          
          <div className="bg-obsidian-700 rounded-lg p-4 border border-neon-blue/20">
            <h3 className="font-semibold text-neon-blue mb-2">Styling Tips</h3>
            <ul className="space-y-2 text-sm">
              {result.stylingTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 mt-0.5">•</span>
                  <span className="ms-3">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button onClick={onRetry} className="btn btn-outline">
          Try Another Photo
        </button>
      </div>
    </div>
  );
};

export default ResultsPanel;