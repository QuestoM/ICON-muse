interface AdviceSectionProps {
  title: string;
  items: string[] | { color: string; description: string }[];
  type: 'colors' | 'text' | 'combination';
  description?: string;
}

export default function AdviceSection({ 
  title, 
  items, 
  type,
  description 
}: AdviceSectionProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h4 className="font-medium text-lg">{title}</h4>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>

      <div className={`grid ${
        type === 'combination' 
          ? 'grid-cols-1' 
          : 'grid-cols-2 md:grid-cols-4'
      } gap-3`}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`rounded-lg ${
              type === 'colors'
                ? 'flex items-center space-x-2'
                : type === 'combination'
                ? 'p-4 bg-gray-50'
                : 'p-3 bg-gray-50'
            }`}
          >
            {type === 'colors' && typeof item === 'object' && (
              <>
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.description}</span>
              </>
            )}
            {type === 'text' && typeof item === 'string' && (
              <span className="text-sm">{item}</span>
            )}
            {type === 'combination' && typeof item === 'object' && (
              <div className="space-y-2">
                <div className="flex space-x-2">
                  {item.color.split(',').map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: color.trim() }}
                    />
                  ))}
                </div>
                <p className="text-sm">{item.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 