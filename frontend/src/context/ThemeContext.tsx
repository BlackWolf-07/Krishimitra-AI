import { create } from 'zustand'

interface ThemeState {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  // Initialize from localStorage or system preference
  isDarkMode: localStorage.getItem('theme') === 'dark' || 
              (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),
  
  toggleDarkMode: () => set((state) => {
    const newMode = !state.isDarkMode
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
    
    // Apply class immediately for better responsiveness
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    return { isDarkMode: newMode }
  }),
}))
