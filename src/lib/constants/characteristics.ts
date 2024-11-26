export interface SeasonalCharacteristics {
  skinTone: {
    description: string;
    undertone: string;
    bestFoundations: string[];
  };
  eyeColors: {
    description: string;
    examples: string[];
  }[];
  hairColors: {
    description: string;
    examples: string[];
  }[];
  characteristics: string[];
  bestFeatures: string[];
  challenges: string[];
}

export const seasonalCharacteristics: Record<string, SeasonalCharacteristics> = {
  summer: {
    skinTone: {
      description: "Light to medium with cool undertones",
      undertone: "Cool with pink or blue undertones",
      bestFoundations: [
        "Cool beige",
        "Rose beige",
        "Neutral with pink undertone"
      ]
    },
    eyeColors: [
      {
        description: "Soft blue",
        examples: ["Gray-blue", "Cool blue", "Muted blue"]
      },
      {
        description: "Gray",
        examples: ["Blue-gray", "Pure gray", "Green-gray"]
      },
      {
        description: "Cool green",
        examples: ["Sage green", "Gray-green", "Cool mint"]
      }
    ],
    hairColors: [
      {
        description: "Ash brown",
        examples: ["Light ash brown", "Medium ash brown", "Dark ash brown"]
      },
      {
        description: "Cool blonde",
        examples: ["Platinum", "Ash blonde", "Light cool brown"]
      }
    ],
    characteristics: [
      "Muted coloring",
      "Cool undertones",
      "Soft contrast between features",
      "Natural gray or ashy tones in hair"
    ],
    bestFeatures: [
      "Looks great in soft, cool colors",
      "Can wear both light and medium depth colors",
      "Suits silver jewelry perfectly"
    ],
    challenges: [
      "Can be overwhelmed by very bright colors",
      "Should avoid warm, golden tones",
      "Need to be careful with pure white"
    ]
  }
  // ... other seasons would follow the same pattern
}; 