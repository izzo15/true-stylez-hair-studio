import { useState, useRef, useEffect, DragEvent } from 'react';

type PhotoUploadProps = {
  onUpload: (file: File) => void;
  onCameraStart: (videoStream: MediaStream) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
};

const PhotoUpload = ({ onUpload, onCameraStart, videoRef }: PhotoUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      setIsFileSelected(true);
    } else {
      alert('Please select an image file');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const handleCameraClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCameraActive(true);
      videoRef.current!.srcObject = stream;
      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        const onLoadedMetadata = () => {
          videoRef.current!.removeEventListener('loadedmetadata', onLoadedMetadata);
          resolve();
        };
        videoRef.current!.addEventListener('loadedmetadata', onLoadedMetadata);
      });
      onCameraStart(stream);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please check permissions and try again.');
    }
  };

  const handleCaptureClick = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      onCameraStart(stream);
      // Stop the stream after capture (the parent will stop it in finally block)
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
      videoRef.current!.srcObject = null;
    }
  };

  const handleCancelCamera = () => {
    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {!isFileSelected && !isCameraActive ? (
        <div className={`border-2 border-dashed border-neon-blue/40 rounded-lg p-8 text-center transition-all duration-200 ${isDragging ? 'border-neon-blue/60 bg-neon-blue/5' : 'bg-obsidian-800/50'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
          <div className="space-y-4">
            <p className="text-neon-blue/80">Drag & drop an image here</p>
            <p className="text-muted-foreground">or</p>
            <button onClick={() => fileInputRef.current?.click()} className="btn btn-outline">
              Browse Images
            </button>
            <div className="space-y-3">
              <button onClick={handleCameraClick} className="btn btn-secondary">
                <span className="mr-2">📷</span> Use Camera
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileInputChange} />
            </div>
          </div>
        </div>
      ) : isFileSelected ? (
        <div className="space-y-4">
          <img
            src={URL.createObjectURL(selectedFile!)}
            alt="Preview"
            className="max-w-full rounded-lg border border-neon-blue/20"
          />
          <div className="space-y-3">
            <button onClick={handleUploadClick} className="btn btn-primary w-full">
              Analyze Face
            </button>
            <button onClick={() => {
              setIsFileSelected(false);
              setSelectedFile(null);
            }} className="btn btn-outline w-full">
              Choose Different Image
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg border border-neon-blue/20 bg-black"
          />
          <div className="space-y-3">
            <button onClick={handleCaptureClick} className="btn btn-primary w-full">
              Capture & Analyze
            </button>
            <button onClick={handleCancelCamera} className="btn btn-outline w-full">
              Cancel Camera
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;