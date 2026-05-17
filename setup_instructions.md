# Setup Instructions - AI SATHI

To get the application running for the hackathon demo, follow these steps:

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn

## 1. Initial Installation
From the root directory (`KrishiMitro AI`), run:
```powershell
npm run install-all
```
This will automatically install dependencies for the root, frontend, and backend.

## 2. Running the Application
Start both the frontend and backend simultaneously with one command:
```powershell
npm start
```

- **Frontend:** http://localhost:5173 (or your local IP)
- **Backend:** http://localhost:5000

## 3. PWA & Offline Testing
1. **Build the PWA:**
   ```bash
   npm run build
   ```
2. **Preview PWA:**
   ```bash
   npm run preview
   ```
3. Open the preview URL, then use DevTools -> Network -> **Offline** to test.
4. Use DevTools -> Application -> **Service Workers** to verify caching.

## 4. Mobile Access
Since `vite.config.ts` has `host: true`, you can access the app from your phone on the same Wi-Fi using your laptop's IP address (e.g., `http://192.168.1.10:5173`).

