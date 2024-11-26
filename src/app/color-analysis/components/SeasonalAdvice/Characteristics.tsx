interface CharacteristicsProps {
  season: string;
}

export default function Characteristics({ season }: CharacteristicsProps) {
  const characteristics = seasonalCharacteristics[season];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-4">Skin Tone</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full" 
                style={{ backgroundColor: characteristics.skinTone.color }}
              />
              <span className="text-sm">{characteristics.skinTone.description}</span>
            </div>
            <p className="text-sm text-gray-600">
              {characteristics.skinTone.undertone}
            </p>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-4">Eye Color</h4>
          <div className="space-y-2">
            {characteristics.eyeColors.map((color, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm">{color.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-4">Hair Color</h4>
          <div className="space-y-2">
            {characteristics.hairColors.map((color, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm">{color.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-4">Overall Characteristics</h4>
        <ul className="list-disc list-inside space-y-2">
          {characteristics.overall.map((trait, index) => (
            <li key={index} className="text-sm text-gray-600">
              {trait}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 