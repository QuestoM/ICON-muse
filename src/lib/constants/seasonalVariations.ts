interface ColorVariation {
  name: string;
  hex: string;
  category: 'primary' | 'accent' | 'neutral';
}

interface ColorCombination {
  colors: string[];
  description: string;
}

interface SeasonalVariation {
  description: string;
  colors: ColorVariation[];
  combinations: ColorCombination[];
}

export const seasonalVariations: Record<string, Record<string, SeasonalVariation>> = {
  spring: {
    spring: {
      description: "Embrace fresh, vibrant colors that align with your warm and clear personal coloring.",
      colors: [
        { name: 'Coral', hex: '#FF6B6B', category: 'primary' },
        { name: 'Peach', hex: '#FFB4A2', category: 'primary' },
        { name: 'Golden Yellow', hex: '#FFD93D', category: 'primary' },
        { name: 'Turquoise', hex: '#40C9A2', category: 'accent' },
        { name: 'Periwinkle', hex: '#8E97D9', category: 'accent' },
        { name: 'Warm Beige', hex: '#F2D4C2', category: 'neutral' },
        { name: 'Mint Green', hex: '#95D5B2', category: 'primary' },
        { name: 'Light Apricot', hex: '#FFD8B1', category: 'accent' },
        { name: 'Creamy Ivory', hex: '#FFF5E1', category: 'neutral' },
        { name: 'Light Olive', hex: '#B5C99A', category: 'accent' }
      ],
      combinations: [
        {
          colors: ['#FF6B6B', '#F2D4C2', '#40C9A2'],
          description: 'Coral top with warm beige pants and turquoise accessories'
        },
        {
          colors: ['#FFB4A2', '#95D5B2', '#8E97D9'],
          description: 'Peach dress with mint green belt and periwinkle scarf'
        }
      ]
    },
    summer: {
      description: "Opt for slightly softer and cooler versions of your colors while maintaining warmth.",
      colors: [
        // ... Similar structure for summer colors
      ],
      combinations: [
        // ... Summer combinations
      ]
    },
    // ... autumn and winter variations
  },
  // ... other seasons (summer, autumn, winter)
}; 