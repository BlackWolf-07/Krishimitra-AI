/// <reference types="vite/client" />
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE";
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (prompt: string, language: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) => {
  try {
    if (API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
      throw new Error("API Key not set");
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      systemInstruction: `You are AI SATHI, a professional agricultural AI assistant for rural farmers in India.
      Goal: Provide technical, practical, and moderately elaborate agricultural guidance.
      
      CRITICAL RULES:
      1. Response Length: You MUST provide moderately elaborate answers. Do NOT give one-liners. Provide at least 2-3 detailed paragraphs or a comprehensive list.
      2. Language: You MUST respond in ${language}.
      3. Technical Depth: Explain the "Why" and "How". If asked about a crop, explain soil prep, seed selection, and pest management.
      4. Farming Expertise: Provide specific solutions (e.g., organic fertilizers like Neem oil, crop rotation for Nitrogen, specific KVK contacts).
      5. Formatting: Use markdown (bullet points, bold text) to make complex information readable.
      6. Contextual Continuity: Build on previous context without repeating basic greetings.`
    } as any);
    
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};
