import { useNavigate } from 'react-router-dom'
import { useLanguageStore } from '../context/LanguageContext'
import { useThemeStore } from '../context/ThemeContext'
import { useAuthStore } from '../context/AuthContext'
import Layout from '../components/Layout'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  User, 
  Languages, 
  Bell, 
  Moon, 
  Shield, 
  Info,
  LogOut,
  ChevronRight,
  WifiOff
} from 'lucide-react'

const Settings = () => {
  const navigate = useNavigate()
  const { t, language } = useLanguageStore()
  const { isDarkMode, toggleDarkMode } = useThemeStore()
  const { user, logout } = useAuthStore()
  const [activeDetail, setActiveDetail] = useState<string | null>(null)

  const sections = [
    { id: 'profile', icon: <User size={24} />, label: t('profile'), path: '#' },
    { id: 'language', icon: <Languages size={24} />, label: t('language_label'), path: '/language', sub: language.toUpperCase() },
    { id: 'notifications', icon: <Bell size={24} />, label: t('notifications'), path: '#' },
    { id: 'darkmode', icon: <Moon size={24} />, label: t('dark_mode'), path: '#', toggle: true },
    { id: 'offline', icon: <WifiOff size={24} />, label: t('offline_mode'), path: '/offline' },
    { id: 'privacy', icon: <Shield size={24} />, label: t('privacy'), path: '#' },
    { id: 'help', icon: <Info size={24} />, label: t('help_about'), path: '#' },
  ]

  const handleRowClick = (item: any) => {
    if (item.id === 'darkmode') {
      toggleDarkMode()
    } else if (item.id === 'privacy' || item.id === 'help') {
      setActiveDetail(item.id)
    } else if (item.path !== '#') {
      navigate(item.path)
    }
  }

  const handleSignOut = () => {
    const confirmSignOut = window.confirm(t('confirm_sign_out'))
    if (confirmSignOut) {
      logout()
      navigate('/')
    }
  }

  if (activeDetail) {
    return (
      <Layout showNav={false}>
        <header className="p-6 bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4 transition-colors">
          <button onClick={() => setActiveDetail(null)} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-rural-dark dark:text-gray-100">
            {activeDetail === 'privacy' ? t('privacy') : t('help_about')}
          </h1>
        </header>
        <main className="p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-white dark:bg-gray-800 p-8 border-none shadow-xl rounded-[2.5rem]"
          >
            <div className="w-16 h-16 bg-rural/10 rounded-2xl flex items-center justify-center text-rural mb-6">
              {activeDetail === 'privacy' ? <Shield size={32} /> : <Info size={32} />}
            </div>
            <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
              {activeDetail === 'privacy' ? t('privacy_detail') : t('about_detail')}
            </p>
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-400">
                {activeDetail === 'privacy' ? "Last updated: May 2026" : "Version 1.0.0 (Hackathon Build)"}
              </p>
            </div>
          </motion.div>
        </main>
      </Layout>
    )
  }

  return (
    <Layout fullWidth={true}>
      <header className="p-6 bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4 transition-colors">
        <button onClick={() => navigate(-1)} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-rural-dark dark:text-gray-100">{t('settings')}</h1>
      </header>

      <main className="p-6 space-y-8">
        {/* User Card */}
        <div className="card bg-white dark:bg-gray-800 p-6 flex items-center gap-6 border-none">
          <div className="w-20 h-20 bg-rural rounded-full flex items-center justify-center text-white text-3xl font-bold uppercase">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold dark:text-gray-100">{user?.name || 'User'}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user?.phone || '+91 00000 00000'}</p>
          </div>
        </div>

        {/* Settings List */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm transition-colors border border-gray-100 dark:border-gray-700">
          {sections.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleRowClick(item)}
              className={`w-full p-6 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                index !== sections.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
              }`}
            >
              <div className="text-rural">
                {item.icon}
              </div>
              <span className="flex-1 text-left font-medium text-lg dark:text-gray-100">{item.label}</span>
              {item.sub && <span className="text-gray-400 text-sm mr-2">{item.sub}</span>}
              
              {item.toggle ? (
                <div 
                  className={`w-14 h-8 rounded-full relative transition-all duration-300 ${isDarkMode ? 'bg-rural' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div 
                    className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-md transition-all duration-300 ${isDarkMode ? 'left-7' : 'left-1'}`}
                  ></div>
                </div>
              ) : (
                <ChevronRight size={20} className="text-gray-300" />
              )}
            </button>
          ))}
        </div>

        <button 
          onClick={handleSignOut}
          className="w-full p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-sm hover:shadow-md"
        >
          <LogOut size={24} />
          {t('sign_out')}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Version 1.0.0 (Hackathon Build)
        </p>
      </main>
    </Layout>
  )
}

export default Settings

