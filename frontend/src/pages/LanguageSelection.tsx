import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguageStore, Language } from '../context/LanguageContext'
import { useAuthStore } from '../context/AuthContext'
import { useVoice } from '../hooks/useVoice'
import { Globe, Volume2, ChevronRight, Check } from 'lucide-react'
import { useState } from 'react'

const languages: { code: Language; name: string; local: string; voice: string; desc: string }[] = [
  { code: 'hi', name: 'Hindi', local: 'हिंदी', desc: 'अपनी पसंदीदा भाषा चुनें', voice: 'नमस्ते, अपनी भाषा चुनें' },
  { code: 'bn', name: 'Bengali', local: 'বাংলা', desc: 'আপনার পছন্দের ভাষা নির্বাচন করুন', voice: 'নমস্কার, আপনার ভাষা নির্বাচন করুন' },
  { code: 'ta', name: 'Tamil', local: 'தமிழ்', desc: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்', voice: 'வணக்கம், உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்' },
  { code: 'te', name: 'Telugu', local: 'తెలుగు', desc: 'మీ భాషను ఎంచుకోండి', voice: 'నమస్కారం, మీ భాషను ఎంచుకోండి' },
  { code: 'mr', name: 'Marathi', local: 'मराठी', desc: 'तुमची भाषा निवडा', voice: 'नमस्कार, तुमची भाषा निवडा' },
  { code: 'en', name: 'English', local: 'English', desc: 'Choose your preferred language', voice: 'Hello, select your language' },
]

const LanguageSelection = () => {
  const navigate = useNavigate()
  const { setLanguage, language: currentLang, t } = useLanguageStore()
  const { isAuthenticated } = useAuthStore()
  const { speak } = useVoice()
  const [selected, setSelected] = useState<Language>(currentLang)

  const handleSelect = (lang: Language) => {
    setSelected(lang)
    setLanguage(lang)
  }

  const handleConfirm = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-300">
      {/* Top Banner */}
      <div className="bg-rural h-48 rounded-b-[4rem] flex flex-col items-center justify-center text-white px-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/20 p-4 rounded-3xl mb-4"
        >
          <Globe size={32} />
        </motion.div>
        <h1 className="text-3xl font-bold">{t('personalize_experience')}</h1>
        <p className="opacity-80 mt-1">{t('select_primary_language')}</p>
      </div>

      <main className="flex-1 px-6 -mt-8 pb-32">
        <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.code}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelect(lang.code)}
              className={`relative overflow-hidden cursor-pointer rounded-[2rem] p-6 flex items-center justify-between border-2 transition-all duration-300 ${
                selected === lang.code 
                ? 'bg-rural/5 border-rural shadow-lg scale-[1.02]' 
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-rural/30'
              }`}
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-colors ${
                  selected === lang.code ? 'bg-rural text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                }`}>
                  {lang.local.charAt(0)}
                </div>
                <div>
                  <h2 className={`text-xl font-bold dark:text-white ${selected === lang.code ? 'text-rural' : 'text-gray-800'}`}>
                    {lang.local}
                  </h2>
                  <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{lang.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    speak(lang.voice, lang.code)
                  }}
                  className={`p-3 rounded-full transition-colors ${
                    selected === lang.code ? 'bg-rural text-white' : 'bg-gray-50 dark:bg-gray-700 text-gray-400'
                  }`}
                >
                  <Volume2 size={20} />
                </button>
                {selected === lang.code && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }}
                    className="w-8 h-8 bg-rural rounded-full flex items-center justify-center text-white"
                  >
                    <Check size={20} strokeWidth={3} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Floating Action Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50"
      >
        <button
          onClick={handleConfirm}
          className="btn-primary w-full max-w-2xl mx-auto py-4 text-lg rounded-2xl shadow-2xl shadow-rural/30"
        >
          Continue in {languages.find(l => l.code === selected)?.name}
          <ChevronRight size={20} />
        </button>
      </motion.div>
    </div>
  )
}

export default LanguageSelection
