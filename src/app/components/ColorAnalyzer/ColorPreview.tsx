import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { ColorInfo } from '@/lib/types/color';

interface ColorPreviewProps {
  colors: ColorInfo[];
}

export default function ColorPreview({ colors }: ColorPreviewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
    }
  };

  const handleNextColor = () => {
    setCurrentColorIndex((prev) => (prev + 1) % colors.length);
  };

  const handlePrevColor = () => {
    setCurrentColorIndex((prev) => (prev - 1 + colors.length) % colors.length);
  };

  return (
    <div className="relative mb-16">
      <ImageUpload 
        onImageChange={handleImageChange}
        existingImage={selectedImage}
      />
      
      {colors.length > 0 && selectedImage && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl">
          <div className="relative">
            {/* Color Background - Simulating Clothing */}
            <div 
              className="h-48 rounded-lg shadow-xl transform -skew-y-3"
              style={{ backgroundColor: colors[currentColorIndex].hex }}
            />
            
            {/* Navigation and Color Info */}
            <div className="absolute inset-0 flex items-center justify-between px-4">
              {/* Left Arrow */}
              <button
                onClick={handlePrevColor}
                className="p-3 bg-white/90 hover:bg-white text-gray-800 
                dark:bg-black/30 dark:hover:bg-black/40 dark:text-white 
                rounded-full transition-all duration-300 ease-out
                hover:scale-110 hover:shadow-lg
                active:scale-95 active:shadow-sm
                backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              {/* Center Color Info */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm 
                px-6 py-3 rounded-lg shadow-sm
                transform transition-all duration-300
                hover:scale-105 hover:shadow-md
                glow-effect">
                <p className="font-medium text-gray-900 dark:text-white text-center">
                  {colors[currentColorIndex].name}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                  {colors[currentColorIndex].hex}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  {colors[currentColorIndex].description}
                </p>
              </div>
              
              {/* Right Arrow */}
              <button
                onClick={handleNextColor}
                className="p-3 bg-white/90 hover:bg-white text-gray-800 
                dark:bg-black/30 dark:hover:bg-black/40 dark:text-white 
                rounded-full transition-all duration-300 ease-out
                hover:scale-110 hover:shadow-lg
                active:scale-95 active:shadow-sm
                backdrop-blur-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 