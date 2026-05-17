import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import ErrorBoundary from './components/ErrorBoundary'
import Splash from './pages/Splash'
import LanguageSelection from './pages/LanguageSelection'
import Dashboard from './pages/Dashboard'
import FarmingAssistant from './pages/FarmingAssistant'
import EmergencyCenter from './pages/EmergencyCenter'
import GovernmentHelp from './pages/GovernmentHelp'
import AIChat from './pages/AIChat'
import Settings from './pages/Settings'
import OfflineStatus from './pages/OfflineStatus'
import { useLanguageStore } from './context/LanguageContext'
import { useThemeStore } from './context/ThemeContext'
import { useEffect } from 'react'

import Login from './pages/Login'

function App() {
  const location = useLocation()
  const { language } = useLanguageStore()
  const { isDarkMode } = useThemeStore()

  useEffect(() => {
    // Set language in html tag for accessibility
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    // Set initial theme
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    // Permanent cleanup of 'Ramesh Kumar' account
    try {
      const users = JSON.parse(localStorage.getItem('ai_sathi_users') || '{}')
      let updated = false
      for (const phone in users) {
        if (users[phone].name === 'Ramesh Kumar') {
          delete users[phone]
          updated = true
        }
      }
      if (updated) {
        localStorage.setItem('ai_sathi_users', JSON.stringify(users))
      }
    } catch (e) {
      console.error("User cleanup failed", e)
    }
  }, [])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-rural-light dark:bg-gray-900 text-rural-dark dark:text-gray-100 font-sans transition-colors duration-300">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/language" element={<LanguageSelection />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/farming" element={<FarmingAssistant />} />
            <Route path="/emergency" element={<EmergencyCenter />} />
            <Route path="/govt" element={<GovernmentHelp />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/offline" element={<OfflineStatus />} />
          </Routes>
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  )
}

export default App
