'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Download } from 'lucide-react';
import { seasonalColors, seasonalDescriptions, type ColorData } from '@/lib/constants/colors';

interface ColorPaletteProps {
  season: string;
}

export default function ColorPalette({ season }: ColorPaletteProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const colors = seasonalColors[season];

  const toggleFavorite = (hex: string) => {
    setFavorites(prev => 
      prev.includes(hex) 
        ? prev.filter(h => h !== hex)
        : [...prev, hex]
    );
  };

  const downloadPalette = () => {
    // Implementation for downloading palette will be added
  };

  return (
    <div className="space-y-8">
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4">
          Your {season.charAt(0).toUpperCase() + season.slice(1)} Color Palette
        </h3>
        <p className="text-gray-600">{seasonalDescriptions[season]}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {colors.map((color) => (
          <motion.div
            key={color.hex}
            className="relative group"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="h-32 rounded-lg shadow-md cursor-pointer"
              style={{ backgroundColor: color.hex }}
              onClick={() => toggleFavorite(color.hex)}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Heart
                className={`w-8 h-8 ${
                  favorites.includes(color.hex)
                    ? 'text-red-500 fill-current'
                    : 'text-white'
                }`}
              />
            </div>
            <div className="mt-2">
              <p className="font-medium">{color.name}</p>
              <p className="text-sm text-gray-500">{color.hex}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={downloadPalette}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-colors"
      >
        <Download className="w-6 h-6" />
      </button>
    </div>
  );
} 