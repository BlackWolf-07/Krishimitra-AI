import { detectLanguage } from './languageDetector';
import { classifyIntent } from './intentClassifier';
import { getOfflineResponse, searchOfflineKnowledge } from './offlineAI';
import { getGeminiResponse } from './geminiService';
import { addToMemory } from './conversationMemory';

export const generateAIResponse = async (userInput: string, history: any[] = []) => {
  const lang = detectLanguage(userInput);
  const intent = classifyIntent(userInput);
  
  // 1. Online Mode: Try Gemini
  if (navigator.onLine) {
    try {
      const geminiResponse = await getGeminiResponse(userInput, lang, history);
      if (geminiResponse && geminiResponse.length > 5) {
        addToMemory(userInput, geminiResponse, intent);
        return {
          text: geminiResponse,
          lang,
          intent,
          mode: 'online'
        };
      }
    } catch (error) {
      console.error("Gemini failed, falling back to offline", error);
    }
  }

  // 2. Intelligent Offline Mode
  // First, try a high-precision keyword search in the knowledge base
  const searchResult = searchOfflineKnowledge(userInput);
  if (searchResult) {
    addToMemory(userInput, searchResult, intent);
    return {
      text: searchResult,
      lang,
      intent,
      mode: 'offline'
    };
  }

  // 3. Category Fallback
  // If no specific keyword match, use a random response based on the detected intent
  const offlineResp = getOfflineResponse(userInput);
  addToMemory(userInput, offlineResp.text, intent);
  
  return {
    ...offlineResp,
    mode: 'offline'
  };
};

