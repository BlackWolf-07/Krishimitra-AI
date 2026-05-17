import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguageStore } from '../context/LanguageContext'
import { useVoice } from '../hooks/useVoice'
import Layout from '../components/Layout'
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  Volume2, 
  ExternalLink,
  Building2
} from 'lucide-react'

const GovernmentHelp = () => {
  const navigate = useNavigate()
  const { t, language } = useLanguageStore()
  const { speak } = useVoice()

  const schemes = [
    { id: '1', title: t('scheme_kisan_title'), desc: t('scheme_kisan_desc'), color: 'from-orange-500 to-orange-600', link: 'https://pmkisan.gov.in/' },
    { id: '2', title: t('scheme_bima_title'), desc: t('scheme_bima_desc'), color: 'from-green-500 to-green-600', link: 'https://pmfby.gov.in/' },
    { id: '3', title: t('scheme_kcc_title'), desc: t('scheme_kcc_desc'), color: 'from-blue-500 to-blue-600', link: 'https://www.myscheme.gov.in/schemes/kcc' },
  ]

  const playSchemeInfo = (title: string, desc: string) => {
    speak(`${title}. ${desc}`, language)
  }

  const openPortal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Layout fullWidth={true} className="bg-slate-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <header className="py-10 flex items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate(-1)} className="p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 hover:scale-105 transition-all">
              <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                {t('govt_help')}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase text-xs">
                Official Schemes & Digital Assistance
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-3 bg-white dark:bg-gray-800 p-2 pl-4 pr-2 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Portal Access: ACTIVE</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </header>

        <main className="space-y-10 pb-32">
          {/* Search Section */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search government schemes..."
              className="w-full p-5 pl-16 bg-white dark:bg-gray-900 rounded-[2rem] border-none shadow-xl shadow-gray-200/50 dark:shadow-none focus:ring-2 focus:ring-rural transition-all outline-none text-lg font-medium"
            />
          </div>

          {/* Schemes Grid - Matching Home Page Professional Style */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <FileText className="text-rural" size={20} />
              <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-wider">Recommended Schemes</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {schemes.map((scheme, index) => (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <button
                    onClick={() => openPortal(scheme.link)}
                    className="w-full bg-white dark:bg-gray-900 rounded-[3rem] p-8 text-left shadow-2xl shadow-gray-200/40 dark:shadow-none border-none flex items-center gap-8 transition-all hover:shadow-rural/10 overflow-hidden"
                  >
                    {/* Background Accent */}
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-5 bg-gradient-to-br ${scheme.color} -translate-y-1/2 translate-x-1/2`} />
                    
                    <div className={`w-20 h-20 bg-gradient-to-br ${scheme.color} rounded-[2rem] flex items-center justify-center text-white shadow-lg shadow-gray-300 dark:shadow-none shrink-0 group-hover:scale-110 transition-transform`}>
                      <FileText size={32} />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{scheme.title}</h4>
                      <p className="text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
                        {scheme.desc}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 group-hover:text-rural transition-colors">
                        <ExternalLink size={20} />
                      </div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      playSchemeInfo(scheme.title, scheme.desc);
                    }}
                    className="absolute top-6 right-24 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400 hover:text-rural shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Volume2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* System Footer Info */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] shadow-xl shadow-gray-200/50 dark:shadow-none flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-100 dark:border-gray-700 opacity-60">
            <div className="flex items-center gap-4 text-center md:text-left">
              <Building2 size={24} className="text-rural" />
              <p className="text-sm font-bold uppercase tracking-widest dark:text-white">Central & State Agricultural Database Synchronized</p>
            </div>
            <p className="text-[10px] font-black uppercase text-gray-400">Secure Protocol v3.4 • Real-time Updates</p>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default GovernmentHelp
