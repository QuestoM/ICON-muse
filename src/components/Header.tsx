'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex-1">
          {/* Left side empty for balance */}
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user && (
            <button
              onClick={signOut}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
} 