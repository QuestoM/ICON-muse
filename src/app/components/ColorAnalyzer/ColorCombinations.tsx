import { seasonalColors } from '@/lib/constants/colors';
import { seasonalAdvice } from '@/lib/constants/seasons';
import { Season } from '@/lib/types/color';

interface ColorCombinationsProps {
  season: Season;
}

export default function ColorCombinations({ season }: ColorCombinationsProps) {
  const colors = seasonalColors[season];
  const advice = seasonalAdvice[season];
  
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
            : `var(--color-${color.toLowerCase().replace(/\s+/g, '-')})`
    );

    return (
      <div className="flex items-center gap-2">
        <div 
          className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm"
          style={{ backgroundColor }}
        />
        <span className="text-gray-900 dark:text-gray-100">{color}</span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Color Combinations
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Here are some suggested color combinations for your {season} color palette
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {advice.combinations.casual.map((combo: string, index: number) => (
          <div 
            key={index} 
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <p className="text-gray-900 dark:text-white font-medium mb-4">{combo}</p>
            <div className="flex flex-wrap gap-4">
              {combo.split(' with ').map((part: string, idx: number) => (
                <ColorChip key={idx} color={part.split(' ')[0]} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {advice.combinations.formal.map((combo, index) => (
          <div 
            key={index} 
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <p className="text-gray-900 dark:text-white font-medium mb-4">{combo}</p>
            <div className="flex flex-wrap gap-4">
              {combo.split(' with ').map((part, idx) => (
                <ColorChip key={idx} color={part.split(' ')[0]} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 