'use client';

import { useColorAnalysis } from '@/lib/hooks/useColorAnalysis';
import { Trash2, Plus, X } from 'lucide-react';
import { Season } from '@/lib/types/color';
import { useState } from 'react';
import { ColorInfo } from '@/lib/types/color';

interface ColorPaletteProps {
  season: Season;
}

export default function ColorPalette({ season }: ColorPaletteProps) {
  const { analysis, removeColor, addCustomColor } = useColorAnalysis();
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [newColor, setNewColor] = useState<Partial<ColorInfo>>({
    name: '',
    hex: '#000000'
  });

  const currentSeasonColors = analysis?.profile.colors[season] || [];

  const handleRemoveColor = async (colorHex: string) => {
    try {
      await removeColor(colorHex);
    } catch (error) {
      console.error('Error removing color:', error);
    }
  };

  const handleAddColor = async () => {
    if (!newColor.name || !newColor.hex) return;

    try {
      await addCustomColor({
        name: newColor.name,
        hex: newColor.hex,
        description: 'Custom color',
        category: 'custom'
      });
      setNewColor({ name: '', hex: '#000000' });
      setIsAddingColor(false);
    } catch (error) {
      console.error('Error adding color:', error);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-800 dark:text-gray-200 text-center font-medium">
        {analysis?.profile.description}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {currentSeasonColors.map((color, index) => (
          <div key={index} className="space-y-2">
            <div
              className="aspect-video rounded-lg shadow-sm relative group"
              style={{ backgroundColor: color.hex }}
            >
              <button
                onClick={() => handleRemoveColor(color.hex)}
                className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {color.name}
              </h3>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {color.hex}
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                {color.description}
              </p>
            </div>
          </div>
        ))}

        <div>
          <button
            onClick={() => setIsAddingColor(true)}
            className="aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors flex items-center justify-center bg-white/50 dark:bg-gray-800/30 group w-full"
          >
            <Plus className="w-8 h-8 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
          </button>
          <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm mt-2">
            <h3 className="font-medium text-gray-900 dark:text-white text-center">
              Add New Color
            </h3>
          </div>
        </div>
      </div>

      {/* Add Color Modal */}
      {isAddingColor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Add Custom Color</h3>
              <button
                onClick={() => setIsAddingColor(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Color Name
                </label>
                <input
                  type="text"
                  value={newColor.name}
                  onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
                  placeholder="Enter color name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Color Value
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newColor.hex}
                    onChange={(e) => setNewColor(prev => ({ ...prev, hex: e.target.value }))}
                    className="h-10 w-20"
                  />
                  <input
                    type="text"
                    value={newColor.hex}
                    onChange={(e) => setNewColor(prev => ({ ...prev, hex: e.target.value }))}
                    className="flex-1 px-3 py-2 bg-gray-700 rounded-md text-white"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsAddingColor(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddColor}
                  className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  disabled={!newColor.name || !newColor.hex}
                >
                  Add Color
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 