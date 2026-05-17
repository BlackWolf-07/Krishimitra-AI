/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,tsx,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10b981", // Emerald
        secondary: "#3b82f6", // Blue
        accent: "#f59e0b", // Amber
        rural: {
          light: "#ecfdf5",
          DEFAULT: "#10b981",
          dark: "#065f46"
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
