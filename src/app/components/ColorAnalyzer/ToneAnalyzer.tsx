'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { Season } from '@/lib/types/color';
import { seasonalProfiles } from '@/lib/constants/colors';
import ThemeToggle from '@/components/ThemeToggle';
import Image from 'next/image';
import { motion } from 'framer-motion';

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

interface OptionImage {
  url: string;
  alt: string;
}

interface Option {
  value: string;
  label: string;
  description: string;
  images: OptionImage[];
}

interface Question {
  id: string;
  question: string;
  description?: string;
  options: Option[];
}

export default function ToneAnalyzer({ onComplete }: ToneAnalyzerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions: Question[] = [
    {
      id: 'skinTone',
      question: 'Select your skin tone and undertone',
      description: 'Choose the option that best matches your natural skin color',
      options: [
        { 
          value: 'spring-warm',
          label: 'Light with Warm Undertone',
          description: 'Peachy or golden glow, looks best with gold jewelry',
          images: [
            { url: '/images/skin/light-warm.png', alt: 'Light with warm undertone' },
            { url: '/images/skin/light-warm-2.png', alt: 'Light with warm undertone' },
            { url: '/images/skin/light-warm-3.png', alt: 'Light with warm undertone' }
          ]
        },
        { 
          value: 'summer-cool',
          label: 'Light with Cool Undertone',
          description: 'Pinkish or rosy, looks best with silver jewelry',
          images: [
            { url: '/images/skin/light-cool.png', alt: 'Light with cool undertone' },
            { url: '/images/skin/light-cool-2.png', alt: 'Light with cool undertone' },
            { url: '/images/skin/light-cool-3.png', alt: 'Light with cool undertone' }
          ]
        },
        { 
          value: 'autumn-warm',
          label: 'Medium to Dark with Warm Undertone',
          description: 'Golden, bronze, or olive tint',
          images: [
            { url: '/images/skin/dark-warm.png', alt: 'Medium to dark with warm undertone' },
            { url: '/images/skin/dark-warm-2.png', alt: 'Medium to dark with warm undertone' },
            { url: '/images/skin/dark-warm-3.png', alt: 'Medium to dark with warm undertone' }
          ]
        },
        { 
          value: 'winter-cool',
          label: 'Very Light or Dark with Cool Undertone',
          description: 'Porcelain or deep ebony',
          images: [
            { url: '/images/skin/dark-cool.png', alt: 'Very light or dark with cool undertone' },
            { url: '/images/skin/dark-cool-2.png', alt: 'Very light or dark with cool undertone' },
            { url: '/images/skin/dark-cool-3.png', alt: 'Very light or dark with cool undertone' }
          ]
        }
      ]
    },
    {
      id: 'eyeColor',
      question: 'Select your natural eye color',
      description: 'Choose the color that most closely matches your eyes',
      options: [
        { 
          value: 'spring-bright',
          label: 'Light and Bright',
          description: 'Clear and vibrant eye colors',
          images: [
            { url: '/images/eyes/bright-blue.png', alt: 'Clear blue eyes' },
            { url: '/images/eyes/bright-green.png', alt: 'Bright green eyes' },
            { url: '/images/eyes/golden-brown.png', alt: 'Light golden brown eyes' }
          ]
        },
        { 
          value: 'summer-soft',
          label: 'Soft and Muted',
          description: 'Gentle, grayed eye colors',
          images: [
            { url: '/images/eyes/soft-blue.png', alt: 'Soft blue eyes' },
            { url: '/images/eyes/gray.png', alt: 'Gray eyes' },
            { url: '/images/eyes/soft-green.png', alt: 'Soft green eyes' }
          ]
        },
        { 
          value: 'autumn-deep',
          label: 'Deep and Warm',
          description: 'Deep brown, warm hazel, or warm green',
          images: [
            { url: '/images/eyes/deep.png', alt: 'Deep and warm eye color' },
            { url: '/images/eyes/deep-2.png', alt: 'Deep and warm eye color' },
            { url: '/images/eyes/deep-3.png', alt: 'Deep and warm eye color' }
          ]
        },
        { 
          value: 'winter-intense',
          label: 'Intense and Clear',
          description: 'Dark brown, icy blue, clear emerald, or dark hazel',
          images: [
            { url: '/images/eyes/intense.png', alt: 'Intense and clear eye color' },
            { url: '/images/eyes/intense-2.png', alt: 'Intense and clear eye color' },
            { url: '/images/eyes/intense-3.png', alt: 'Intense and clear eye color' }
          ]
        }
      ]
    },
    {
      id: 'naturalHair',
      question: 'Is this your natural hair color?',
      description: 'Let us know if you currently color your hair',
      options: [
        { 
          value: 'yes',
          label: 'Yes, Natural',
          description: 'This is my natural hair color',
          images: [
            { url: '/images/hair/natural.png', alt: 'Natural hair color' },
            { url: '/images/hair/natural-2.png', alt: 'Natural hair color' },
            { url: '/images/hair/natural-3.png', alt: 'Natural hair color' }
          ]
        },
        { 
          value: 'no',
          label: 'No, Colored',
          description: 'I color my hair',
          images: [
            { url: '/images/hair/colored.png', alt: 'Colored hair' },
            { url: '/images/hair/colored-2.png', alt: 'Colored hair' },
            { url: '/images/hair/colored-3.png', alt: 'Colored hair' }
          ]
        }
      ]
    },
    {
      id: 'currentHairColor',
      question: 'What is your current hair color?',
      description: 'Select the option that best matches your current hair color',
      options: [
        { 
          value: 'spring-light',
          label: 'Light Warm',
          description: 'Light blonde to medium brown with golden or red tones',
          images: [
            { url: '/images/hair/light-warm.png', alt: 'Light blonde with warm tones' },
            { url: '/images/hair/light-warm-2.png', alt: 'Medium brown with golden tones' },
            { url: '/images/hair/light-warm-3.png', alt: 'Light brown with red tones' }
          ]
        },
        { 
          value: 'summer-ash',
          label: 'Light Cool',
          description: 'Light ash blonde to medium ash brown with cool tones',
          images: [
            { url: '/images/hair/light-cool.png', alt: 'Light ash blonde' },
            { url: '/images/hair/light-cool-2.png', alt: 'Medium ash brown' },
            { url: '/images/hair/light-cool-3.png', alt: 'Cool brown' }
          ]
        },
        { 
          value: 'autumn-warm',
          label: 'Dark Warm',
          description: 'Dark blonde to dark brown with warm or red tones',
          images: [
            { url: '/images/hair/dark-warm.png', alt: 'Dark blonde with warm tones' },
            { url: '/images/hair/dark-warm-2.png', alt: 'Auburn brown' },
            { url: '/images/hair/dark-warm-3.png', alt: 'Warm dark brown' }
          ]
        },
        { 
          value: 'winter-dark',
          label: 'Dark Cool',
          description: 'Dark brown to black with cool tones',
          images: [
            { url: '/images/hair/dark-cool.png', alt: 'Cool dark brown' },
            { url: '/images/hair/dark-cool-2.png', alt: 'Black with cool tones' },
            { url: '/images/hair/dark-cool-3.png', alt: 'Deep cool black' }
          ]
        }
      ]
    },
    {
      id: 'naturalHairColor',
      question: 'What was your natural hair color?',
      description: 'Select the option that best matches your natural hair color before any processing',
      options: [
        { 
          value: 'spring-light',
          label: 'Light Warm Natural',
          description: 'Light blonde to medium brown with golden or red highlights',
          images: [
            { url: '/images/hair/natural-light-warm.png', alt: 'Natural light blonde with warm tones' },
            { url: '/images/hair/natural-light-warm-2.png', alt: 'Natural medium brown with golden highlights' },
            { url: '/images/hair/natural-light-warm-3.png', alt: 'Natural light brown with red highlights' }
          ]
        },
        { 
          value: 'summer-ash',
          label: 'Light Cool Natural',
          description: 'Light ash blonde to medium ash brown without golden highlights',
          images: [
            { url: '/images/hair/natural-light-cool.png', alt: 'Natural light ash blonde' },
            { url: '/images/hair/natural-light-cool-2.png', alt: 'Natural medium ash brown' },
            { url: '/images/hair/natural-light-cool-3.png', alt: 'Natural cool brown' }
          ]
        },
        { 
          value: 'autumn-warm',
          label: 'Dark Warm Natural',
          description: 'Dark blonde to dark brown with red or golden highlights, including auburn and chestnut',
          images: [
            { url: '/images/hair/natural-dark-warm.png', alt: 'Natural dark blonde with warm tones' },
            { url: '/images/hair/natural-dark-warm-2.png', alt: 'Natural auburn' },
            { url: '/images/hair/natural-dark-warm-3.png', alt: 'Natural chestnut brown' }
          ]
        },
        { 
          value: 'winter-dark',
          label: 'Dark Cool Natural',
          description: 'Dark brown to black, typically without natural highlights',
          images: [
            { url: '/images/hair/natural-dark-cool.png', alt: 'Natural dark brown' },
            { url: '/images/hair/natural-dark-cool-2.png', alt: 'Natural black' },
            { url: '/images/hair/natural-dark-cool-3.png', alt: 'Natural deep black' }
          ]
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
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold mb-2 text-gray-900 dark:text-gray-50">
            {currentQuestion.question}
          </h2>
          {currentQuestion.description && (
            <p className="text-gray-600 dark:text-gray-300">
              {currentQuestion.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentQuestion.options.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={`relative group rounded-xl overflow-hidden shadow-lg transition-all 
                bg-white dark:bg-gray-900 ${
                answers[currentQuestion.id] === option.value
                  ? 'ring-2 ring-primary dark:ring-primary-light scale-105'
                  : 'hover:scale-105'
              }`}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="grid grid-cols-2 gap-1 p-2">
                {option.images.map((image, idx) => (
                  <div 
                    key={idx} 
                    className={`relative aspect-square rounded-lg overflow-hidden
                      ${option.images.length === 1 ? 'col-span-2' : 
                        option.images.length === 3 && idx === 2 ? 'col-span-2' : ''
                      }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {option.label}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {option.description}
                </p>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <span
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-primary dark:bg-primary-light'
                    : index < currentStep
                    ? 'bg-primary/30 dark:bg-primary-light/30'
                    : 'bg-gray-200 dark:bg-gray-800'
                }`}
              />
            ))}
          </div>
          
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 
                        hover:text-primary dark:hover:text-primary-light 
                        transition-colors"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 