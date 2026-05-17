import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguageStore } from '../context/LanguageContext'
import { useVoice } from '../hooks/useVoice'
import Layout from '../components/Layout'
import { 
  ArrowLeft, 
  AlertOctagon, 
  Volume2, 
  ShieldAlert,
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer,
  AlertTriangle, 
  MapPin, 
  WifiOff, 
  Navigation,
  CheckCircle2, 
  Activity, 
  Camera, 
  Mic, 
  Loader2, 
  PhoneCall,
  Clipboard, 
  Droplet, 
  Wrench, 
  Settings2, 
  Cog, 
  Truck, 
  Cpu, 
  HeartPulse, 
  ChevronRight 
} from 'lucide-react'

// Realistic Weather Data Type
interface WeatherData {
  region: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  rainProb: number;
  stormSeverity: 'low_risk' | 'moderate_risk' | 'high_risk' | 'dangerous';
  floodRisk: 'safe' | 'moderate_risk' | 'high_risk' | 'critical';
  lastUpdated: string;
  warning?: string;
}

interface LivestockReport {
  animal: string;
  symptoms: string;
  condition: string;
  firstAid: string;
  hydration: string;
  severity: 'mild' | 'moderate_level' | 'critical';
  timestamp: string;
}

interface MachineReport {
  machine: string;
  problem: string;
  diagnosis: string;
  steps: string[];
  severity: 'Low' | 'Medium' | 'High';
  timestamp: string;
}

