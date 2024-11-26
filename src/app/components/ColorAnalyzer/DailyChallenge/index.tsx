import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { seasonalProfiles } from '@/lib/constants/colors';
import { Trophy, Camera, ChevronDown } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { uploadDailyChallengePhoto } from '@/lib/firebase/storage';
import { db } from '@/lib/firebase/firebase';
import { Season, ColorInfo } from '@/lib/types/color';
import * as Collapsible from '@radix-ui/react-collapsible';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyChallengeProps {
  season: Season;
}

export function DailyChallenge({ season }: DailyChallengeProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dailyColor, setDailyColor] = useState<ColorInfo | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadUserChallengeData = async () => {
      const userChallengeRef = doc(db, 'users', user.uid, 'challenges', 'daily');
      const challengeDoc = await getDoc(userChallengeRef);
      
      if (challengeDoc.exists()) {
        const data = challengeDoc.data();
        const lastCompletedDate = data.lastCompletedDate?.toDate();
        const today = new Date();
        
        // בדיקה אם המשתמש כבר השלים את האתגר היום
        if (lastCompletedDate && 
            lastCompletedDate.getDate() === today.getDate() &&
            lastCompletedDate.getMonth() === today.getMonth() &&
            lastCompletedDate.getFullYear() === today.getFullYear()) {
          setHasCompleted(true);
        }
        
        // חישוב הסטריק
        if (lastCompletedDate) {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastCompletedDate.getDate() === yesterday.getDate() &&
              lastCompletedDate.getMonth() === yesterday.getMonth() &&
              lastCompletedDate.getFullYear() === yesterday.getFullYear()) {
            setStreak(data.currentStreak || 0);
          } else if (lastCompletedDate.getDate() === today.getDate()) {
            setStreak(data.currentStreak || 0);
          } else {
            // אם פספסנו יום, מאפסים את הסטריק
            await updateDoc(userChallengeRef, { currentStreak: 0 });
            setStreak(0);
          }
        }
      }
    };

    loadUserChallengeData();
  }, [user]);

  useEffect(() => {
    // Get daily color based on date and season
    const getDailyColor = () => {
      const colors = seasonalProfiles[season].colors[season];
      const today = new Date();
      const index = (today.getFullYear() * 365 + today.getMonth() * 31 + today.getDate()) % colors.length;
      return colors[index];
    };
    
    setDailyColor(getDailyColor());
  }, [season]);

  const handlePhotoUpload = async (file: File | null) => {
    if (!user || !dailyColor || !file) return;
    
    setIsUploading(true);
    try {
      const photoUrl = await uploadDailyChallengePhoto(user.uid, file);
      
      const userChallengeRef = doc(db, 'users', user.uid, 'challenges', 'daily');
      const today = new Date();
      const newStreak = streak + 1;
      
      await setDoc(userChallengeRef, {
        lastCompletedDate: today,
        currentStreak: newStreak,
        lastPhotoUrl: photoUrl,
        lastColor: dailyColor.hex
      }, { merge: true });

      setStreak(newStreak);
      setHasCompleted(true);
    } catch (error) {
      console.error('Error uploading challenge photo:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Collapsible.Root 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className={`
        relative overflow-hidden rounded-lg
        bg-gradient-to-br from-white to-gray-50
        dark:from-gray-800 dark:to-gray-900
        border border-gray-200 dark:border-gray-700
        transition-all duration-300
        ${isOpen ? 'shadow-lg' : 'shadow-sm'}
        hover:shadow-md
      `}
    >
      <Collapsible.Trigger asChild>
        <button className="w-full p-6 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {streak} day streak
              </span>
            </div>
            {dailyColor && !hasCompleted && (
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full animate-pulse"
                  style={{ backgroundColor: dailyColor.hex }}
                />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  New Challenge Available!
                </span>
              </div>
            )}
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </motion.div>
        </button>
      </Collapsible.Trigger>

      <AnimatePresence>
        {isOpen && (
          <Collapsible.Content asChild forceMount>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-6 pt-0 space-y-4">
                {dailyColor && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-lg"
                        style={{ backgroundColor: dailyColor.hex }}
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                          Today's Color: {dailyColor.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Share a photo wearing this color!
                        </p>
                      </div>
                    </div>

                    {!hasCompleted ? (
                      <div className="mt-4">
                        <ImageUpload 
                          onImageChange={handlePhotoUpload}
                          disabled={isUploading}
                        />
                        {isUploading && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Uploading your photo...
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-lg">
                        <p className="font-medium">Challenge completed! 🎉</p>
                        <p className="text-sm mt-1">
                          You're on a {streak} day streak! Come back tomorrow for a new color.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </Collapsible.Content>
        )}
      </AnimatePresence>
    </Collapsible.Root>
  );
} 