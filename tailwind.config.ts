import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4169E1',
          light: '#5C7FE6',
          dark: '#2851C9',
        },
        light: {
          background: '#ffffff',
          foreground: '#1a1a1a',
          muted: '#666666',
          border: '#d1d5db',
          card: '#f3f4f6',
          hover: '#e5e7eb',
        },
        dark: {
          background: '#1a1a1a',
          foreground: '#ffffff',
          muted: '#a3a3a3',
          border: '#404040',
          card: '#2a2a2a',
          hover: '#333333',
        },
        // Winter Colors
        'winter-blue': '#4169E1',    // Royal Blue - עמוק ומלכותי
        'winter-red': '#DC143C',     // True Red - אדום טהור וחזק
        'winter-white': '#FFFFFF',   // Pure White - לבן מוחלט
        'winter-black': '#000000',   // Pure Black - שחור מוחלט
        
        // Summer Colors
        'summer-pink': '#E8A5A5',    // Soft Rose - ורוד רך ומעודן
        'summer-blue': '#A5C0E8',    // Powder Blue - כחול אבקתי עדין
        'summer-lavender': '#C8A5E8', // Lavender - לבנדר קריר ורך
        
        // Spring Colors
        'spring-coral': '#FF6B6B',   // Coral - אלמוגי חי ורענן
        'spring-peach': '#FFB4A2',   // Peach - אפרסקי עדין וחמים
        'spring-yellow': '#FFD93D',  // Golden Yellow - צהוב זהוב ושמשי
        
        // Autumn Colors
        'autumn-rust': '#D35400',    // Rust - חלודה חמה ועשירה
        'autumn-olive': '#6B8E23',   // Olive Green - ירוק זית עמוק
        'autumn-brown': '#8B4513',   // Warm Brown - חום חם ואדמתי
      },
      boxShadow: {
        'light': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'dark': '0 2px 8px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
