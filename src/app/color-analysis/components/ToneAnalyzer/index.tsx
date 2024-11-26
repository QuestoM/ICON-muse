'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { motion } from 'framer-motion';
import { ChevronRight, Camera, Sun, Palette } from 'lucide-react';
import QuestionStep from './QuestionStep';
import { analyzeImage } from '@/lib/utils/imageAnalysis';
import { Season } from '@/lib/types/color';
import { seasonalProfiles } from '@/lib/constants/colors';

interface ToneAnalyzerProps {
  onComplete: (analysisData: {
    season: Season;
    profile: typeof seasonalProfiles[Season];
    favorites: string[];
    recommendations?: {
      naturalSeason: Season;
      message: string;
    };
  }) => void;
}

type AnalysisStep = 'upload' | 'questions' | 'analyzing';

export default function ToneAnalyzer({ onComplete }: ToneAnalyzerProps) {
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('upload');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [image, setImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const steps = {
    upload: {
      title: 'Upload a Photo',
      description: 'Take or upload a photo of your face in natural lighting',
      icon: Camera,
    },
    questions: {
      title: 'Color Analysis Questions',
      description: 'Please answer these questions about your natural coloring as accurately as possible',
      icon: Palette,
      questions: [
        {
          id: 'skinTone',
          text: 'How would you describe your skin tone and undertone?',
          options: [
            { 
              value: 'spring-warm',
              label: 'Light to medium with warm undertones - Peachy or golden glow, looks best with gold jewelry'
            },
            { 
              value: 'summer-cool',
              label: 'Light to medium with cool undertones - Pinkish or rosy, looks best with silver jewelry'
            },
            { 
              value: 'autumn-warm',
              label: 'Medium to dark with warm undertones - Golden, bronze, or olive tint'
            },
            { 
              value: 'winter-cool',
              label: 'Very light or very dark with cool undertones - Porcelain or deep ebony'
            }
          ]
        },
        {
          id: 'eyeColor',
          text: 'Which best describes your natural eye color?',
          options: [
            { 
              value: 'spring-bright',
              label: 'Light and bright - Clear blue, bright green, or light golden brown'
            },
            { 
              value: 'summer-soft',
              label: 'Soft and muted - Soft blue, gray, green, or light hazel'
            },
            { 
              value: 'autumn-deep',
              label: 'Deep and warm - Deep brown, warm hazel, or warm green'
            },
            { 
              value: 'winter-intense',
              label: 'Intense and clear - Dark brown, icy blue, clear emerald, or dark hazel'
            }
          ]
        },
        {
          id: 'naturalHair',
          text: 'Is your current hair color your natural color?',
          options: [
            { value: 'yes', label: 'Yes, this is my natural hair color' },
            { value: 'no', label: 'No, I color my hair' }
          ]
        },
        {
          id: 'hairColor',
          text: 'What is your natural hair color? (If colored, please select your natural color before any processing)',
          options: [
            { 
              value: 'spring-light',
              label: 'Light blonde to medium brown with golden or red highlights'
            },
            { 
              value: 'summer-ash',
              label: 'Light ash blonde to medium ash brown without golden highlights'
            },
            { 
              value: 'autumn-warm',
              label: 'Dark blonde to dark brown with red or golden highlights, including auburn and chestnut'
            },
            { 
              value: 'winter-dark',
              label: 'Dark brown to black, typically without natural highlights'
            }
          ]
        }
      ],
    },
    analyzing: {
      title: 'Analyzing',
      description: 'We are analyzing your color profile...',
      icon: Sun,
    },
  };

  const handleImageChange = async (file: File | null) => {
    setImage(file);
    if (file) {
      setCurrentStep('questions');
    }
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextStep = async () => {
    if (currentStep === 'analyzing') {
      setIsAnalyzing(true);
      try {
        const aiAnalysis = image ? await analyzeImage(image) : null;
        const analysis = determineSeasonalType(answers, aiAnalysis);
        onComplete(analysis);
      } catch (error) {
        console.error('Error analyzing image:', error);
        const analysis = determineSeasonalType(answers);
        onComplete(analysis);
      }
      setIsAnalyzing(false);
    } else {
      const steps: AnalysisStep[] = ['upload', 'questions', 'analyzing'];
      const currentIndex = steps.indexOf(currentStep);
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const determineSeasonalType = (answers: Record<string, string>, aiAnalysis?: any): {
    season: Season;
    profile: typeof seasonalProfiles[Season];
    favorites: string[];
    recommendations?: {
      naturalSeason: Season;
      message: string;
    };
  } => {
    const traits = Object.entries(answers)
      .filter(([key, value]) => value.includes('-') && key !== 'naturalHairColor')
      .map(([_, value]) => value.split('-')[0]);
    
    const seasonCounts = traits.reduce((acc: Record<Season, number>, season: string) => {
      if (season in acc) {
        acc[season as Season]++;
      }
      return acc;
    }, { spring: 0, summer: 0, autumn: 0, winter: 0 });

    const currentSeason = Object.entries(seasonCounts)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0] as Season;

    const result: {
      season: Season;
      profile: typeof seasonalProfiles[Season];
      favorites: string[];
      recommendations?: {
        naturalSeason: Season;
        message: string;
      };
    } = {
      season: currentSeason,
      profile: seasonalProfiles[currentSeason],
      favorites: []
    };

    if (answers.naturalHair === 'no' && answers.naturalHairColor) {
      const naturalTraits = [...traits];
      const currentHairIndex = traits.findIndex(t => 
        answers.currentHairColor && answers.currentHairColor.startsWith(t)
      );
      
      if (currentHairIndex !== -1) {
        naturalTraits[currentHairIndex] = answers.naturalHairColor.split('-')[0];
      }

      const naturalSeasonCounts = naturalTraits.reduce((acc: Record<Season, number>, season: string) => {
        if (season in acc) {
          acc[season as Season]++;
        }
        return acc;
      }, { spring: 0, summer: 0, autumn: 0, winter: 0 });

      const naturalSeason = Object.entries(naturalSeasonCounts)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0] as Season;

      if (naturalSeason !== currentSeason) {
        result.recommendations = {
          naturalSeason,
          message: `Your natural hair color suggests you might be a ${naturalSeason} type. Consider transitioning to a hair color closer to your natural shade or with ${naturalSeason} undertones for a more harmonious look.`
        };
      }
    }

    return result;
  };

  return (
    <div className="space-y-6">
      {currentStep === 'upload' && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
            Let's Start Your Color Analysis
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8">
            Upload a clear photo of yourself in natural lighting for the best results
          </p>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 bg-gray-50 dark:bg-gray-800/30">
            <ImageUpload onImageChange={handleImageChange} />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Supported formats: JPG, PNG, GIF
            </p>
          </div>
        </div>
      )}

      {(currentStep === 'questions' && answers.skinTone && answers.eyeColor && answers.hairNatural && answers.hairColor) && (
        <button
          onClick={handleNextStep}
          className="w-full flex items-center justify-center space-x-2 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <span>Continue</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {currentStep === 'questions' && (
        <QuestionStep
          questions={steps[currentStep].questions}
          answers={answers}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
} 