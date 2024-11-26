interface ColorCombinationProps {
  combination: string;
  type: 'casual' | 'formal' | 'accent';
}

export default function ColorCombination({ combination, type }: ColorCombinationProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <span className={`text-sm px-2 py-1 rounded ${
          type === 'casual' 
            ? 'bg-blue-100 text-blue-800'
            : type === 'formal'
            ? 'bg-purple-100 text-purple-800'
            : 'bg-green-100 text-green-800'
        }`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </div>
      <p className="mt-2 text-sm">{combination}</p>
    </div>
  );
} 