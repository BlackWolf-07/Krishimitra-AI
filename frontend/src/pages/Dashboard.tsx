import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguageStore } from '../context/LanguageContext'
import { useAuthStore } from '../context/AuthContext'
import { useVoice } from '../hooks/useVoice'
import Layout from '../components/Layout'
import { 
  CloudSun, 
  Sprout, 
  AlertTriangle, 
  Building2, 
  MessageSquare, 
  Settings as SettingsIcon,
  Mic,
  Volume2,
  ChevronRight
} from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const { t, language } = useLanguageStore()
  const { user } = useAuthStore()
  const { speak } = useVoice()

  const features = [
    { id: 'farming', icon: <Sprout size={32} />, label: t('farming'), color: 'from-green-500 to-green-600', path: '/farming', desc: 'Crop advice & market monitoring' },
    { id: 'emergency', icon: <AlertTriangle size={32} />, label: t('emergency'), color: 'from-red-500 to-red-600', path: '/emergency', desc: 'Disaster alerts & SOS services' },
    { id: 'govt', icon: <Building2 size={32} />, label: t('govt_help'), color: 'from-blue-500 to-blue-600', path: '/govt', desc: 'Schemes & official assistance' },
    { id: 'chat', icon: <MessageSquare size={32} />, label: t('ai_chat'), color: 'from-purple-500 to-purple-600', path: '/chat', desc: 'Smart AI assistant support' },
  ]

  const playWeatherInfo = () => {
    const text = `${t('weather')}: 32°C, Sunny. Good time for sowing.`
    speak(text, language)
  }

  return (
    <Layout fullWidth={true} className="bg-slate-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <header className="py-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              {t('welcome').split(' ')[0]} <span className="text-rural">{user?.name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg tracking-wide uppercase text-xs">
              AI SATHI Agricultural Intelligence
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/settings')}
              className="p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 hover:scale-105 transition-all"
            >
              <SettingsIcon size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
            
            {/* Professional Weather Widget */}
            <div className="bg-white dark:bg-gray-800 p-3 pl-6 pr-6 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none flex items-center gap-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <CloudSun size={32} className="text-yellow-500" />
                <div>
                  <p className="text-2xl font-black leading-none dark:text-white">32°C</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('weather')}</p>
                </div>
              </div>
              <button 
                onClick={playWeatherInfo}
                className="w-10 h-10 bg-rural/10 text-rural rounded-full flex items-center justify-center hover:bg-rural hover:text-white transition-all"
              >
                <Volume2 size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Feature Grid - Wider Cards to fill space */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <button
                onClick={() => navigate(feature.path)}
                className="w-full bg-white dark:bg-gray-900 rounded-[3rem] p-8 text-left shadow-2xl shadow-gray-200/40 dark:shadow-none border-none flex items-center gap-8 transition-all hover:shadow-rural/10 overflow-hidden"
              >
                {/* Background Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-5 bg-gradient-to-br ${feature.color} -translate-y-1/2 translate-x-1/2`} />
                
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-[2rem] flex items-center justify-center text-white shadow-lg shadow-gray-300 dark:shadow-none shrink-0 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                
                <div className="flex-1 text-left">
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{feature.label}</h2>
                  <p className="text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
                    {feature.desc}
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 group-hover:text-rural transition-colors">
                  <ChevronRight size={24} />
                </div>
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  speak(feature.label + ". " + feature.desc, language);
                }}
                className="absolute top-6 right-20 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400 hover:text-rural shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Volume2 size={16} />
              </button>
            </motion.div>
          ))}
        </main>

        {/* Home Page Info Bar */}
        <div className="mt-16 bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none flex items-center justify-between border border-gray-100 dark:border-gray-700 opacity-60">
          <div className="flex items-center gap-4">
            <Sprout size={20} className="text-rural" />
            <p className="text-xs font-bold uppercase tracking-widest dark:text-white">Active Farming Region: West Bengal Hub</p>
          </div>
          <p className="text-[10px] font-black uppercase text-gray-400">Stable Connectivity • Encrypted Data</p>
        </div>
      </div>

      {/* Voice Assistant Floating Button */}
      <div className="fixed bottom-32 right-8 z-40">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/chat')}
          className="w-20 h-20 bg-rural rounded-full shadow-2xl flex items-center justify-center text-white pulse-primary border-4 border-white dark:border-gray-800 shadow-rural/40"
        >
          <Mic size={32} />
        </motion.button>
      </div>
    </Layout>
  )
}

export default Dashboard
