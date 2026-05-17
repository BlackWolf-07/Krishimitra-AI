import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguageStore } from '../context/LanguageContext'
import { useVoice } from '../hooks/useVoice'
import Layout from '../components/Layout'
import { 
  ArrowLeft, 
  Lightbulb, 
  Volume2,
  Search,
  Calculator,
  Mic,
  AlertCircle,
  ChevronRight,
  Filter,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Stethoscope,
  FlaskConical,
  Droplets,
  Bug,
  Calendar,
  Sprout,
  Activity,
  X,
  Loader2,
  CheckCircle2
} from 'lucide-react'

// --- TYPES ---

interface CropData {
  id: string;
  nameKey: string;
  price: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  demand: 'High' | 'Medium' | 'Low';
  statusKey: string;
  history: number[];
  icon: string;
  bestMonth: string;
}

// --- CONSTANTS ---

const CROPS: CropData[] = [
  { id: 'rice', nameKey: 'crop_rice', icon: '🌾', bestMonth: 'nov', price: 28.5, change: 12.4, trend: 'up', demand: 'High', statusKey: 'high_demand', history: [22, 24, 23, 26, 25, 27, 28.5] },
  { id: 'potato', nameKey: 'crop_potato', icon: '🥔', bestMonth: 'mar', price: 18.2, change: -5.2, trend: 'down', demand: 'Medium', statusKey: 'falling', history: [22, 21, 20, 19, 19.5, 18.8, 18.2] },
  { id: 'wheat', nameKey: 'crop_wheat', icon: '🍞', bestMonth: 'may', price: 32.0, change: 2.1, trend: 'stable', demand: 'High', statusKey: 'stable', history: [31, 31.5, 31.2, 32, 32, 31.8, 32] },
  { id: 'onion', nameKey: 'crop_onion', icon: '🧅', bestMonth: 'jan', price: 45.8, change: 24.5, trend: 'up', demand: 'High', statusKey: 'high_demand', history: [32, 35, 38, 40, 42, 44, 45.8] },
  { id: 'tomato', nameKey: 'crop_tomato', icon: '🍅', bestMonth: 'dec', price: 12.5, change: -42.0, trend: 'down', demand: 'Low', statusKey: 'urgent_sell', history: [45, 38, 30, 25, 18, 15, 12.5] },
  { id: 'mustard', nameKey: 'crop_mustard', icon: '🍯', bestMonth: 'feb', price: 56.2, change: 8.3, trend: 'up', demand: 'Medium', statusKey: 'stable', history: [50, 52, 51, 54, 55, 55.5, 56.2] },
]

// --- COMPONENTS ---

const MarketChart = ({ data, color, id }: { data: number[], color: string, id: string }) => {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - ((d - min) / range) * 80 - 10
  }))

  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`

  return (
    <div className="h-24 w-full mt-4">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`${pathData} L 100,100 L 0,100 Z`}
          fill={`url(#grad-${id})`}
          opacity="0.2"
        />
      </svg>
    </div>
  )
}

