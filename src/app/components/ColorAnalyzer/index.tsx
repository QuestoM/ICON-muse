'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useColorAnalysis } from '@/lib/hooks/useColorAnalysis';
import { useAuth } from '@/lib/hooks/useAuth';
import { Palette, Calendar, Layers, LogOut, RotateCcw, Download, UserPlus } from 'lucide-react';
import { seasonalDescriptions } from '@/lib/constants/colors';
import ColorPalette from './ColorPalette';
import SeasonalAdvice from './SeasonalAdvice';
import ColorCombinations from './ColorCombinations';
import ToneAnalyzer from './ToneAnalyzer';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import ColorPreview from './ColorPreview';
import PersonalNotes from '@/app/components/ColorAnalyzer/PersonalNotes';
import { User } from 'firebase/auth';
import { Analysis, ColorAnalysis } from '@/lib/types/color';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';
import { DailyChallenge } from './DailyChallenge';

// Add type for auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export default function ColorAnalyzer() {
  const { analysis, loading: analysisLoading, saveAnalysis } = useColorAnalysis();
  const { user, loading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('palette');

  const handleStartOver = () => {
    saveAnalysis(null);
  };

  const handleAnalysisComplete = async (analysisData: any) => {
    try {
      await saveAnalysis(analysisData);
    } catch (error) {
      console.error('Error saving analysis:', error);
    }
  };

  const handleExportPDF = async () => {
    if (!analysis) return;

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // Helper function to add page background
      const addPageBackground = () => {
        pdf.setFillColor(26, 26, 26);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      };

      // Helper function to add page title
      const addPageTitle = (title: string, y: number = 20) => {
        pdf.setFontSize(18);
        pdf.setTextColor(255, 255, 255);
        pdf.text(title, margin, y);
        return y + 15; // Return next Y position
      };

      // First page - Color Profile
      addPageBackground();
      let yPosition = 20;

      // Add header
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.text('ICON muse', margin, yPosition);
      yPosition += 15;

      // Add date
      pdf.setFontSize(10);
      pdf.setTextColor(200, 200, 200);
      pdf.text(format(new Date(), 'MMMM dd, yyyy'), margin, yPosition);
      yPosition += 20;

      // Add title
      pdf.setFontSize(20);
      pdf.setTextColor(255, 255, 255);
      const seasonTitle = `Your ${analysis.season.charAt(0).toUpperCase() + analysis.season.slice(1)} Color Profile`;
      pdf.text(seasonTitle, margin, yPosition);
      yPosition += 15;

      // Add description
      pdf.setFontSize(12);
      pdf.setTextColor(200, 200, 200);
      const description = analysis.profile.description || '';
      const splitDescription = pdf.splitTextToSize(description, contentWidth);
      pdf.text(splitDescription, margin, yPosition);
      yPosition += (splitDescription.length * 7) + 15;

      // Add color swatches
      const colors = analysis.profile.colors[analysis.season] || [];
      let startY = 75;
      let startX = 20;
      const swatchWidth = 35;
      const swatchHeight = 25;
      const colorsPerRow = 4;
      const textHeight = 15;
      const swatchMargin = (contentWidth - (swatchWidth * colorsPerRow)) / (colorsPerRow - 1);

      colors.forEach((color, index) => {
        const row = Math.floor(index / colorsPerRow);
        const col = index % colorsPerRow;
        const x = margin + (col * (swatchWidth + swatchMargin));
        const y = yPosition + (row * (swatchHeight + textHeight + 10));

        // Add color swatch
        pdf.setFillColor(...hexToRGB(color.hex));
        pdf.rect(x, y, swatchWidth, swatchHeight, 'F');

        // Add color name
        pdf.setFontSize(8);
        pdf.setTextColor(255, 255, 255);
        pdf.text(color.name, x, y + swatchHeight + 5);

        // Add hex value
        pdf.setTextColor(200, 200, 200);
        pdf.text(color.hex, x, y + swatchHeight + 10);
      });

      // Second page - Seasonal Advice
      pdf.addPage();
      addPageBackground();
      yPosition = addPageTitle('Seasonal Advice');

      // Add characteristics section
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Characteristics', margin, yPosition);
      yPosition += 10;

      // Add characteristics content
      pdf.setFontSize(12);
      pdf.setTextColor(200, 200, 200);

      const characteristics = [
        { title: 'Skin Tone', value: analysis.profile.characteristics.skinTone },
        { title: 'Eye Colors', value: analysis.profile.characteristics.eyeColor.join(', ') },
        { title: 'Hair Colors', value: analysis.profile.characteristics.hairColor.join(', ') }
      ];

      characteristics.forEach((char, index) => {
        pdf.setTextColor(230, 230, 230);
        pdf.text(`${char.title}:`, margin, yPosition + (index * 10));
        pdf.setTextColor(200, 200, 200);
        pdf.text(char.value, margin + 30, yPosition + (index * 10));
      });

      yPosition += 40;

      // Add clothing section
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Best Clothing Colors', margin, yPosition);
      yPosition += 10;

      // שינוי כאן: מסדרים את הצבעים לפי קטגוריות בלי לסנן לפי category
      const allColors = analysis.profile.colors[analysis.season] || [];
      const clothingColors = [
        { title: 'Primary Colors', colors: allColors.slice(0, 4) },
        { title: 'Accent Colors', colors: allColors.slice(4, 8) },
        { title: 'Neutral Colors', colors: allColors.slice(8) }
      ];

      clothingColors.forEach((section, sectionIndex) => {
        if (section.colors.length > 0) {
          pdf.setFontSize(12);
          pdf.setTextColor(230, 230, 230);
          pdf.text(section.title, margin, yPosition + (sectionIndex * 25));
          
          // Draw color swatches
          section.colors.forEach((color, colorIndex) => {
            const swatchX = margin + 40 + (colorIndex * 25);
            const swatchY = yPosition + (sectionIndex * 25) - 5;
            
            // Draw swatch
            pdf.setFillColor(...hexToRGB(color.hex));
            pdf.rect(swatchX, swatchY, 20, 10, 'F');
            
            // Add color name
            pdf.setFontSize(8);
            pdf.setTextColor(200, 200, 200);
            pdf.text(color.name, swatchX, swatchY + 15);
          });
        }
      });

      yPosition += 90;

      // Add makeup section
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Makeup Colors', margin, yPosition);
      yPosition += 10;

      const makeupAdvice = [
        'Lipstick: Warm coral, peach, and golden-based pinks',
        'Eye Shadow: Golden browns, warm peach, soft turquoise',
        'Blush: Warm coral, peachy pink, golden rose'
      ];

      makeupAdvice.forEach((advice, index) => {
        pdf.setFontSize(12);
        pdf.setTextColor(200, 200, 200);
        pdf.text(advice, margin, yPosition + (index * 8));
      });

      // Third page - Color Combinations
      pdf.addPage();
      addPageBackground();
      yPosition = addPageTitle('Color Combinations');

      // Add casual combinations
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Casual Combinations', margin, yPosition);
      yPosition += 10;

      const casualCombos = [
        { colors: ['#FF7F50', '#FFD700'], description: 'Coral with Golden Yellow' },
        { colors: ['#98FF98', '#FF8080'], description: 'Mint Green with Warm Pink' },
        { colors: ['#00CED1', '#FFDAB9'], description: 'Turquoise with Peachy Nude' }
      ];

      casualCombos.forEach((combo, index) => {
        const comboY = yPosition + (index * 30);
        
        // Draw color swatches
        combo.colors.forEach((colorHex, colorIndex) => {
          const swatchX = margin + (colorIndex * 25);
          pdf.setFillColor(...hexToRGB(colorHex));
          pdf.rect(swatchX, comboY, 20, 15, 'F');
        });

        // Add description
        pdf.setFontSize(12);
        pdf.setTextColor(200, 200, 200);
        pdf.text(combo.description, margin + 55, comboY + 10);
      });

      yPosition += 100;

      // Add formal combinations
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Formal Combinations', margin, yPosition);
      yPosition += 10;

      const formalCombos = [
        { colors: ['#CD7F32', '#F8B195'], description: 'Light Bronze with Golden Rose' },
        { colors: ['#DA8A67', '#CCCCFF'], description: 'Warm Copper with Periwinkle' },
        { colors: ['#F08080', '#98FF98'], description: 'Soft Coral with Mint Green' }
      ];

      formalCombos.forEach((combo, index) => {
        const comboY = yPosition + (index * 30);
        
        // Draw color swatches
        combo.colors.forEach((colorHex, colorIndex) => {
          const swatchX = margin + (colorIndex * 25);
          pdf.setFillColor(...hexToRGB(colorHex));
          pdf.rect(swatchX, comboY, 20, 15, 'F');
        });

        // Add description
        pdf.setFontSize(12);
        pdf.setTextColor(200, 200, 200);
        pdf.text(combo.description, margin + 55, comboY + 10);
      });

      // Add footer to all pages
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Generated by ICON muse - Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Save PDF
      const fileName = `${analysis.season}-color-profile-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Helper function to convert hex to RGB
  const hexToRGB = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  if (analysisLoading || authLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <Logo />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {signOut && (
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </div>
        </div>
        <div className="text-center text-gray-700 dark:text-gray-300">Loading your color profile...</div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <Logo />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {signOut && (
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800/10 rounded-lg p-6 shadow-sm dark:shadow-none">
          <ToneAnalyzer onComplete={handleAnalysisComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <Logo />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={handleStartOver}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>
            {signOut && (
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </div>
        </div>

        <div id="color-profile-content">
          {analysis && (
            <div className="mb-6">
              <DailyChallenge season={analysis.season} />
            </div>
          )}

          <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-lg mb-6 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">
              Your {analysis.season.charAt(0).toUpperCase() + analysis.season.slice(1)} Color Profile
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {seasonalDescriptions[analysis.season]}
            </p>
          </div>

          <ColorPreview colors={analysis.profile.colors[analysis.season] || []} />

          <Tabs defaultValue="palette" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 gap-2 mb-6 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-lg">
              <TabsTrigger 
                value="palette" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white flex items-center gap-2 text-gray-700 dark:text-gray-400"
              >
                <Palette className="w-4 h-4" />
                Color Palette
              </TabsTrigger>
              <TabsTrigger 
                value="seasonal" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white flex items-center gap-2 text-gray-700 dark:text-gray-400"
              >
                <Calendar className="w-4 h-4" />
                Seasonal Advice
              </TabsTrigger>
              <TabsTrigger 
                value="combinations" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white flex items-center gap-2 text-gray-700 dark:text-gray-400"
              >
                <Layers className="w-4 h-4" />
                Color Combinations
              </TabsTrigger>
              <TabsTrigger 
                value="personal" 
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white flex items-center gap-2 text-gray-700 dark:text-gray-400"
              >
                <UserPlus className="w-4 h-4" />
                Personal Notes
              </TabsTrigger>
            </TabsList>

            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700">
              <TabsContent value="palette" data-value="palette">
                <ColorPalette season={analysis.season} />
              </TabsContent>
              <TabsContent value="seasonal" data-value="seasonal">
                <SeasonalAdvice season={analysis.season} />
              </TabsContent>
              <TabsContent value="combinations" data-value="combinations">
                <ColorCombinations season={analysis.season} />
              </TabsContent>
              <TabsContent value="personal" data-value="personal">
                <PersonalNotes analysis={analysis as ColorAnalysis} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 