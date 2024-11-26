import { SeasonalProfile, Season } from '../types/color';

export interface ColorData {
    name: string;
    hex: string;
    category: 'primary' | 'accent' | 'neutral';
    season: string;
  }
  
  export const seasonalColors: Record<string, ColorData[]> = {
    spring: [
      { name: 'Coral', hex: '#FF7F50', category: 'primary', season: 'spring' },
      { name: 'Golden Yellow', hex: '#FFD700', category: 'primary', season: 'spring' },
      { name: 'Bright Turquoise', hex: '#00CED1', category: 'primary', season: 'spring' },
      { name: 'Periwinkle', hex: '#CCCCFF', category: 'primary', season: 'spring' },
      { name: 'Mint Green', hex: '#98FF98', category: 'primary', season: 'spring' },
      { name: 'Warm Pink', hex: '#FF8080', category: 'accent', season: 'spring' },
      { name: 'Peachy Nude', hex: '#FFDAB9', category: 'accent', season: 'spring' },
      { name: 'Golden Rose', hex: '#F8B195', category: 'accent', season: 'spring' },
      { name: 'Bright Salmon', hex: '#FF8C69', category: 'accent', season: 'spring' },
      { name: 'Light Bronze', hex: '#CD7F32', category: 'neutral', season: 'spring' },
      { name: 'Warm Copper', hex: '#DA8A67', category: 'neutral', season: 'spring' },
      { name: 'Soft Coral', hex: '#F08080', category: 'neutral', season: 'spring' }
    ],
    summer: [
      { name: 'Powder Blue', hex: '#B6D0E2', category: 'primary', season: 'summer' },
      { name: 'Soft Rose', hex: '#DEB1B1', category: 'primary', season: 'summer' },
      { name: 'Cool Lavender', hex: '#E6E6FA', category: 'primary', season: 'summer' },
      { name: 'Dusty Pink', hex: '#D8B2BE', category: 'primary', season: 'summer' },
      { name: 'Sage Green', hex: '#B2AC88', category: 'primary', season: 'summer' },
      { name: 'Cool Mauve', hex: '#C8A2C8', category: 'accent', season: 'summer' },
      { name: 'Soft Berry', hex: '#A25768', category: 'accent', season: 'summer' },
      { name: 'Dusty Rose', hex: '#C4A4A4', category: 'accent', season: 'summer' },
      { name: 'Cool Pink', hex: '#D4A5A5', category: 'accent', season: 'summer' },
      { name: 'Silver Taupe', hex: '#9F8170', category: 'neutral', season: 'summer' },
      { name: 'Cool Gray', hex: '#D3D3D3', category: 'neutral', season: 'summer' },
      { name: 'Cool Plum', hex: '#8B4963', category: 'neutral', season: 'summer' }
    ],
    autumn: [
      { name: 'Burnt Orange', hex: '#CC5500', category: 'primary', season: 'autumn' },
      { name: 'Deep Olive', hex: '#556B2F', category: 'primary', season: 'autumn' },
      { name: 'Warm Burgundy', hex: '#800020', category: 'primary', season: 'autumn' },
      { name: 'Rich Terracotta', hex: '#E2725B', category: 'primary', season: 'autumn' },
      { name: 'Golden Brown', hex: '#996515', category: 'primary', season: 'autumn' },
      { name: 'Deep Mustard', hex: '#CD853F', category: 'accent', season: 'autumn' },
      { name: 'Forest Green', hex: '#228B22', category: 'accent', season: 'autumn' },
      { name: 'Copper Brown', hex: '#B87333', category: 'accent', season: 'autumn' },
      { name: 'Warm Russet', hex: '#80461B', category: 'accent', season: 'autumn' },
      { name: 'Rich Gold', hex: '#D4AF37', category: 'neutral', season: 'autumn' },
      { name: 'Warm Brown', hex: '#8B4513', category: 'neutral', season: 'autumn' },
      { name: 'Deep Moss', hex: '#4A5D23', category: 'neutral', season: 'autumn' },
      { name: 'Mahogany', hex: '#C04000', category: 'neutral', season: 'autumn' }
    ],
    winter: [
      { name: 'True White', hex: '#FFFFFF', category: 'primary', season: 'winter' },
      { name: 'Pure Black', hex: '#000000', category: 'primary', season: 'winter' },
      { name: 'Royal Blue', hex: '#4169E1', category: 'primary', season: 'winter' },
      { name: 'Vivid Fuchsia', hex: '#FF1493', category: 'primary', season: 'winter' },
      { name: 'Electric Purple', hex: '#9400D3', category: 'primary', season: 'winter' },
      { name: 'True Red', hex: '#FF0000', category: 'primary', season: 'winter' },
      { name: 'Emerald Green', hex: '#50C878', category: 'accent', season: 'winter' },
      { name: 'Deep Berry', hex: '#8B0A50', category: 'accent', season: 'winter' },
      { name: 'Bright Fuchsia', hex: '#FF00FF', category: 'accent', season: 'winter' },
      { name: 'Cool Crimson', hex: '#DC143C', category: 'accent', season: 'winter' },
      { name: 'Deep Purple', hex: '#301934', category: 'neutral', season: 'winter' },
      { name: 'Black Cherry', hex: '#3B0910', category: 'neutral', season: 'winter' },
      { name: 'Sapphire Blue', hex: '#0F52BA', category: 'neutral', season: 'winter' }
    ]
  };
  
  export const seasonalDescriptions = {
    spring: "Your colors are warm and bright, like the fresh blooms of spring. Your palette features clear, warm colors with yellow undertones.",
    summer: "Your colors are cool and soft, like a misty summer morning. Your palette features muted colors with blue undertones.",
    autumn: "Your colors are warm and deep, like fall foliage. Your palette features rich, muted colors with golden undertones.",
    winter: "Your colors are cool and bright, like fresh snow in sunlight. Your palette features clear colors with blue undertones."
  };
  
  export const seasonalProfiles: Record<Season, SeasonalProfile> = {
    spring: {
      characteristics: {
        skinTone: "Light to medium with warm undertones—may have a peachy or golden glow",
        eyeColor: ["Light and bright shades of blue", "green", "hazel", "light brown"],
        hairColor: ["Light blonde to medium brown", "often with golden or red highlights"]
      },
      colors: {
        spring: seasonalColors.spring.map(color => ({
          name: color.name,
          hex: color.hex,
          description: `${color.category === 'primary' ? 'Primary' : color.category === 'accent' ? 'Accent' : 'Neutral'} color - ${color.name}`
        })),
        summer: seasonalColors.summer.map(color => ({
          name: color.name,
          hex: color.hex,
          description: `Summer variation - ${color.name}`
        })),
        autumn: seasonalColors.autumn.map(color => ({
          name: color.name,
          hex: color.hex,
          description: `Autumn variation - ${color.name}`
        })),
        winter: seasonalColors.winter.map(color => ({
          name: color.name,
          hex: color.hex,
          description: `Winter variation - ${color.name}`
        }))
      },
      description: seasonalDescriptions.spring
    },
    summer: {
      characteristics: {
        skinTone: "Light to medium with cool undertones—may appear pinkish or rosy",
        eyeColor: ["Soft shades of blue", "gray", "green", "light hazel"],
        hairColor: ["Light ash blonde to medium ash brown", "lacking golden highlights"]
      },
      colors: {
        spring: seasonalColors.spring.map(color => ({
          name: color.name,
          hex: color.hex,
          description: `Spring variation - ${color.name}`
        })),
        summer: seasonalColors.summer.map(color => ({
          name: color.name,
          hex: color.hex,
          description: `${color.category === 'primary' ? 'Primary' : color.category === 'accent' ? 'Accent' : 'Neutral'} color - ${color.name}`
        })),
        autumn: seasonalColors.autumn.map(color => ({
          name: color.name,
          hex: color.hex,
          description: `Autumn variation - ${color.name}`
        })),
        winter: seasonalColors.winter.map(color => ({
          name: color.name,
          hex: color.hex,
          description: `Winter variation - ${color.name}`
        }))
      },
      description: seasonalDescriptions.summer
    },
    autumn: {
      characteristics: {
        skinTone: "Medium to dark with warm undertones—may have a golden, bronze, or olive tint",
        eyeColor: ["Deep shades of brown", "hazel", "green", "warm blue"],
        hairColor: ["Dark blonde to dark brown", "often with red or golden highlights", "includes auburn and chestnut shades"]
      },
      colors: {
        spring: seasonalColors.spring.map(color => ({
          name: color.name,
          hex: color.hex,
          description: `Spring variation - ${color.name}`
        })),
        summer: seasonalColors.summer.map(color => ({
          name: color.name,
          hex: color.hex,
          description: `Summer variation - ${color.name}`
        })),
        autumn: seasonalColors.autumn.map(color => ({
          name: color.name,
          hex: color.hex,
          description: `${color.category === 'primary' ? 'Primary' : color.category === 'accent' ? 'Accent' : 'Neutral'} color - ${color.name}`
        })),
        winter: seasonalColors.winter.map(color => ({
          name: color.name,
          hex: color.hex,
          description: `Winter variation - ${color.name}`
        }))
      },
      description: seasonalDescriptions.autumn
    },
    winter: {
      characteristics: {
        skinTone: "Very light or very dark with cool undertones—may appear porcelain or deep ebony",
        eyeColor: ["Intense shades of dark brown", "icy blue", "emerald green", "dark hazel"],
        hairColor: ["Dark brown to black", "often without natural highlights"]
      },
      colors: {
        spring: seasonalColors.spring.map(color => ({
          name: color.name,
          hex: color.hex,
          description: `Spring variation - ${color.name}`
        })),
        summer: seasonalColors.summer.map(color => ({
          name: color.name,
          hex: color.hex,
          description: `Summer variation - ${color.name}`
        })),
        autumn: seasonalColors.autumn.map(color => ({
          name: color.name,
          hex: color.hex,
          description: `Autumn variation - ${color.name}`
        })),
        winter: seasonalColors.winter.map(color => ({
          name: color.name,
          hex: color.hex,
          description: `${color.category === 'primary' ? 'Primary' : color.category === 'accent' ? 'Accent' : 'Neutral'} color - ${color.name}`
        }))
      },
      description: seasonalDescriptions.winter
    }
  };