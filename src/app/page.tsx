'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import ColorAnalyzer from './components/ColorAnalyzer';
import { useState } from 'react';

export default function Home() {
  const { user, signInWithGoogle, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Failed to sign in:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen grid place-items-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">Personal Color Analysis</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to discover your perfect color palette</p>
          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="flex items-center justify-center bg-white text-gray-700 font-semibold py-2 px-4 rounded-full border border-gray-300 hover:bg-gray-100 transition duration-300 ease-in-out mx-auto"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-6 h-6 mr-2" />
            {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    );
  }

  return <ColorAnalyzer />;
}
