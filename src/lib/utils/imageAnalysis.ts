export async function analyzeImage(image: File): Promise<any> {
  const formData = new FormData();
  formData.append('image', image);

  try {
    const response = await fetch('/api/analyze-tone', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

export function determineSeasonalType(
  answers: Record<string, string>,
  aiAnalysis?: any
): string {
  // Combine questionnaire answers with AI analysis
  const warmSignals = [
    answers.veins === 'green',
    answers.jewelry === 'gold',
    aiAnalysis?.undertone === 'warm'
  ].filter(Boolean).length;

  const coolSignals = [
    answers.veins === 'blue',
    answers.jewelry === 'silver',
    aiAnalysis?.undertone === 'cool'
  ].filter(Boolean).length;

  // Simple determination logic (can be made more sophisticated)
  if (warmSignals > coolSignals) {
    return answers.contrast === 'high' ? 'autumn' : 'spring';
  } else {
    return answers.contrast === 'high' ? 'winter' : 'summer';
  }
} 