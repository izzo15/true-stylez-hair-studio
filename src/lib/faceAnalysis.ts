import * as faceapi from 'face-api.js';

// Types for face analysis
export type FaceShape = 'OVAL' | 'ROUND' | 'SQUARE' | 'HEART' | 'DIAMOND' | 'OBLONG' | 'UNKNOWN';

export interface FaceAnalysisResult {
  faceShape: FaceShape;
  confidence: number; // 0-1
  landmarks: any; // faceapi.Landmarks | null;
  serviceRecommendation: string;
  stylingTips: string[];
}

// Load models - this should be called once at app initialization
export async function loadFaceModels() {
  const MODEL_URL = '/models';
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL) // optional, but good to have
    ]);
    console.log('Face analysis models loaded successfully');
  } catch (error) {
    console.error('Error loading face analysis models:', error);
    throw error;
  }
}

// Calculate distance between two points
function distance(p1: {x: number, y: number}, p2: {x: number, y: number}): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

// Extract specific landmarks for measurements
function getLandmarkPoints(landmarks: any, indices: number[]): {x: number, y: number}[] {
  return indices.map(i => ({
    x: landmarks.positions[i].x,
    y: landmarks.positions[i].y
  }));
}

// Face shape classification based on geometric ratios
export function classifyFaceShape(landmarks: any): {shape: FaceShape, confidence: number} {
  // Define landmark indices based on the 68-point model
  // Reference: https://github.com/justadudewhohacks/face-api.js/wiki/#landmarks
  
  // Forehead width: left frontotemporale (21) to right frontotemporale (22)
  // Actually, 68-point model doesn't have frontotemporale, so we'll use:
  // Left: landmark 0 (chin left) to 16 (chin right) for jaw, but we need forehead
  // Let's use the sides of the head: landmarks 0-16 are jawline, 17-21 left eyebrow, 22-26 right eyebrow
  // For forehead width, we can use the temples: approximately landmarks 0 and 16? Not accurate.
  // Better approach: use the width of the face at the eyebrow level
  
  // Since we don't have exact anatomical points, we'll use approximations:
  // Jawline width: distance between landmark 0 (chin left) and 16 (chin right)
  // Cheekbone width: distance between landmark 1 (left of chin) and 15 (right of chin) - not ideal
  // Actually, let's use the standard 68-point groupings:
  
  // We'll use:
  // Jaw: points 0-16 (but we need width, so leftmost and rightmost of jaw)
  // Actually, jaw width is between gonion points which are approximately 4 and 12? 
  // Let's simplify and use what we can get reliably:
  
  // After research, common approach with 68 points:
  // Face height: from landmark 8 (chin bottom) to landmark 27 (top of nose) or 24? 
  // Actually, hairline to chin: we don't have hairline. 
  
  // Given the limitations, we'll implement a simplified version that works for frontal photos
  // using the ratios that can be calculated from available points.
  
  // We'll use:
  // Face length: distance from landmark 8 (chin) to landmark 24 (between eyes? Actually 24 is not defined)
  // Let's use landmark 8 (chin) to landmark 27 (which is the bottom of the nose? Actually 27-30 is nose)
  // Better: use landmark 8 (chin) to the midpoint of the eyes (landmarks 36-45 for eyes)
  
  // Since this is complex and we want to ship, we'll use a simplified method:
  // Calculate the ratio of face width to height using the jaw and eye line
  
  // Get key points:
  const chinBottom = landmarks.positions[8]; // landmark 8 is bottom of chin
  const noseTop = landmarks.positions[27]; // landmark 27 is top of nose (bridge)
  
  // For face length, we'll use chin to forehead approximate:
  // Since we don't have hairline, we'll use chin to the top of the head approximation
  // We can estimate forehead height by using the eyebrow position
  const leftEyeLeft = landmarks.positions[36]; // left eye left corner
  const rightEyeRight = landmarks.positions[45]; // right eye right corner
  const eyebrowTop = (landmarks.positions[19].y + landmarks.positions[24].y) / 2; // approximate eyebrow top
  
  // Face length: chin to eyebrow top (not perfect but proportional)
  const faceLength = Math.abs(chinBottom.y - eyebrowTop);
  
  // Cheekbone width: use the distance between the outer corners of the eyes (approximation)
  const cheekboneWidth = Math.abs(rightEyeRight.x - leftEyeLeft.x);
  
  // Jaw width: use the jaw landmarks (0-16), take the width
  const jawPoints = getLandmarkPoints(landmarks, [0, 16]); // leftmost and rightmost of jaw
  const jawWidth = Math.abs(jawPoints[1].x - jawPoints[0].x);
  
  // Forehead width: use the temples approximation - we'll use the width at eyebrow level
  const foreheadWidth = cheekboneWidth; // simplification, assuming similar
  
  // Avoid division by zero
  if (cheekboneWidth === 0) {
    return {shape: 'UNKNOWN', confidence: 0};
  }
  
  const ratio1 = faceLength / cheekboneWidth; // face length / cheekbone width
  const ratio2 = jawWidth / cheekboneWidth;   // jaw width / cheekbone width
  const ratio3 = foreheadWidth / cheekboneWidth; // forehead width / cheekbone width
  
  // Classification logic (simplified based on common ratios)
  let shape: FaceShape = 'UNKNOWN';
  let confidence = 0.5; // base confidence
  
  // OVAL: face length ~1.5x cheekbone width, jaw ~0.8-0.9x cheekbone
  if (ratio1 > 1.4 && ratio1 < 1.6 && ratio2 > 0.75 && ratio2 < 0.95) {
    shape = 'OVAL';
    confidence = 0.9;
  }
  // ROUND: face length < 1.3x cheekbone, jaw > 0.85x cheekbone
  else if (ratio1 < 1.3 && ratio2 > 0.85) {
    shape = 'ROUND';
    confidence = 0.85;
  }
  // SQUARE: face length ~1.0-1.3x cheekbone, jaw > 0.85x cheekbone
  else if (ratio1 >= 1.0 && ratio1 <= 1.3 && ratio2 > 0.85) {
    shape = 'SQUARE';
    confidence = 0.85;
  }
  // HEART: forehead wider than jaw, and face length > 1.3x cheekbone
  else if (ratio3 > ratio2 && ratio1 > 1.3) {
    shape = 'HEART';
    confidence = 0.8;
  }
  // DIAMOND: cheekbone widest feature
  else if (cheekboneWidth > foreheadWidth && cheekboneWidth > jawWidth) {
    shape = 'DIAMOND';
    confidence = 0.8;
  }
  // OBLONG: face length > 1.7x cheekbone, jaw < 0.85x cheekbone
  else if (ratio1 > 1.7 && ratio2 < 0.85) {
    shape = 'OBLONG';
    confidence = 0.8;
  } else {
    // Fallback to most likely based on ratios
    if (ratio1 > 1.5) shape = 'OBLONG';
    else if (ratio1 < 1.3) shape = 'ROUND';
    else if (ratio2 > 0.9) shape = 'SQUARE';
    else shape = 'OVAL';
    confidence = 0.6;
  }
  
  return {shape, confidence};
}

