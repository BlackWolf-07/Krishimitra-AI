export const genericTemplates: Record<string, Record<string, string[]>> = {
  greeting: {
    en: ["Hello! I am AI SATHI. How can I assist you today?", "Namaste! Hope you are having a good day. What's on your mind?"],
    hi: ["नमस्ते! मैं आपका एआई साथी हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?", "प्रणाम! कैसे हैं आप? कुछ पूछना चाहते हैं?"],
    bn: ["নমস্কার! আমি আপনার এআই সাথী। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?", "হ্যালো! আপনার দিনটি ভালো কাটুক। আমি কি কোনো সাহায্য করতে পারি?"],
    ta: ["வணக்கம்! நான் உங்கள் AI சாதி. இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?", "வணக்கம்! நீங்கள் எப்படி இருக்கிறீர்கள்?"],
    te: ["నమస్కారం! నేను మీ AI సాథిని. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?", "నమస్కారం! మీరు ఎలా ఉన్నారు?"],
    mr: ["नमस्कार! मी तुमचा एआय साथी आहे. आज मी तुम्हाला कशी मदत करू शकतो?", "नमस्कार! काय चाललंय?"]
  },
  farming: {
    en: ["I can help with crop diseases, fertilizers, or seasonal tips. What do you need?", "Agriculture is important! Are you asking about seeds or soil?"],
    hi: ["मैं फसल रोगों, खाद या मौसमी सुझावों में मदद कर सकता हूँ। आपको क्या चाहिए?", "खेती बहुत महत्वपूर्ण है! क्या आप बीज या मिट्टी के बारे में पूछ रहे हैं?"]
  },
  casual: {
    en: ["I am doing great, thank you! I'm here to help you with farming.", "I'm just an AI, but I'm always ready to help you!"],
    hi: ["मैं ठीक हूँ, धन्यवाद! मैं यहाँ आपकी खेती में मदद करने के लिए हूँ।", "मैं एक एआई हूँ, लेकिन मैं हमेशा आपकी मदद के लिए तैयार हूँ!"]
  }
};

export const getRandomResponse = (intent: string, lang: string) => {
  const responses = genericTemplates[intent]?.[lang] || genericTemplates[intent]?.['en'] || ["I understand. Tell me more."];
  return responses[Math.floor(Math.random() * responses.length)];
};
