'use client';

import { useState, useRef } from 'react';
import { ImageIcon, Upload, Camera, Check, X } from 'lucide-react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Webcam from 'react-webcam';

interface ImageUploadProps {
  onImageChange: (file: File | null) => void | Promise<void>;
  disabled?: boolean;
  existingImage?: string | null;
}

export default function ImageUpload({ onImageChange, existingImage }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 75,
    height: 100,
    x: 12.5,
    y: 0
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }
    return false;
  });

  const getInitialCrop = (imageWidth: number, imageHeight: number): Crop => {
    const targetWidth = imageWidth * 0.75;
    const targetHeight = targetWidth * (4/3);

    if (targetHeight > imageHeight) {
      const newHeight = imageHeight;
      const newWidth = newHeight * (3/4);
      
      return {
        unit: '%',
        width: (newWidth / imageWidth) * 100,
        height: 100,
        x: ((imageWidth - newWidth) / 2 / imageWidth) * 100,
        y: 0
      };
    }

    return {
      unit: '%',
      width: 75,
      height: (targetHeight / imageHeight) * 100,
      x: 12.5,
      y: (imageHeight - targetHeight) / 2 / imageHeight * 100
    };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setIsCropping(true);
        
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          setCrop(getInitialCrop(img.width, img.height));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      // Check if camera is available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        alert('No camera found');
        return;
      }

      setShowWebcam(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera');
    }
  };

  const toggleCamera = () => {
    setFacingMode(current => current === 'user' ? 'environment' : 'user');
  };

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setPreviewUrl(imageSrc);
        setShowWebcam(false);
        setIsCropping(true);
        
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
          setCrop(getInitialCrop(img.width, img.height));
        };
      }
    }
  };

  const handleCropComplete = () => {
    if (!previewUrl || !completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
          onImageChange(file);
          setIsCropping(false);
          setPreviewUrl(URL.createObjectURL(blob));
        }
      }, 'image/jpeg', 1);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setIsCropping(false);
    setShowWebcam(false);
    onImageChange(null);
  };

  // כשמציגים את חלון החיתוך
  if (isCropping && previewUrl) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-lg">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Crop Image
            </h3>
          </div>
          
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={3/4}
            minWidth={100}
            minHeight={133}
            className="max-h-[400px] overflow-hidden"
          >
            <img
              ref={imgRef}
              src={previewUrl || ''}
              alt="Preview"
              className="max-w-full h-auto"
              style={{ maxHeight: '400px' }}
              onLoad={(e) => {
                const { width, height } = e.currentTarget;
                setCrop(getInitialCrop(width, height));
              }}
            />
          </ReactCrop>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleCropComplete}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Apply
            </button>
          </div>
        </div>
      </div>
    );
  }

  // כשמציגים את המצלמה
  if (showWebcam) {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: facingMode,
    };

    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-lg">
          <div className="relative">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              mirrored={facingMode === 'user'}
              className="w-full rounded-lg"
              onUserMediaError={(error) => {
                console.error('Webcam error:', error);
                alert('Could not access camera. Please check permissions.');
                setShowWebcam(false);
              }}
            />
            
            {/* Camera Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              {isMobile && (
                <button
                  onClick={toggleCamera}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  title="Switch Camera"
                >
                  <Camera className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {facingMode === 'user' ? 'Selfie Camera' : 'Back Camera'}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowWebcam(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={capture}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </button>
            </div>
          </div>

          <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            {isMobile ? 'Tap the camera icon to switch cameras' : 'Position yourself in the frame'}
          </div>
        </div>
      </div>
    );
  }

  // תצוגת ברירת המחדל - אזור העלאה או תמונה שנבחרה
  return (
    <div className="w-full max-w-sm mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative aspect-[3/4] w-full">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            onClick={handleCancel}
            className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-800/30 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          
          <p className="mb-4 text-lg text-center text-gray-700 dark:text-gray-300">
            Upload a photo or use your camera
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              <Upload className="w-5 h-5" />
              Upload
            </button>

            {('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) && (
              <button
                onClick={startCamera}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                <Camera className="w-5 h-5" />
                Camera
              </button>
            )}
          </div>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Supported formats: JPG, PNG, GIF
          </p>
        </div>
      )}
    </div>
  );
}
