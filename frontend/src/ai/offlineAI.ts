import offlineKnowledge from './offlineKnowledge.json';
import { offlineKnowledgeBase } from './offlineKnowledgeBase';
import { detectLanguage } from './languageDetector';
import { classifyIntent } from './intentClassifier';

export const getOfflineResponse = (userInput: string) => {
  const lang = detectLanguage(userInput);
  const intent = classifyIntent(userInput);
  
  // Combine all knowledge sources
  const knowledge: any = { ...offlineKnowledge, ...offlineKnowledgeBase };
  const variations = knowledge[intent]?.[lang] || knowledge[intent]?.['en'] || knowledge['casual']['en'];
  
  // Randomly select a variation to avoid repetition
  const response = variations[Math.floor(Math.random() * variations.length)];
  
  return {
    text: response,
    lang,
    intent
  };
};

export const searchOfflineKnowledge = (userInput: string) => {
  const lang = detectLanguage(userInput);
  const lowerInput = userInput.toLowerCase();
  
  // Advanced scoring to find the BEST match in the knowledge base
  const categories = Object.keys(offlineKnowledgeBase);
  let bestMatch = null;
  let highestScore = 0;

  for (const cat of categories) {
    const responses = offlineKnowledgeBase[cat][lang] || offlineKnowledgeBase[cat]['en'] || [];
    
    responses.forEach((resp: string) => {
      let score = 0;
      const words = resp.toLowerCase().split(' ');
      
      words.forEach(word => {
        if (word.length > 3 && lowerInput.includes(word)) {
          score += 1;
        }
      });

      if (score > highestScore) {
        highestScore = score;
        bestMatch = resp;
      }
    });
  }
  
  // If we found a good enough match (at least 1 overlapping word)
  if (highestScore >= 1) {
    return bestMatch;
  }
  
  return null;
};

