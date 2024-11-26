import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Analysis, Season } from '../types/color';
import {
  saveColorAnalysis,
  getUserAnalysis,
  toggleFavoriteColor,
  type ColorAnalysis,
  removeColorFromPalette,
  addCustomColorToPalette
} from '../firebase/colorAnalysisUtils';
import { ColorInfo } from '../types/color';

export function useColorAnalysis() {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      loadAnalysis();
    } else {
      // Reset state when user logs out
      setAnalysis(null);
      setLoading(false);
      setError(null);
    }
  }, [user]);

  const loadAnalysis = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getUserAnalysis(user.uid);
      if (data) {
        setAnalysis({
          season: data.season,
          favorites: data.favorites || [],
          profile: data.profile
        });
      } else {
        setAnalysis(null);
      }
    } catch (err) {
      console.error('Error loading analysis:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const saveAnalysis = async (data: Analysis | null) => {
    if (!user) return;
    
    try {
      setError(null);
      if (data) {
        const analysisData: Omit<ColorAnalysis, 'userId' | 'dateAnalyzed'> = {
          season: data.season,
          favorites: data.favorites || [],
          profile: data.profile,
          customCombinations: []
        };
        await saveColorAnalysis(user.uid, analysisData);
        setAnalysis(data);
      } else {
        // Handle deletion of analysis
        await saveColorAnalysis(user.uid, null);
        setAnalysis(null);
      }
    } catch (err) {
      console.error('Error saving analysis:', err);
      setError(err as Error);
      throw err; // Re-throw to allow handling in the component
    }
  };

  const toggleFavorite = async (colorHex: string) => {
    if (!user || !analysis) return;

    try {
      setError(null);
      await toggleFavoriteColor(user.uid, colorHex);
      setAnalysis(prev => {
        if (!prev) return prev;
        const favorites = prev.favorites || [];
        return {
          ...prev,
          favorites: favorites.includes(colorHex)
            ? favorites.filter(hex => hex !== colorHex)
            : [...favorites, colorHex]
        };
      });
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError(err as Error);
      throw err; // Re-throw to allow handling in the component
    }
  };

  const removeColor = async (colorHex: string) => {
    if (!user || !analysis) return;

    try {
      setError(null);
      await removeColorFromPalette(user.uid, colorHex);
      setAnalysis(prev => {
        if (!prev) return prev;
        const season = prev.season;
        return {
          ...prev,
          profile: {
            ...prev.profile,
            colors: {
              ...prev.profile.colors,
              [season]: prev.profile.colors[season].filter(
                color => color.hex !== colorHex
              )
            }
          }
        };
      });
    } catch (err) {
      console.error('Error removing color:', err);
      setError(err as Error);
      throw err;
    }
  };

  const addCustomColor = async (colorInfo: ColorInfo) => {
    if (!user || !analysis) return;

    try {
      setError(null);
      await addCustomColorToPalette(user.uid, colorInfo);
      setAnalysis(prev => {
        if (!prev) return prev;
        const season = prev.season;
        return {
          ...prev,
          profile: {
            ...prev.profile,
            colors: {
              ...prev.profile.colors,
              [season]: [...prev.profile.colors[season], colorInfo]
            }
          }
        };
      });
    } catch (err) {
      console.error('Error adding custom color:', err);
      setError(err as Error);
      throw err;
    }
  };

  return { 
    analysis, 
    loading, 
    error, 
    saveAnalysis, 
    toggleFavorite,
    removeColor,
    addCustomColor
  };
} 