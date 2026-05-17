const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE";
const genAI = new GoogleGenerativeAI(API_KEY);

router.post('/', async (req, res) => {
  const { prompt, language, history } = req.body;

  try {
    if (API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
      return res.status(400).json({ error: "API Key not configured" });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      systemInstruction: `You are AI SATHI, an expert agricultural assistant for rural India. Respond in ${language}.`
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    
    res.json({ text: response.text() });
  } catch (error) {
    console.error("AI Route Error:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

module.exports = router;
