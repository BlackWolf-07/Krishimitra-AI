import { getGeminiResponse } from './geminiService';

export const translateText = async (text: string, sourceLang: string, targetLang: string) => {
  if (!text) return "";

  if (navigator.onLine) {
    try {
      const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Reply ONLY with the translated text: "${text}"`;
      const response = await getGeminiResponse(prompt, targetLang);
      return response || text;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  }

  // Very basic offline translation mock (in reality would need a local model or dictionary)
  return `[Offline] ${text}`;
};
