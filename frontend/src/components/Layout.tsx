import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguageStore } from '../context/LanguageContext'
import { 
  Sprout, 
  Building2, 
  AlertTriangle, 
  Settings as SettingsIcon,
  Home
} from 'lucide-react'

const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguageStore()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const navItems = [
    { icon: <Home size={28} />, path: '/dashboard', label: t('home') },
    { icon: <Sprout size={28} />, path: '/farming', label: t('farming') },
    { icon: <Building2 size={28} />, path: '/govt', label: t('govt_help') },
    { icon: <AlertTriangle size={28} />, path: '/emergency', label: t('emergency') },
    { icon: <SettingsIcon size={28} />, path: '/settings', label: t('settings') },
  ]

  return (
    <nav className="fixed bottom-6 left-6 right-6 h-20 glass dark:bg-gray-900/60 rounded-[2.5rem] flex items-center justify-around px-4 z-50 shadow-2xl transition-colors border-2 border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.3)]">
      {navItems.map((item, index) => (
        <div 
          key={item.path} 
          className="relative flex flex-col items-center"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === index && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -45, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                className="absolute px-3 py-1 bg-rural text-white text-xs font-bold rounded-full shadow-lg whitespace-nowrap pointer-events-none"
              >
                {item.label}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => navigate(item.path)}
            className={`p-3 transition-all rounded-full ${
              location.pathname === item.path ? 'text-rural scale-110' : 'text-gray-400 dark:text-gray-500 hover:text-rural hover:bg-rural/5'
            }`}
          >
            {item.icon}
          </button>
        </div>
      ))}
    </nav>
  )
}

interface LayoutProps {
  children: React.ReactNode
  showNav?: boolean
  className?: string
  fullWidth?: boolean
}

const Layout = ({ children, showNav = true, className = "", fullWidth = false }: LayoutProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`min-h-screen bg-rural-light dark:bg-gray-900 text-rural-dark dark:text-gray-100 ${showNav ? 'pb-28' : ''} ${className} transition-colors duration-300`}
    >
      <div className={fullWidth ? "w-full" : "max-w-xl mx-auto w-full"}>
        {children}
      </div>
      {showNav && (
        <div className={fullWidth ? "w-full" : "max-w-xl mx-auto w-full"}>
          <BottomNav />
        </div>
      )}
    </motion.div>
  )
}

export default Layout
