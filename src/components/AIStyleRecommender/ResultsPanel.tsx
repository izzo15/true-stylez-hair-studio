import { FaceAnalysisResult } from '@/lib/faceAnalysis';
import { cn } from '@/lib/utils';
import { BTN_PRIMARY, BTN_OUTLINE } from './buttonStyles';

type ResultsPanelProps = {
  result: FaceAnalysisResult;
  onRetry: () => void;
};

// Face shape -> real service name (must match prisma/seed.ts service names exactly,
// since the booking widget matches on name when no id is available).
const FACE_SHAPE_SERVICE_NAME: Record<string, string> = {
  OVAL: 'Haircut',
  ROUND: 'High/Mid/Low Skin Fade',
  SQUARE: 'Haircut & Beard',
  HEART: 'High/Mid/Low Skin Fade',
  OBLONG: 'Haircut & Beard',
  DIAMOND: 'High/Mid/Low Skin Fade',
  UNKNOWN: 'Haircut'
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

  const handleBookNow = () => {
    const serviceName = FACE_SHAPE_SERVICE_NAME[result.faceShape] || 'Haircut';

    // Dispatch the service name and let the booking widget look up the real id
    // (we don't have service ids available in this client-side-only component).
    window.dispatchEvent(new CustomEvent('prefill-service', {
      detail: { name: serviceName }
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
              className={cn(BTN_PRIMARY, 'w-full mt-3')}
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
        <button onClick={onRetry} className={BTN_OUTLINE}>
          Try Another Photo
        </button>
      </div>
    </div>
  );
};

export default ResultsPanel;