'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors dark:hover:bg-gray-800/50 hover:bg-gray-200/50"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-gray-300 hover:text-white" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600 hover:text-gray-900" />
      )}
    </button>
  );
} 