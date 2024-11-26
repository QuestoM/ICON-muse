import { Timestamp } from 'firebase/firestore';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface ColorInfo {
  name: string;
  hex: string;
  description?: string;
  category?: string;
}

export interface SeasonalProfile {
  characteristics: {
    skinTone: string;
    eyeColor: string[];
    hairColor: string[];
  };
  colors: {
    spring: ColorInfo[];
    summer: ColorInfo[];
    autumn: ColorInfo[];
    winter: ColorInfo[];
  };
  description: string;
}

export interface Analysis {
  season: Season;
  favorites: string[];
  profile: SeasonalProfile;
}

export interface InspirationImage {
  id: string;
  url: string;
  caption: string;
  createdAt: Timestamp;
}

export interface ColorAnalysis extends Analysis {
  userId: string;
  dateAnalyzed: Date;
  customCombinations?: {
    name: string;
    colors: string[];
    occasion: string;
    notes?: string;
  }[];
  personalNotes?: {
    id: string;
    text: string;
    createdAt: Date;
    createdBy: string;
  }[];
  inspirationImages?: InspirationImage[];
} 