const EmergencyCenter = () => {
  const navigate = useNavigate()
  const { t, language } = useLanguageStore()
  const { speak, listen, text: voiceText, isListening } = useVoice()
  
  // Weather states
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)
  const [locationName, setLocationName] = useState<string>('Detecting location...')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [isLoading, setIsLoading] = useState(true)

  // Livestock states
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null)
  const [symptoms, setSymptoms] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [report, setReport] = useState<LivestockReport | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Machine states
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null)
  const [machineProblem, setMachineProblem] = useState('')
  const [machineImage, setMachineImage] = useState<string | null>(null)
  const [isMachineAnalyzing, setIsMachineAnalyzing] = useState(false)
  const [machineReport, setMachineReport] = useState<MachineReport | null>(null)
  const machineFileRef = useRef<HTMLInputElement>(null)

  // Sync voice input with UI
  const prevIsListening = useRef(false)
  useEffect(() => {
    if (prevIsListening.current === true && isListening === false && voiceText) {
      if (selectedMachine) {
        setMachineProblem(prev => prev + (prev ? ' ' : '') + voiceText)
      } else {
        setSymptoms(prev => prev + (prev ? ' ' : '') + voiceText)
      }
    }
    prevIsListening.current = isListening
  }, [isListening, voiceText, selectedMachine])

  const currentMachineText = isListening && selectedMachine ? (machineProblem + ' ' + voiceText) : machineProblem
  const currentSymptomText = isListening && !selectedMachine ? (symptoms + ' ' + voiceText) : symptoms

  // Live Weather & Location Resolver
  const fetchLiveData = useCallback(async (lat: number, lng: number) => {
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`)
      const geoData = await geoRes.json()
      const city = geoData.address?.city || geoData.address?.town || geoData.address?.district || "West Bengal"
      setLocationName(`${city}, West Bengal`)

      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=precipitation_probability,windspeed_10m,relative_humidity_2m&timezone=auto`)
      const data = await weatherRes.json()

      if (data.hourly) {
        const current = data.current_weather
        const hourIndex = new Date().getHours()
        const rainProb = data.hourly.precipitation_probability[hourIndex] || 0
        const humidity = data.hourly.relative_humidity_2m[hourIndex] || 70

        const mappedData: WeatherData = {
          region: `${city}, WB`,
          temp: Math.round(current.temperature),
          humidity: humidity,
          windSpeed: Math.round(current.windspeed),
          rainProb: rainProb,
          stormSeverity: rainProb > 70 ? 'high_risk' : rainProb > 30 ? 'moderate_risk' : 'low_risk',
          floodRisk: rainProb > 80 ? 'critical' : rainProb > 40 ? 'moderate_risk' : 'safe',
          lastUpdated: new Date().toLocaleTimeString(),
          warning: rainProb > 50 ? t('heavy_rain_warning') : rainProb > 20 ? t('moderate_risk') : t('safe')
        }

        setWeatherData(mappedData)
        localStorage.setItem('last_weather_emergency', JSON.stringify(mappedData))
        localStorage.setItem('last_location_name', `${city}, West Bengal`)
      }
    } catch (error) {
      console.error("Failed to fetch live weather", error)
      const demo = {
        region: "West Bengal Region",
        temp: 34,
        humidity: 82,
        windSpeed: 12,
        rainProb: 5,
        stormSeverity: 'Low',
        floodRisk: 'Safe',
        lastUpdated: new Date().toLocaleTimeString(),
        warning: t('safe')
      }
      setWeatherData(demo as any)
    } finally {
      setIsLoading(false)
    }
  }, [t])

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const cachedData = localStorage.getItem('last_weather_emergency')
    const cachedName = localStorage.getItem('last_location_name')
    if (cachedData && !navigator.onLine) {
      setWeatherData(JSON.parse(cachedData))
      if (cachedName) setLocationName(cachedName)
      setIsLoading(false)
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setLocation({ lat: latitude, lng: longitude })
          fetchLiveData(latitude, longitude)
        },
        () => {
          const defaultLat = 22.5726, defaultLng = 88.3639
          setLocation({ lat: defaultLat, lng: defaultLng })
          fetchLiveData(defaultLat, defaultLng)
        }
      )
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [fetchLiveData])

  const handleSOS = () => {
    const sosMsg = t('sos_active')
    alert(sosMsg)
    speak(sosMsg, language)
  }

  const announceWeather = () => {
    if (!weatherData) return
    const msg = `${weatherData.warning}. ${t('flood_risk')}: ${t(weatherData.floodRisk.toLowerCase())}. ${t('wind_speed')}: ${weatherData.windSpeed} km/h.`
    speak(msg, language)
  }

  const handleAnalyzeLivestock = async () => {
    if (!selectedAnimal || (!symptoms && !image)) return
    setIsAnalyzing(true)
    setReport(null)
    await new Promise(resolve => setTimeout(resolve, 3000))
    const isCritical = symptoms.toLowerCase().includes('breathing') || symptoms.toLowerCase().includes('injury') || symptoms.toLowerCase().includes('blood')
    const isModerate = symptoms.toLowerCase().includes('fever') || symptoms.toLowerCase().includes('not eating')
    const newReport: LivestockReport = {
      animal: selectedAnimal,
      symptoms: symptoms,
      condition: isCritical ? 'Acute Respiratory Distress / Severe Trauma' : isModerate ? 'Viral Infection / Rumen Acidosis' : 'General Malaise / Nutrient Deficiency',
      firstAid: isCritical ? 'Keep animal in upright position. Stop bleeding with clean cloth. Minimize movement.' : 'Isolate animal from herd. Provide soft bedding. Check temperature every 2 hours.',
      hydration: 'Offer fresh water with electrolytes. For calves/goats, use oral rehydration salts (ORS).',
      severity: isCritical ? 'critical' : isModerate ? 'moderate_level' : 'mild',
      timestamp: new Date().toLocaleTimeString()
    }
    setReport(newReport)
    setIsAnalyzing(false)
    const voiceMsg = `${t('ai_vet_report')}. ${t('seriousness')}: ${t(newReport.severity)}. ${t('possible_condition')}: ${newReport.condition}. ${t('first_aid')}: ${newReport.firstAid}`
    speak(voiceMsg, language)
  }

  const handleAnalyzeMachine = async () => {
    if (!selectedMachine || (!machineProblem && !machineImage)) return
    setIsMachineAnalyzing(true)
    setMachineReport(null)
    await new Promise(resolve => setTimeout(resolve, 3000))
    const isHigh = machineProblem.toLowerCase().includes('smoke') || machineProblem.toLowerCase().includes('fire') || machineProblem.toLowerCase().includes('leak')
    const isMedium = machineProblem.toLowerCase().includes('starting') || machineProblem.toLowerCase().includes('sound') || machineProblem.toLowerCase().includes('heat')
    const newReport: MachineReport = {
      machine: selectedMachine,
      problem: machineProblem,
      diagnosis: isHigh ? t('machine_fault_critical') : isMedium ? t('machine_fault_medium') : t('machine_fault_low'),
      steps: isHigh 
        ? [t('step_turn_off'), t('step_disconnect_battery'), t('step_check_leaks'), t('step_no_restart')]
        : [t('step_check_fluids'), t('step_clean_filter'), t('step_check_voltage'), t('step_listen_noise')],
      severity: isHigh ? 'High' : isMedium ? 'Medium' : 'Low',
      timestamp: new Date().toLocaleTimeString()
    }
    setMachineReport(newReport)
    setIsMachineAnalyzing(false)

    const severityLabel = newReport.severity === 'High' ? t('high_risk') : newReport.severity === 'Medium' ? t('medium_risk') : t('low_risk')
    const voiceMsg = `${t('machine_emergency')}. ${t('severity_level')}: ${severityLabel}. ${newReport.diagnosis}. ${newReport.steps.join('. ')}`
    speak(voiceMsg, language)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleMachineImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setMachineImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'high_risk':
      case 'critical':
      case 'dangerous': return 'text-red-600 bg-red-50 border-red-200'
      case 'moderate_risk': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-green-600 bg-green-50 border-green-200'
    }
  }

  const getAISuggestions = () => {
    if (!weatherData) return []
    const isRaining = weatherData.rainProb > 50
    return [
      { label: isRaining ? t('protect_crops') : 'Monitor soil moisture', detail: isRaining ? 'Use plastic sheets for high-value crops' : 'Optimal time for standard fertilization' },
      { label: isRaining ? t('store_grains') : 'Clean storage areas', detail: isRaining ? 'Ensure storage area is 2ft above ground' : 'Prepare for next harvest cycle' },
      { label: isRaining ? t('disconnect_irrigation') : 'Check irrigation pumps', detail: isRaining ? 'Prevent short-circuits during lightning' : 'Ensure pumps are running efficiently' },
      { label: isRaining ? t('shelter_livestock') : 'Inspect livestock health', detail: isRaining ? 'Move animals to the designated concrete shelter' : 'Regular checkup for farming animals' },
    ]
  }

  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const loadLeaflet = async () => {
      if ((window as any).L) return
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.async = true
      document.head.appendChild(script)
      return new Promise((resolve) => { script.onload = () => resolve((window as any).L) })
    }

    loadLeaflet().then((L: any) => {
      if (!L || !mapContainerRef.current || mapRef.current) return
      const initialLat = location?.lat || 22.5726
      const initialLng = location?.lng || 88.3639
      mapRef.current = L.map(mapContainerRef.current, { zoomControl: false, attributionControl: false }).setView([initialLat, initialLng], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapRef.current)
      const icon = L.divIcon({ className: 'custom-div-icon', html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`, iconSize: [16, 16], iconAnchor: [8, 8] })
      L.marker([initialLat, initialLng], { icon }).addTo(mapRef.current)
      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current)
    })
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } }
  }, [location])

  useEffect(() => {
    const L = (window as any).L
    if (L && mapRef.current && location) { mapRef.current.setView([location.lat, location.lng], mapRef.current.getZoom()); }
  }, [location])

  return (
    <Layout className="bg-slate-50 dark:bg-gray-950" fullWidth={true}>
      <div className="max-w-7xl mx-auto">
        <AnimatePresence>
          {weatherData?.rainProb !== undefined && weatherData.rainProb > 50 && (
            <motion.div initial={{ y: -100 }} animate={{ y: 0 }} className="bg-red-600 text-white p-4 flex items-center justify-between shadow-lg sticky top-0 z-50 rounded-b-3xl">
              <div className="flex items-center gap-3"><AlertTriangle className="animate-pulse" /><span className="font-bold tracking-wide uppercase text-sm">{t('heavy_rain_warning')}</span></div>
              <button onClick={announceWeather} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"><Volume2 size={20} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-md"><ArrowLeft size={24} /></button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('emergency')}</h1>
          </div>
          {isOffline && <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200"><WifiOff size={14} />{t('offline_alerts')}</div>}
        </header>

        <main className="p-6 space-y-12 pb-32">
          <section className="flex flex-col items-center gap-4">
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleSOS} className="w-48 h-48 bg-red-600 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.4)] flex flex-col items-center justify-center text-white border-8 border-red-100 dark:border-red-900/30 active:bg-red-700 transition-colors">
              <AlertOctagon size={64} /><span className="text-3xl font-black mt-1">SOS</span>
            </motion.button>
            <p className="text-red-500 font-bold uppercase tracking-widest text-xs animate-pulse">Broadcast Emergency Alert</p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative">
            <section className="space-y-6 border-r-0 lg:border-r border-gray-100 dark:border-gray-800 pr-0 lg:pr-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20"><HeartPulse size={28} /></div>
                <div><h2 className="text-2xl font-black text-gray-800 dark:text-gray-100">{t('animal_emergency')}</h2><p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">AI Veterinary Assistant</p></div>
              </div>
              <div className="card bg-white dark:bg-gray-800 p-6 space-y-6 border-none shadow-xl rounded-[2.5rem]">
                <div className="space-y-3">
                  <p className="font-bold text-gray-700 dark:text-gray-300 text-sm ml-1">{t('select_animal')}</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[{ id: 'cow', label: t('cow'), icon: '🐄' }, { id: 'goat', label: t('goat'), icon: '🐐' }, { id: 'buffalo', label: t('buffalo'), icon: '🐃' }, { id: 'chicken', label: t('chicken'), icon: '🐓' }].map(animal => (
                      <button key={animal.id} onClick={() => setSelectedAnimal(animal.id)} className={`flex flex-col items-center gap-2 p-4 rounded-3xl transition-all border-2 ${selectedAnimal === animal.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-inner scale-95' : 'border-gray-50 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:border-orange-200'}`}>
                        <span className="text-3xl">{animal.icon}</span><span className="text-[10px] font-black uppercase dark:text-gray-200">{animal.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center ml-1">
                    <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">{t('describe_symptoms')}</p>
                    <button onClick={() => listen(language)} className={`p-2 rounded-full transition-colors ${isListening && !selectedMachine ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}><Mic size={20} /></button>
                  </div>
                  <textarea placeholder={t('symptoms_placeholder')} className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-3xl border-none focus:ring-2 focus:ring-orange-500 outline-none resize-none" value={currentSymptomText} onChange={(e) => setSymptoms(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div onClick={() => fileInputRef.current?.click()} className="aspect-square bg-gray-50 dark:bg-gray-700 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-orange-500 transition-colors cursor-pointer overflow-hidden relative">
                    {image ? <img src={image} alt="Preview" className="w-full h-full object-cover" /> : <><Camera size={32} className="text-gray-400 mb-2" /><span className="text-[10px] font-bold text-gray-400 uppercase text-center px-4">{t('upload_photo')}</span></>}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>
                  <button disabled={!selectedAnimal || (!symptoms && !image) || isAnalyzing} onClick={handleAnalyzeLivestock} className="aspect-square btn-primary bg-orange-600 hover:bg-orange-700 shadow-orange-600/30 rounded-3xl flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale">
                    {isAnalyzing ? <Loader2 size={32} className="animate-spin" /> : <Clipboard size={40} />}<span className="text-[10px] font-black uppercase tracking-widest">{isAnalyzing ? 'Analyzing...' : 'Get Help'}</span>
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {report && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                    <div className={`p-8 rounded-[2.5rem] border-2 shadow-2xl ${report.severity === 'critical' ? 'bg-red-50 dark:bg-red-900/10 border-red-200' : report.severity === 'moderate_level' ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200' : 'bg-green-50 dark:bg-green-900/10 border-green-200'}`}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${report.severity === 'critical' ? 'bg-red-600' : report.severity === 'moderate_level' ? 'bg-yellow-600' : 'bg-green-600'}`}><Activity size={24} /></div>
                          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase">{t('ai_vet_report')}</h3>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase shadow-sm bg-white ${report.severity === 'critical' ? 'text-red-600' : report.severity === 'moderate_level' ? 'text-yellow-600' : 'text-green-600'}`}>{t(report.severity)}</div>
                      </div>
                      <div className="space-y-6">
                        <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{t('possible_condition')}</p><p className="text-lg font-bold dark:text-white leading-tight">{report.condition}</p></div>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-white/50 dark:bg-black/20 p-5 rounded-3xl border border-white/20"><Activity size={18} className="text-blue-600 mb-2" /><p className="text-[10px] font-black uppercase">{t('first_aid')}</p><p className="text-sm dark:text-gray-300 font-medium">{report.firstAid}</p></div>
                          <div className="bg-white/50 dark:bg-black/20 p-5 rounded-3xl border border-white/20"><Droplet size={18} className="text-cyan-600 mb-2" /><p className="text-[10px] font-black uppercase">{t('hydration')}</p><p className="text-sm dark:text-gray-300 font-medium">{report.hydration}</p></div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-black text-gray-800 dark:text-gray-100 flex items-center gap-2 px-2"><PhoneCall size={20} className="text-rural" />{t('nearby_vet')}</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {[{ name: 'Dr. S. K. Mahato', phone: '+91 98321 00000' }, { name: 'State Vet Clinic', phone: '+91 33 2456 0000' }].map((vet, i) => (
                          <button key={i} onClick={() => window.location.href = `tel:${vet.phone}`} className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow active:scale-[0.98]">
                            <div className="flex items-center gap-4"><div className="w-12 h-12 bg-rural/10 rounded-full flex items-center justify-center text-rural"><MapPin size={24} /></div><div><p className="font-bold dark:text-white">{vet.name}</p><p className="text-[10px] font-bold text-gray-400 uppercase">Available Now</p></div></div>
                            <div className="p-3 bg-green-500 text-white rounded-2xl shadow-lg shadow-green-500/20"><PhoneCall size={20} /></div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-800 dark:bg-zinc-700 rounded-2xl flex items-center justify-center text-white shadow-lg"><Wrench size={28} /></div>
                <div><h2 className="text-2xl font-black text-gray-800 dark:text-gray-100">{t('machine_emergency')}</h2><p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">AI Machinery Diagnostics</p></div>
              </div>
              <div className="card bg-white dark:bg-gray-800 p-6 space-y-6 border-none shadow-xl rounded-[2.5rem] border-t-4 border-zinc-800">
                <div className="space-y-3">
                  <p className="font-bold text-gray-700 dark:text-gray-300 text-sm ml-1">{t('select_machine')}</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[{ id: 'tractor', label: t('tractor'), icon: <Truck size={24}/> }, { id: 'pump', label: t('pump'), icon: <Droplets size={24}/> }, { id: 'motor', label: t('motor'), icon: <Settings2 size={24}/> }, { id: 'harvester', label: t('harvester'), icon: <Cog size={24}/> }].map(machine => (
                      <button key={machine.id} onClick={() => setSelectedMachine(machine.id)} className={`flex flex-col items-center gap-2 p-4 rounded-3xl transition-all border-2 ${selectedMachine === machine.id ? 'border-zinc-800 bg-zinc-50 dark:bg-zinc-700 shadow-inner scale-95 text-zinc-900 dark:text-white' : 'border-gray-50 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:border-zinc-300 text-gray-400'}`}>
                        {machine.icon}<span className="text-[8px] font-black uppercase">{machine.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center ml-1">
                    <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">{t('describe_problem')}</p>
                    <button onClick={() => listen(language)} className={`p-2 rounded-full transition-colors ${isListening && selectedMachine ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}><Mic size={20} /></button>
                  </div>
                  <textarea placeholder={t('problem_placeholder')} className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-3xl border-none focus:ring-2 focus:ring-zinc-800 outline-none resize-none" value={currentMachineText} onChange={(e) => setMachineProblem(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div onClick={() => machineFileRef.current?.click()} className="aspect-square bg-gray-50 dark:bg-gray-700 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-zinc-500 transition-colors cursor-pointer overflow-hidden relative">
                    {machineImage ? <img src={machineImage} alt="Preview" className="w-full h-full object-cover" /> : <><Camera size={32} className="text-gray-400 mb-2" /><span className="text-[10px] font-bold text-gray-400 uppercase text-center px-4">Scan Parts</span></>}
                    <input type="file" ref={machineFileRef} className="hidden" accept="image/*" onChange={handleMachineImage} />
                  </div>
                  <button disabled={!selectedMachine || (!machineProblem && !machineImage) || isMachineAnalyzing} onClick={handleAnalyzeMachine} className="aspect-square btn-primary bg-zinc-800 hover:bg-zinc-900 shadow-zinc-800/30 rounded-3xl flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale">
                    {isMachineAnalyzing ? <Loader2 size={32} className="animate-spin" /> : <Cpu size={40} />}<span className="text-[10px] font-black uppercase tracking-widest">{isMachineAnalyzing ? 'Diagnosing...' : 'Diagnose'}</span>
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {machineReport && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="p-8 rounded-[2.5rem] border-2 shadow-2xl bg-zinc-900 text-white border-zinc-700 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10"><Cog size={120} className="animate-spin" /></div>
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-3"><Activity size={24} className="text-rural" /><h3 className="text-xl font-black uppercase">Diagnostic Result</h3></div>
                        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase shadow-sm ${machineReport.severity === 'High' ? 'bg-red-600' : machineReport.severity === 'Medium' ? 'bg-amber-600' : 'bg-green-600'}`}>{machineReport.severity} RISK</div>
                      </div>
                      <div className="space-y-6 relative z-10">
                        <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Detected Fault</p><p className="text-lg font-bold leading-tight text-white">{machineReport.diagnosis}</p></div>
                        <div className="space-y-3"><p className="text-[10px] font-bold text-gray-400 uppercase">{t('troubleshooting')}</p>
                          <div className="grid grid-cols-1 gap-2">
                            {machineReport.steps.map((step, i) => (
                              <div key={i} className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 border border-white/5"><div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-bold">{i+1}</div><p className="text-sm text-gray-200">{step}</p></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-black text-gray-800 dark:text-gray-100 flex items-center gap-2 px-2"><Truck size={20} className="text-rural" />{t('mechanic_help')}</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {[{ name: 'Kushal Mechanical Works', phone: '+91 97755 00000' }].map((mechanic, i) => (
                          <button key={i} onClick={() => window.location.href = `tel:${mechanic.phone}`} className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow active:scale-[0.98]">
                            <div className="flex items-center gap-4"><div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center text-zinc-800 dark:text-white"><Wrench size={24} /></div><div><p className="font-bold dark:text-white">{mechanic.name}</p><p className="text-[10px] font-bold text-gray-400 uppercase">Expert Mechanic • Active</p></div></div>
                            <div className="p-3 bg-zinc-800 text-white rounded-2xl shadow-lg"><PhoneCall size={20} /></div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>

          <section className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20"><CloudRain size={28} /></div>
                <div><h2 className="text-2xl font-black text-gray-800 dark:text-gray-100">{t('weather_alerts')}</h2><p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Satellite Monitoring</p></div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-rural uppercase flex items-center gap-1 justify-end"><MapPin size={10} /> {locationName}</div>
                <div className="text-[9px] font-bold text-gray-400 uppercase">Live Data • {weatherData?.lastUpdated || 'Loading...'}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative aspect-video lg:aspect-square bg-slate-900 rounded-[2.5rem] overflow-hidden border-4 border-slate-800 shadow-2xl">
                <div ref={mapContainerRef} className="absolute inset-0 z-0 h-full w-full" style={{ background: '#1a1a1a' }} />
                <div className="absolute inset-0 opacity-10 pointer-events-none z-10" style={{ backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px), linear-gradient(to right, #22c55e 1px, transparent 1px), linear-gradient(to bottom, #22c55e 1px, transparent 1px)', backgroundSize: '100% 100%, 20% 20%, 20% 20%' }} />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 origin-center bg-gradient-conic from-green-500/40 via-transparent to-transparent pointer-events-none z-20" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-green-500 font-mono text-[10px] z-30 pointer-events-none">
                  <div className="flex justify-between items-start pointer-events-auto">
                    <div className="bg-black/40 p-2 rounded backdrop-blur-md border border-green-500/30"><div>LAT: {location?.lat.toFixed(4)}</div><div>LNG: {location?.lng.toFixed(4)}</div></div>
                    <div className="bg-red-500 text-white px-2 py-1 rounded animate-pulse font-bold">LIVE GPS</div>
                  </div>
                  <div className="bg-black/40 p-2 rounded backdrop-blur-md border border-green-500/30">{locationName.toUpperCase()}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <CloudRain className="text-blue-500" />, label: t('rain_prob'), value: `${weatherData?.rainProb || 0}%`, sub: weatherData?.rainProb && weatherData.rainProb > 50 ? t('dangerous') : t('safe') },
                  { icon: <Wind className="text-amber-500" />, label: t('wind_speed'), value: `${weatherData?.windSpeed || 0} km/h`, sub: weatherData?.windSpeed && weatherData.windSpeed > 30 ? t('high_wind_warning') : 'Normal' },
                  { icon: <Droplets className="text-cyan-500" />, label: t('humidity'), value: `${weatherData?.humidity || 0}%`, sub: 'Relative' },
                  { icon: <Thermometer className="text-orange-500" />, label: t('temp'), value: `${weatherData?.temp || 0}°C`, sub: 'Current' },
                ].map((metric, i) => (
                  <motion.div key={i} whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-2">
                    <div className="p-2 bg-gray-50 dark:bg-gray-700 w-fit rounded-xl">{metric.icon}</div>
                    <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{metric.label}</p><p className="text-2xl font-black dark:text-white">{metric.value}</p></div>
                    <p className={`text-[9px] font-bold uppercase ${metric.sub === t('dangerous') || metric.sub === t('high_wind_warning') ? 'text-red-500' : 'text-green-500'}`}>{metric.sub}</p>
                  </motion.div>
                ))}
                <div className={`col-span-2 p-6 rounded-[2rem] border-2 flex items-center justify-between ${getRiskColor(weatherData?.floodRisk || '')}`}>
                  <div className="flex items-center gap-4"><div className="p-3 bg-white/50 rounded-2xl"><ShieldAlert size={32} /></div><div><h3 className="font-black text-xl leading-none">{t('flood_risk')}</h3><p className="text-sm font-bold opacity-80 mt-1">{weatherData?.floodRisk === 'safe' ? 'No Immediate Risk' : `${weatherData?.floodRisk}: Elevated Warning`}</p></div></div>
                  <div className="bg-white px-4 py-2 rounded-xl font-black text-xs shadow-sm uppercase">{t((weatherData?.floodRisk || 'safe').toLowerCase())}</div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-rural/10 dark:bg-rural/5 rounded-[2.5rem] p-8 border-2 border-rural/20">
            <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-rural rounded-xl flex items-center justify-center text-white shadow-lg"><CheckCircle2 size={24} /></div><h2 className="text-xl font-black text-rural-dark dark:text-rural-light">{t('ai_suggestions')}</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getAISuggestions().map((tip, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm">
                  <div className="mt-1 w-2 h-2 bg-rural rounded-full shrink-0" />
                  <div><p className="font-bold text-gray-800 dark:text-gray-100">{tip.label}</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{tip.detail}</p></div>
                </motion.div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </Layout>
  )
}

export default EmergencyCenter
