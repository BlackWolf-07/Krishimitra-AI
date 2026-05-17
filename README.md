# AI SATHI (KrishiMitro AI) 🌾🤖

AI SATHI is an offline-first multilingual AI assistant designed specifically for rural India. It aims to bridge the digital divide for illiterate and semi-literate users by providing a voice-first, icon-rich, and highly accessible platform for agriculture, government schemes, and emergency assistance.

## 🚀 Key Features

### 1. Hybrid AI Brain (Online & Offline)
- **Advanced Gemini AI:** When online, uses Google Gemini Pro for complex reasoning and contextual advice.
- **Local Knowledge Base:** Seamlessly falls back to a locally stored intelligence engine when offline, ensuring critical farming and emergency tips are always available.
- **Transparent Switching:** Automatically detects connectivity to provide the best possible response without user intervention.

### 2. Multilingual Support
- Support for **English, Hindi, Bengali, Tamil, Telugu, and Marathi**.
- App-wide language switching including UI text and Voice Feedback.

### 3. Illiterate-Friendly UI
- **Large Buttons & Icons:** Designed for easy navigation without reading.
- **Voice-First Design:** Integrated Text-to-Speech (TTS) and Speech-to-Text (STT).
- **Audio Cues:** Pulse animations and audio feedback for primary actions.

### 4. KrishiMitro AI (Agriculture)
- **Crop Disease Detection:** Upload images to identify pests and diseases.
- **Weather Alerts:** Local weather with actionable farming advice.
- **Smart Farming Tips:** Seasonal guidance for soil and crop improvement.

### 5. AI Saathi (Companion)
- **Government Scheme Helper:** Simple explanations of schemes in local languages.
- **Medicine Reader:** Voice instructions for medicines via camera scan.
- **Emergency SOS:** One-tap emergency alerts to family and local authorities.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, TailwindCSS, Framer Motion, Lucide Icons.
- **Backend:** Node.js, Express.js.
- **Database:** SQLite (Backend), IndexedDB (Frontend).
- **PWA:** `vite-plugin-pwa` for service worker management.
- **AI Integration:** Google Gemini Pro API (via `@google/generative-ai`).

---

## 📦 Installation & Setup

1. **Clone the project**
   ```bash
   cd "KrishiMitro AI"
   ```

2. **Install Root Dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure Gemini API (Optional but Recommended)**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   *If no key is provided, the app will automatically use the high-performance local offline engine.*

4. **Run the Project (Concurrent)**
   ```bash
   npm start
   ```

---

## 📸 Hackathon Pitch

**Problem:** 70% of rural India depends on agriculture, yet many face language barriers and lack of internet access to modern AI tools. Illiteracy further excludes them from digital benefits.

**Solution:** AI SATHI provides an "Emotional & Practical Companion" that speaks their language, works without internet, and uses visual cues to empower them with expert knowledge.

**Impact:** Improved crop yield, faster access to government funds, and enhanced safety for rural families.

---

## 🛤️ Future Scope
- **Community Forum:** Voice-based social network for farmers.
- **Marketplace:** Direct farm-to-consumer sales via voice commands.
- **IOT Integration:** Smart soil sensors connected to the app.
- **Video Assistance:** Real-time video calls with agricultural experts.

---
Created with ❤️ for the Hackathon Demo.