const FarmingAssistant = () => {
  const navigate = useNavigate()
  const { t, language } = useLanguageStore()
  const { speak, listen, text: voiceText, isListening } = useVoice()

  const [searchTerm, setSearchBar] = useState('')
  const [sortBy, setSortBy] = useState<'price' | 'change'>('price')
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [estimator, setEstimator] = useState({ quantity: '', cropId: 'rice' })
  const [lastUpdated] = useState(new Date().toLocaleTimeString())
  const [bestSellingMonth, setBestSellingMonth] = useState<string | null>(null)

  // Tool states
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [toolResult, setToolResult] = useState<string | null>(null)

  const tools = [
    { id: 'doctor', icon: <Stethoscope size={32} />, label: t('crop_doctor'), color: 'bg-blue-500', res: 'tool_doctor_res' },
    { id: 'soil', icon: <FlaskConical size={32} />, label: t('soil_analyzer'), color: 'bg-amber-500', res: 'tool_soil_res' },
    { id: 'irrigation', icon: <Droplets size={32} />, label: t('smart_irrigation'), color: 'bg-cyan-500', res: 'tool_irrigation_res' },
    { id: 'pest', icon: <Bug size={32} />, label: t('pest_alert'), color: 'bg-red-500', res: 'tool_pest_res' },
    { id: 'calendar', icon: <Calendar size={32} />, label: t('farming_calendar'), color: 'bg-green-500', res: 'tool_calendar_res' },
  ]

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (voiceText) {
      const lowerText = voiceText.toLowerCase()
      const crop = CROPS.find(c => lowerText.includes(t(c.nameKey).toLowerCase()))
      if (crop) {
        const msg = `${t(crop.nameKey)} ${t('today_price')} is ₹${crop.price}/kg. ${t('market_demand')} is ${t(crop.demand.toLowerCase())}.`
        speak(msg, language)
      }
    }
  }, [voiceText, t, speak, language])

  const filteredCrops = useMemo(() => {
    return CROPS
      .filter(c => t(c.nameKey).toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => sortBy === 'price' ? b.price - a.price : b.change - a.change)
  }, [searchTerm, sortBy, t])

  const getAISuggestion = useCallback((crop: CropData) => {
    if (crop.statusKey === 'urgent_sell') return t('urgent_sell') + ": " + t('urgent_sell_desc')
    if (crop.trend === 'up') return t('sell_recommendation') + ": " + t('wait_rising')
    return t('sell_recommendation') + ": " + t('market_stable_desc')
  }, [t])

  const estimatedProfit = useMemo(() => {
    const crop = CROPS.find(c => c.id === estimator.cropId)
    const q = parseFloat(estimator.quantity)
    if (!crop || isNaN(q)) return "0.00"
    return (crop.price * q).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }, [estimator])

  const handleBestTime = () => {
    const crop = CROPS.find(c => c.id === estimator.cropId)
    if (crop) {
      const month = t(crop.bestMonth)
      setBestSellingMonth(month)
      const msg = `${t('best_time_is')} ${month}`
      speak(msg, language)
    }
  }

  const handleToolClick = async (tool: any) => {
    setActiveTool(tool.label)
    setIsAnalyzing(true)
    setToolResult(null)
    
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    const result = t(tool.res)
    setToolResult(result)
    setIsAnalyzing(false)
    speak(result, language)
  }

  return (
    <Layout fullWidth={true} className="bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <header className="p-6 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl z-50 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-rural-dark dark:text-white uppercase tracking-tight">{t('farming')}</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-bold text-gray-400 uppercase">{t('market_dashboard')} • LIVE</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isOffline && (
              <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                <AlertCircle size={14} />
                {t('offline_market')}
              </div>
            )}
            <button 
              onClick={() => listen(language)}
              className={`p-4 rounded-2xl transition-all ${isListening ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 animate-pulse' : 'bg-rural text-white shadow-lg shadow-rural/20 hover:scale-105'}`}
            >
              <Mic size={24} />
            </button>
          </div>
        </header>

        <main className="p-6 space-y-12">
          {/* Tool Modal */}
          <AnimatePresence>
            {activeTool && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden relative border border-white/10">
                  <button onClick={() => setActiveTool(null)} className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-gray-800 rounded-full dark:text-white z-10"><X size={20} /></button>
                  <div className="p-10 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-rural rounded-2xl flex items-center justify-center text-white"><Activity size={32} /></div>
                      <div>
                        <h3 className="text-2xl font-black dark:text-white uppercase">{activeTool}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase">{t('farming_intel_v1')}</p>
                      </div>
                    </div>
                    <div className="aspect-video bg-gray-50 dark:bg-gray-800 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700">
                      {isAnalyzing ? (
                        <><motion.div animate={{ y: [-100, 100, -100] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-x-0 h-1 bg-rural shadow-[0_0_20px_#10b981] z-10" /><Loader2 size={48} className="animate-spin text-rural mb-4" /><p className="text-sm font-black uppercase text-rural animate-pulse">{t('analyzing')}</p></>
                      ) : (
                        <div className="p-8 text-center space-y-4">
                          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg"><CheckCircle2 size={32} /></div>
                          <p className="font-bold text-gray-800 dark:text-gray-100">{toolResult}</p>
                          <p className="text-[10px] font-black text-green-500 uppercase">{t('ai_analysis_complete')}</p>
                        </div>
                      )}
                    </div>
                    <button onClick={() => setActiveTool(null)} className="w-full btn-primary bg-zinc-900 dark:bg-rural hover:bg-black py-5 rounded-3xl">{t('close')}</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section 1: Smart Tools */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Sprout className="text-rural" />
              {t('smart_tools')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {tools.map((tool) => (
                <motion.button whileTap={{ scale: 0.95 }} key={tool.id} onClick={() => handleToolClick(tool)} className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-lg flex flex-col items-center gap-4 border border-gray-50 dark:border-gray-800 group hover:border-rural/30 transition-all">
                  <div className={`p-4 rounded-2xl ${tool.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>{tool.icon}</div>
                  <span className="text-[10px] font-black uppercase text-center dark:text-white">{tool.label}</span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Market Ticker */}
          <div className="bg-zinc-900 text-white overflow-hidden py-3 rounded-2xl shadow-2xl relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-zinc-900 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-zinc-900 to-transparent z-10" />
            <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex whitespace-nowrap gap-12 font-mono text-xs font-bold">
              {CROPS.concat(CROPS).map((crop, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-gray-400">{t(crop.nameKey).toUpperCase()}:</span>
                  <span className="text-white">₹{crop.price}/kg</span>
                  <span className={crop.trend === 'up' ? 'text-green-400' : 'text-red-400'}>{crop.trend === 'up' ? '▲' : '▼'} {Math.abs(crop.change)}%</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Search & Sort */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
            <div className="lg:col-span-2 space-y-4">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder={t('search_crop')} className="w-full p-5 pl-14 bg-white dark:bg-gray-900 rounded-[2rem] border-none shadow-xl shadow-gray-200/50 dark:shadow-none focus:ring-2 focus:ring-rural transition-all outline-none" value={searchTerm} onChange={(e) => setSearchBar(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 bg-white dark:bg-gray-900 p-5 rounded-[2rem] shadow-lg flex items-center justify-between border border-gray-50 dark:border-gray-800">
                <div><p className="text-[10px] font-black text-gray-400 uppercase mb-1">{t('sort_by')}</p>
                  <select className="bg-transparent font-bold text-sm outline-none dark:text-white cursor-pointer" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                    <option value="price">{t('highest_price')}</option>
                    <option value="change">{t('biggest_increase')}</option>
                  </select>
                </div>
                <Filter className="text-rural" size={20} />
              </div>
            </div>
          </section>

          {/* Crop Grid */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-gray-800 dark:text-gray-100 flex items-center gap-2"><Activity className="text-blue-500" />{t('market_intelligence')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredCrops.map((crop) => (
                  <motion.div layout key={crop.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} whileHover={{ y: -8 }} className="card bg-white dark:bg-gray-900 p-8 border-none shadow-2xl rounded-[3rem] relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2 ${crop.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center text-4xl shadow-inner">{crop.icon}</div>
                        <div><h3 className="text-2xl font-black dark:text-white">{t(crop.nameKey)}</h3><div className={`flex items-center gap-1 text-xs font-black uppercase ${crop.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>{crop.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}{Math.abs(crop.change)}% {t('today_price')}</div></div>
                      </div>
                      <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase shadow-sm ${crop.statusKey === 'urgent_sell' ? 'bg-red-600 text-white animate-pulse' : crop.statusKey === 'high_demand' ? 'bg-blue-600 text-white' : 'bg-green-50 text-green-600 dark:bg-green-900/20'}`}>{t(crop.statusKey)}</div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-end gap-1"><span className="text-4xl font-black dark:text-white">₹{crop.price}</span><span className="text-gray-400 font-bold text-lg">/kg</span></div>
                      <MarketChart data={crop.history} color={crop.trend === 'up' ? '#22c55e' : crop.trend === 'down' ? '#ef4444' : '#3b82f6'} id={crop.id} />
                      <div className="bg-rural/5 dark:bg-rural/10 p-5 rounded-3xl border border-rural/10">
                        <div className="flex items-center gap-2 mb-2 text-rural"><Lightbulb size={16} /><p className="text-[10px] font-black uppercase tracking-widest">{t('sell_recommendation')}</p></div>
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-relaxed">{getAISuggestion(crop)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Profit Estimator */}
          <section className="bg-zinc-900 dark:bg-zinc-950 rounded-[4rem] p-10 lg:p-16 text-white relative overflow-hidden shadow-3xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-rural blur-[120px] opacity-20 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 blur-[100px] opacity-10 translate-y-1/2" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md"><Calculator size={20} className="text-rural" /><span className="text-xs font-black uppercase tracking-widest">{t('profit_estimator')}</span></div>
                <h2 className="text-4xl lg:text-6xl font-black leading-tight">{t('maximize_income')}</h2>
                <p className="text-gray-400 font-medium text-lg lg:max-w-md leading-relaxed">{t('estimate_earnings_desc')}</p>
                <div className="flex items-center gap-8">
                  <div><p className="text-3xl font-black">12.5k+</p><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('active_farmers')}</p></div>
                  <div className="w-px h-12 bg-white/10" />
                  <div><p className="text-3xl font-black">{t('wb_region')}</p><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('market_focus')}</p></div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-3xl p-8 lg:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">{t('select_crop')}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {CROPS.map(c => (
                      <button key={c.id} onClick={() => { setEstimator({ ...estimator, cropId: c.id }); setBestSellingMonth(null); }} className={`py-4 rounded-2xl transition-all border-2 text-xs font-bold ${estimator.cropId === c.id ? 'bg-rural border-rural text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'}`}>{t(c.nameKey)}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">{t('enter_quantity')}</label>
                  <input type="number" placeholder="0.00" className="w-full p-6 bg-white/5 rounded-3xl border-2 border-white/5 focus:border-rural outline-none text-2xl font-black transition-all text-white" value={estimator.quantity} onChange={(e) => setEstimator({ ...estimator, quantity: e.target.value })} />
                </div>
                <div className="pt-6 border-t border-white/10 space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase text-center tracking-[0.2em]">{t('estimated_earnings')}</p>
                  <motion.div key={estimatedProfit} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="text-5xl lg:text-6xl font-black text-center text-rural">₹{estimatedProfit}</motion.div>
                </div>
                <div className="flex flex-col gap-4">
                  <button onClick={handleBestTime} className="w-full btn-primary bg-rural hover:bg-rural-dark py-6 text-xl rounded-3xl shadow-xl shadow-rural/20">{t('best_time_to_sell')}<ChevronRight size={24} /></button>
                  <AnimatePresence>{bestSellingMonth && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-center gap-3 text-green-400 font-bold"><CalendarDays size={20} /><p>{t('best_time_is')} {bestSellingMonth}</p></motion.div>}</AnimatePresence>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 px-8 opacity-50">
            <p className="text-[10px] font-bold uppercase tracking-widest dark:text-white">{t('data_provided_by')}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest dark:text-white">{t('last_updated')}: {lastUpdated}</p>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default FarmingAssistant
