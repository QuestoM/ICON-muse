'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { Season } from '@/lib/types/color';
import { seasonalProfiles } from '@/lib/constants/colors';
import ThemeToggle from '@/components/ThemeToggle';

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

interface AnalysisResult {
  season: Season;
  profile: typeof seasonalProfiles[Season];
  favorites: string[];
  recommendations?: {
    naturalSeason: Season;
    message: string;
  };
}

export default function ToneAnalyzer({ onComplete }: ToneAnalyzerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    {
      id: 'skinTone',
      question: 'How would you describe your skin tone and undertone?',
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
      question: 'Which best describes your natural eye color?',
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
      question: 'Is your current hair color your natural color?',
      options: [
        { value: 'yes', label: 'Yes, this is my natural hair color' },
        { value: 'no', label: 'No, I color my hair' }
      ]
    },
    {
      id: 'currentHairColor',
      question: 'What is your current hair color?',
      options: [
        { 
          value: 'spring-light',
          label: 'Light blonde to medium brown with golden or red tones'
        },
        { 
          value: 'summer-ash',
          label: 'Light ash blonde to medium ash brown with cool tones'
        },
        { 
          value: 'autumn-warm',
          label: 'Dark blonde to dark brown with warm or red tones'
        },
        { 
          value: 'winter-dark',
          label: 'Dark brown to black with cool tones'
        }
      ]
    },
    {
      id: 'naturalHairColor',
      question: 'What was your natural hair color?',
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
  ];

  const handleAnswer = (value: string) => {
    const currentQuestion = questions[currentStep];
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));

    if (currentStep < questions.length - 1) {
      if (currentQuestion.id === 'naturalHair' && value === 'yes') {
        setCurrentStep(prev => prev + 2);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      const analysis = determineSeasonalType(answers);
      onComplete(analysis);
    }
  };

  const determineSeasonalType = (answers: Record<string, string>): AnalysisResult => {
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

    const result: AnalysisResult = {
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

  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{currentQuestion.question}</h2>
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <Button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              variant="outline"
              className="w-full justify-start text-left p-4 text-gray-800 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-gray-300 dark:border-gray-600"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
} 