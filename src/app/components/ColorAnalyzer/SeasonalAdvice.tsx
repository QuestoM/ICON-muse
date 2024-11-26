'use client';

import { useState } from 'react';
import { 
  Sun,
  Cloud,
  Leaf,
  Snowflake,
  Palette,
  Brush,
  Gem
} from 'lucide-react';
import { Season } from '@/lib/types/color';
import { seasonalAdvice } from '@/lib/constants/seasons';
import { seasonalColors } from '@/lib/constants/colors';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SeasonalAdviceProps {
  season: Season;
}

export default function SeasonalAdvice({ season }: SeasonalAdviceProps) {
  const [currentSeason, setCurrentSeason] = useState<Season | 'overview'>('overview');
  const baseAdvice = seasonalAdvice[season];
  
  const getSeasonIcon = (s: Season) => {
    switch (s) {
      case 'spring': return <Sun className="w-4 h-4" />;
      case 'summer': return <Cloud className="w-4 h-4" />;
      case 'autumn': return <Leaf className="w-4 h-4" />;
      case 'winter': return <Snowflake className="w-4 h-4" />;
    }
  };

  const ColorChip = ({ color }: { color: string }) => {
    const colorData = Object.values(seasonalColors)
      .flat()
      .find(c => c.name.toLowerCase() === color.toLowerCase());

    const backgroundColor = colorData?.hex || (
      color.toLowerCase().includes('#') 
        ? color 
        : color.toLowerCase().includes('gold') 
          ? '#FFD700'
          : color.toLowerCase().includes('silver') 
            ? '#C0C0C0'
            : color.toLowerCase().includes('copper') 
              ? '#B87333'
              : color.toLowerCase().includes('bronze') 
                ? '#CD7F32'
                : `var(--color-${color.toLowerCase().replace(/\s+/g, '-')})`
    );

    return (
      <div className="flex items-center gap-2">
        <div 
          className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
          style={{ backgroundColor }}
        />
        <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">
          {color}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Your {season.charAt(0).toUpperCase() + season.slice(1)} Color Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Learn how to adapt your colors for each season of the year
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6 bg-white dark:bg-gray-800/30 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400
              data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-gray-700 
              data-[state=active]:text-primary dark:data-[state=active]:text-white 
              hover:text-gray-900 dark:hover:text-gray-200
              transition-all duration-200"
          >
            <Palette className="w-4 h-4" />Overview
          </TabsTrigger>
          {(['spring', 'summer', 'autumn', 'winter'] as Season[]).map((s) => (
            <TabsTrigger 
              key={s} 
              value={s}
              className={`flex items-center gap-2 text-gray-600 dark:text-gray-400
                data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-gray-700 
                data-[state=active]:text-primary dark:data-[state=active]:text-white
                hover:text-gray-900 dark:hover:text-gray-200
                transition-all duration-200 ${
                  s === season ? 'ring-2 ring-primary' : ''
                }`}
            >
              {getSeasonIcon(s)}
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s === season && (
                <span className="ml-1 text-xs text-primary dark:text-primary-light">
                  (Your Season)
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Natural Characteristics
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Skin Tone:
                  </span><br />
                  {baseAdvice.characteristics.skinTone}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Eye Color:
                  </span><br />
                  {baseAdvice.characteristics.eyeColor.join(', ')}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Hair Color:
                  </span><br />
                  {baseAdvice.characteristics.hairColor.join(', ')}
                </p>
              </div>
            </div>

            <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                General Guidelines
              </h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>• Best Metals: {baseAdvice.accessories.metals.join(', ')}</p>
                <p>• Best Patterns: {baseAdvice.clothing.patterns.join(', ')}</p>
                <p>• Ideal Fabrics: {baseAdvice.clothing.fabrics.join(', ')}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {(['spring', 'summer', 'autumn', 'winter'] as Season[]).map((s) => (
          <TabsContent key={s} value={s}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    <Palette className="inline-block w-5 h-5 mr-2" />
                    {s.charAt(0).toUpperCase() + s.slice(1)} Season Colors
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Best Colors:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {seasonalAdvice[s].clothing.bestColors.map((color, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <ColorChip color={color} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Colors to Avoid:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {seasonalAdvice[s].clothing.avoidColors.map((color, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <ColorChip color={color} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    <Brush className="inline-block w-5 h-5 mr-2" />
                    Makeup Recommendations
                  </h3>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900 dark:text-white">Foundation:</p>
                      <ColorChip color={seasonalAdvice[s].makeup.foundation} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900 dark:text-white">Blush:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {seasonalAdvice[s].makeup.blush.map((color, idx) => (
                          <ColorChip key={idx} color={color} />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900 dark:text-white">Lipstick:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {seasonalAdvice[s].makeup.lipstick.map((color, idx) => (
                          <ColorChip key={idx} color={color} />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900 dark:text-white">Eyeshadow:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {seasonalAdvice[s].makeup.eyeshadow.map((color, idx) => (
                          <ColorChip key={idx} color={color} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    <Gem className="inline-block w-5 h-5 mr-2" />
                    Accessories & Combinations
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Metals & Gemstones:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {seasonalAdvice[s].accessories.metals.map((metal, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full ${
                              metal.toLowerCase().includes('gold') ? 'bg-yellow-400' :
                              metal.toLowerCase().includes('silver') ? 'bg-gray-300' :
                              metal.toLowerCase().includes('copper') ? 'bg-orange-600' :
                              metal.toLowerCase().includes('bronze') ? 'bg-amber-700' :
                              'bg-gray-400'
                            }`} />
                            <span className="text-gray-700 dark:text-gray-300">{metal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Outfit Ideas:
                      </h4>
                      <div className="space-y-2">
                        {seasonalAdvice[s].combinations.casual.map((combo, idx) => (
                          <p key={idx} className="text-gray-700 dark:text-gray-300">• {combo}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 