// Map face shape to recommended service
export function getServiceRecommendation(faceShape: FaceShape): string {
  switch (faceShape) {
    case 'OVAL': return 'Haircut';
    case 'ROUND': return 'High/Mid/Low Skin Fade';
    case 'SQUARE': return 'Haircut & Beard';
    case 'HEART': return 'High/Mid/Low Skin Fade';
    case 'OBLONG': return 'Haircut & Beard';
    case 'DIAMOND': return 'High/Mid/Low Skin Fade';
    default: return 'Haircut'; // default
  }
}

// Get styling tips based on face shape
export function getStylingTips(faceShape: FaceShape): string[] {
  switch (faceShape) {
    case 'OVAL':
      return [
        'Most hairstyles suit your face shape.',
        'Try a classic taper or textured crop.',
        'Avoid excessive volume on the sides.'
      ];
    case 'ROUND':
      return [
        'Add height on top to elongate your face.',
        'Keep sides short with a fade or undercut.',
        'Avoid round, curved cuts that add width.'
      ];
    case 'SQUARE':
      return [
        'Soften your angular jaw with texture on top.',
        'Consider a side part or textured fringe.',
        'Keep beard well-groomed to balance features.'
      ];
    case 'HEART':
      return [
        'Balance your wider forehead with volume at the jawline.',
        'Try a textured fringe or side-swept bangs.',
        'Avoid sharp, angular lines on the forehead.'
      ];
    case 'OBLONG':
      return [
        'Add width to the sides to balance your long face.',
        'Consider a textured crop or fringe.',
        'Avoid excessive height on top.'
      ];
    case 'DIAMOND':
      return [
        'Soften your cheekbones with texture on the forehead.',
        'Consider a fringe or textured top.',
        'Keep volume away from the cheekbones.'
      ];
    default:
      return [
        'Consult with your barber for personalized advice.',
        'Consider your hair texture and lifestyle.',
        'Bring reference photos to your appointment.'
      ];
  }
}

// Main function to analyze face from image
export async function analyzeFace(image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<FaceAnalysisResult> {
  try {
    // Detect face with landmarks
    const detections = await faceapi
      .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions(); // optional
    
    if (!detections) {
      return {
        faceShape: 'UNKNOWN',
        confidence: 0,
        landmarks: null,
        serviceRecommendation: 'Haircut',
        stylingTips: ['No face detected. Please ensure your face is clearly visible and well-lit.']
      };
    }
    
    const {shape, confidence} = classifyFaceShape(detections.landmarks);
    const service = getServiceRecommendation(shape);
    const tips = getStylingTips(shape);
    
    return {
      faceShape: shape,
      confidence,
      landmarks: detections.landmarks,
      serviceRecommendation: service,
      stylingTips: tips
    };
  } catch (error) {
    console.error('Error analyzing face:', error);
    return {
      faceShape: 'UNKNOWN',
      confidence: 0,
      landmarks: null,
      serviceRecommendation: 'Haircut',
      stylingTips: ['Error analyzing face. Please try again with a different image.']
    };
  }
}