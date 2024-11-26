'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shirt, 
  Palette, 
  Sparkles, 
  Calendar, 
  Layers,
  Droplet,
  Brush 
} from 'lucide-react';
import { seasonalAdvice } from '@/lib/constants/seasons';
import { seasonalCharacteristics } from '@/lib/constants/characteristics';
import AdviceSection from './AdviceSection';
import ColorCombination from './ColorCombination';
import ColorHarmonies from './ColorHarmonies';
import SeasonalVariation from './SeasonalVariation';

interface SeasonalAdviceProps {
  season: string;
}

export default function SeasonalAdvice({ season }: SeasonalAdviceProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'clothing' | 'makeup' | 'accessories' | 'harmonies' | 'variations'
  >('overview');
  
  const advice = seasonalAdvice[season];
  const characteristics = seasonalCharacteristics[season];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'clothing', label: 'Clothing', icon: Shirt },
    { id: 'makeup', label: 'Makeup', icon: Brush },
    { id: 'accessories', label: 'Accessories', icon: Sparkles },
    { id: 'harmonies', label: 'Color Harmonies', icon: Droplet },
    { id: 'variations', label: 'Seasonal Variations', icon: Layers },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Your {season.charAt(0).toUpperCase() + season.slice(1)} Color Profile
        </h2>
        <p className="text-gray-600">{seasonalDescriptions[season]}</p>
      </div>

      <div className="flex space-x-4 border-b">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Characteristics</h3>
              <AdviceSection
                title="Skin Tone"
                items={[advice.characteristics.skinTone]}
                type="text"
              />
              <AdviceSection
                title="Eye Color"
                items={[advice.characteristics.eyeColor]}
                type="text"
              />
              <AdviceSection
                title="Hair Color"
                items={[advice.characteristics.hairColor]}
                type="text"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Best Colors</h3>
              <div className="grid grid-cols-2 gap-4">
                {seasonalColors[season].map((color) => (
                  <div
                    key={color.hex}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50"
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clothing' && (
          <div className="space-y-6">
            <AdviceSection
              title="Best Colors"
              items={advice.clothing.bestColors}
              type="colors"
            />
            <AdviceSection
              title="Colors to Avoid"
              items={advice.clothing.avoidColors}
              type="colors"
            />
            <AdviceSection
              title="Recommended Patterns"
              items={advice.clothing.patterns}
              type="text"
            />
            <AdviceSection
              title="Ideal Fabrics"
              items={advice.clothing.fabrics}
              type="text"
            />
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Suggested Combinations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advice.combinations.casual.map((combo, index) => (
                  <ColorCombination key={index} combination={combo} type="casual" />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'makeup' && (
          <div className="space-y-6">
            <AdviceSection
              title="Foundation"
              items={[advice.makeup.foundation]}
              type="text"
            />
            <AdviceSection
              title="Blush"
              items={advice.makeup.blush}
              type="colors"
            />
            <AdviceSection
              title="Lipstick"
              items={advice.makeup.lipstick}
              type="colors"
            />
            <AdviceSection
              title="Eyeshadow"
              items={advice.makeup.eyeshadow}
              type="colors"
            />
          </div>
        )}

        {activeTab === 'accessories' && (
          <div className="space-y-6">
            <AdviceSection
              title="Metals"
              items={advice.accessories.metals}
              type="text"
            />
            <AdviceSection
              title="Gemstones"
              items={advice.accessories.gemstones}
              type="text"
            />
            <AdviceSection
              title="Recommendations"
              items={advice.accessories.recommendations}
              type="text"
            />
          </div>
        )}

        {activeTab === 'harmonies' && (
          <ColorHarmonies season={season} />
        )}

        {activeTab === 'variations' && (
          <div className="space-y-6">
            <SeasonalVariation season={season} currentSeason="spring" />
            <SeasonalVariation season={season} currentSeason="summer" />
            <SeasonalVariation season={season} currentSeason="autumn" />
            <SeasonalVariation season={season} currentSeason="winter" />
          </div>
        )}
      </motion.div>
    </div>
  );
} 