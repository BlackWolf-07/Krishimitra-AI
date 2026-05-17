export const detectLanguage = (text: string): string => {
  const hindiPattern = /[\u0900-\u097F]/;
  const bengaliPattern = /[\u0980-\u09FF]/;
  const tamilPattern = /[\u0B80-\u0BFF]/;
  const teluguPattern = /[\u0C00-\u0C7F]/;
  const marathiPattern = /[\u0900-\u097F]/; // Marathi uses Devanagari like Hindi

  if (bengaliPattern.test(text)) return 'bn';
  if (tamilPattern.test(text)) return 'ta';
  if (teluguPattern.test(text)) return 'te';
  
  // Distinguishing Marathi from Hindi is hard with regex alone, 
  // but for the sake of this assistant we can default to 'hi' 
  // or use common Marathi specific characters if needed.
  if (hindiPattern.test(text)) return 'hi';

  return 'en';
};

export const getLanguageName = (code: string): string => {
  const names: Record<string, string> = {
    'en': 'English',
    'hi': 'Hindi',
    'bn': 'Bengali',
    'ta': 'Tamil',
    'te': 'Telugu',
    'mr': 'Marathi'
  };
  return names[code] || 'English';
};
