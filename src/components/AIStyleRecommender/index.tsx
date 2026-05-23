import { useState, useRef, useEffect } from 'react';
import PhotoUpload from './PhotoUpload';
import ResultsPanel from './ResultsPanel';
import ProcessingOverlay from './ProcessingOverlay';
import { analyzeFace, loadFaceModels, FaceAnalysisResult } from '@/lib/faceAnalysis';

const AIStyleRecommender = () => {
  const [step, setStep] = useState<'upload' | 'processing' | 'results'>('upload');
  const [result, setResult] = useState<FaceAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load models when component mounts
  useEffect(() => {
    loadFaceModels().catch(console.error);
  }, []);

  const handleUpload = async (file: File) => {
    setStep('processing');
    setError(null);
    let imageUrl = '';
    try {
      imageUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const analysisResult = await analyzeFace(img);
      setResult(analysisResult);
      setStep('results');
    } catch (err) {
      setError('Failed to process image. Please try again.');
      setStep('upload');
      console.error(err);
    } finally {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    }
  };

  const handleCameraCapture = async (videoStream: MediaStream) => {
    setStep('processing');
    setError(null);
    
    try {
      // Draw video frame to canvas
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0);
          
          // Analyze the canvas
          const analysisResult = await analyzeFace(canvasRef.current);
          setResult(analysisResult);
          setStep('results');
        }
      }
    } catch (err) {
      setError('Failed to process camera capture. Please try again.');
      setStep('upload');
      console.error(err);
    } finally {
      // Stop video stream
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleRetry = () => {
    setStep('upload');
    setResult(null);
    setError(null);
  };

  if (step === 'upload') {
    return (
      <div className="space-y-6">
        <PhotoUpload 
          onUpload={handleUpload} 
          onCameraStart={handleCameraCapture}
          videoRef={videoRef}
        />
        {error && <p className="text-error">{error}</p>}
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <ProcessingOverlay />
        <p className="text-muted-foreground">Analyzing your face shape...</p>
      </div>
    );
  }

  if (step === 'results' && result) {
    return (
      <div className="space-y-6">
        <ResultsPanel result={result} onRetry={handleRetry} />
      </div>
    );
  }

  return null;
};

export { AIStyleRecommender };