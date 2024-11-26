interface ColorHarmony {
  name: string;
  colors: string[];
  description: string;
  examples: string[];
}

interface ColorHarmoniesProps {
  season: string;
}

export default function ColorHarmonies({ season }: ColorHarmoniesProps) {
  const harmonies = seasonalHarmonies[season];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Color Harmonies</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {harmonies.map((harmony) => (
          <div 
            key={harmony.name}
            className="p-4 bg-gray-50 rounded-lg space-y-4"
          >
            <h4 className="font-medium">{harmony.name}</h4>
            <div className="flex space-x-2">
              {harmony.colors.map((color) => (
                <div
                  key={color}
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">{harmony.description}</p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Examples:</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {harmony.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 