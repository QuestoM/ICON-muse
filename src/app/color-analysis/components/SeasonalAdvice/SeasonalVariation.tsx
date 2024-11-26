interface SeasonalVariationProps {
  season: string;
  currentSeason: string;
}

export default function SeasonalVariation({ season, currentSeason }: SeasonalVariationProps) {
  const variations = seasonalVariations[season][currentSeason];
  
  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 capitalize">
        Your Colors for {currentSeason}
      </h3>
      <p className="text-gray-600 mb-6">{variations.description}</p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {variations.colors.map((color) => (
            <div
              key={color.name}
              className="space-y-2"
            >
              <div
                className="h-20 rounded-lg shadow-md"
                style={{ backgroundColor: color.hex }}
              />
              <div>
                <p className="font-medium text-sm">{color.name}</p>
                <p className="text-xs text-gray-500">{color.hex}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Recommended Combinations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {variations.combinations.map((combo, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-sm"
              >
                <div className="flex space-x-2 mb-2">
                  {combo.colors.map((hex) => (
                    <div
                      key={hex}
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
                <p className="text-sm">{combo.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 