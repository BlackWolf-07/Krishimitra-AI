import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguageStore } from '../context/LanguageContext'
import { useVoice } from '../hooks/useVoice'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { generateAIResponse } from '../ai/responseEngine'
import { translateText } from '../ai/translationService'
import { getLanguageName } from '../ai/languageDetector'
import { 
  ArrowLeft, 
  Mic, 
  Send, 
  Volume2, 
  Loader2, 
  Bot,
  WifiOff,
  Sparkles,
  Languages,
  Copy,
  Check,
  RefreshCw,
  MoreVertical,
  Trash2
} from 'lucide-react'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  lang?: string
  mode?: 'online' | 'offline'
}

const AIChat = () => {
  const navigate = useNavigate()
  const { t, language } = useLanguageStore()
  const { isListening, text: voiceText, listen, speak } = useVoice()
  const isOnline = useOnlineStatus()
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: t('welcome_ai'), isBot: true, timestamp: new Date(), lang: language }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showTranslator, setShowTranslator] = useState(false)
  const [copiedId, setCopiedIndex] = useState<string | null>(null)
  
  // Translator State
  const [transText, setTransText] = useState('')
  const [sourceLang, setSourceLang] = useState(language)
  const [targetLang, setTargetLang] = useState('en')
  const [isTranslating, setIsTranslating] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestions = [
    { en: "Farming tips", hi: "खेती के सुझाव", bn: "চাষের টিপস", ta: "விவசாய குறிப்புகள்", te: "వ్యవసాయ చిట్కాలు", mr: "शेती टिप्स" },
    { en: "Weather update", hi: "मौसम का हाल", bn: "আবহাওয়ার খবর", ta: "வானிலை அப்டேட்", te: "వాతావరణ అప్‌డేట్", mr: "हवामान अपडेट" },
    { en: "Govt schemes", hi: "सरकारी योजनाएं", bn: "সরকারি প্রকল্প", ta: "அரசு திட்டங்கள்", te: "ప్రభుత్వ పథకాలు", mr: "सरकारी योजना" },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Sync voice input with UI
  useEffect(() => {
    if (isListening && voiceText) {
      if (showTranslator) {
        setTransText(voiceText)
      } else {
        setInputText(voiceText)
      }
    }
  }, [voiceText, isListening, showTranslator])

  // Trigger send only when user STOPS speaking (isListening: true -> false)
  const prevIsListening = useRef(false)
  useEffect(() => {
    if (prevIsListening.current === true && isListening === false && voiceText && !showTranslator) {
      handleSendMessage(voiceText)
    }
    prevIsListening.current = isListening
  }, [isListening, voiceText, showTranslator])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputText('')
    setIsTyping(true)

    try {
      const history = messages
        .filter(m => m.id !== '1')
        .slice(-6)
        .map(msg => ({
          role: msg.isBot ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }))

      const aiResponse = await generateAIResponse(text, history as any);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        isBot: true,
        timestamp: new Date(),
        lang: aiResponse.lang,
        mode: aiResponse.mode as any
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
      
      // Auto-speak if it's a short response
      if (botResponse.text.length < 150) {
        speak(botResponse.text, aiResponse.lang)
      }
    } catch (error) {
      setIsTyping(false)
      console.error("AI Error:", error)
    }
  }

  const handleTranslate = async () => {
    if (!transText.trim()) return
    setIsTranslating(true)
    const result = await translateText(transText, getLanguageName(sourceLang), getLanguageName(targetLang))
    setTransText(result)
    setIsTranslating(false)
    speak(result, targetLang)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(id)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const clearChat = () => {
    if (window.confirm("Clear all messages?")) {
      setMessages([{ id: '1', text: t('welcome_ai'), isBot: true, timestamp: new Date(), lang: language }])
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 overflow-hidden relative">
      {/* Header */}
      <header className="p-4 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between z-20 transition-colors border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 transition-all active:scale-95">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rural rounded-2xl flex items-center justify-center text-white shadow-lg relative overflow-hidden">
              <Bot size={24} />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-white/10"
              />
            </div>
            <div>
              <h1 className="font-bold text-lg dark:text-white leading-none">AI SATHI</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-amber-500 animate-pulse'}`} />
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isOnline ? 'text-green-500' : 'text-amber-500'}`}>
                  {isOnline ? 'Online AI Mode' : 'Offline Mode'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowTranslator(!showTranslator)}
            className={`p-2.5 rounded-xl transition-all ${showTranslator ? 'bg-rural text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <Languages size={20} />
          </button>
          <div className="relative group">
            <button className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">
              <MoreVertical size={20} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 hidden group-hover:block z-50">
              <button 
                onClick={clearChat}
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 font-medium"
              >
                <Trash2 size={16} /> Clear Chat
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className={`flex-1 overflow-y-auto p-4 space-y-6 transition-all duration-300 ${showTranslator ? 'brightness-50 pointer-events-none' : ''}`}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} items-end gap-3`}
            >
              {msg.isBot && (
                <div className="w-8 h-8 rounded-xl bg-rural text-white flex items-center justify-center shadow-md mb-6 shrink-0">
                  <Bot size={16} />
                </div>
              )}
              <div className={`group relative max-w-[85%] p-4 rounded-[1.8rem] shadow-sm ${
                msg.isBot 
                  ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700' 
                  : 'bg-rural text-white rounded-br-none shadow-lg shadow-rural/20'
              }`}>
                {msg.mode === 'offline' && (
                  <span className="absolute -top-6 left-0 text-[9px] font-black text-amber-500 uppercase flex items-center gap-1">
                    <WifiOff size={8} /> Local Response
                  </span>
                )}
                
                <div className="text-base leading-relaxed whitespace-pre-wrap font-medium">
                  {msg.text}
                </div>

                <div className={`mt-2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <span className="text-[9px] font-bold opacity-40">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(msg.text, msg.id)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {copiedId === msg.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                  </button>
                  <button 
                    onClick={() => speak(msg.text, msg.lang || 'en')}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Volume2 size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex justify-start items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-rural/10 text-rural flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl rounded-bl-none shadow-sm flex gap-1.5 border border-gray-100 dark:border-gray-700">
              <span className="w-2 h-2 bg-rural rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
              <span className="w-2 h-2 bg-rural rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-rural rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Suggestion Chips */}
      {!showTranslator && (
        <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 overflow-x-auto flex gap-3 no-scrollbar border-t border-gray-100 dark:border-gray-800">
          {suggestions.map((s, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSendMessage((s as any)[language] || s.en)}
              className="whitespace-nowrap px-5 py-2.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-rural text-sm font-bold shadow-sm hover:shadow-md hover:border-rural/30 transition-all flex items-center gap-2 shrink-0"
            >
              <Sparkles size={14} className="text-amber-500" />
              {(s as any)[language] || s.en}
            </motion.button>
          ))}
        </div>
      )}

      {/* Translator Overlay */}
      <AnimatePresence>
        {showTranslator && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 z-40 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.2)] border-t border-gray-100 dark:border-gray-700 p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <Languages className="text-rural" /> Smart Translator
              </h2>
              <button 
                onClick={() => setShowTranslator(false)}
                className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500"
              >
                <ArrowLeft className="rotate-[-90deg]" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <select 
                  value={sourceLang}
                  onChange={(e) => setTargetLang(e.target.value as any)}
                  className="flex-1 p-3 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none outline-none font-bold"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="bn">Bengali</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                  <option value="mr">Marathi</option>
                </select>
                <button 
                  onClick={() => {
                    const temp = sourceLang;
                    setSourceLang(targetLang as any);
                    setTargetLang(temp as any);
                  }}
                  className="p-3 bg-rural-light text-rural rounded-full"
                >
                  <RefreshCw size={20} />
                </button>
                <select 
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value as any)}
                  className="flex-1 p-3 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none outline-none font-bold"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="bn">Bengali</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                  <option value="mr">Marathi</option>
                </select>
              </div>

              <div className="relative">
                <textarea
                  value={transText}
                  onChange={(e) => setTransText(e.target.value)}
                  placeholder="Type or use voice to translate..."
                  className="w-full h-32 p-5 rounded-3xl bg-gray-50 dark:bg-gray-700 dark:text-white border-none outline-none resize-none font-medium text-lg"
                />
                <button 
                  onClick={() => listen(sourceLang)}
                  className={`absolute right-4 bottom-4 p-3 rounded-2xl ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-white dark:bg-gray-600 text-rural shadow-md'}`}
                >
                  <Mic size={20} />
                </button>
              </div>

              <button
                onClick={handleTranslate}
                disabled={isTranslating || !transText.trim()}
                className="w-full py-5 bg-rural text-white rounded-3xl font-black text-xl shadow-xl shadow-rural/30 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isTranslating ? <Loader2 className="animate-spin" /> : <Languages />}
                Translate & Speak
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 z-30 transition-colors">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder={t('ask_anything')}
              className="w-full p-4 pr-14 bg-gray-50 dark:bg-gray-700 dark:text-white border-none rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-rural text-lg shadow-inner font-medium"
            />
            <button 
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim()}
              className={`absolute right-2 top-2 p-2.5 rounded-full transition-all ${inputText.trim() ? 'bg-rural text-white shadow-lg scale-100' : 'bg-gray-200 text-gray-400 scale-90 cursor-not-allowed'}`}
            >
              <Send size={20} />
            </button>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => listen(language)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all shrink-0 ${
              isListening ? 'bg-red-500 animate-pulse ring-4 ring-red-100' : 'bg-rural shadow-rural/30'
            } text-white`}
          >
            {isListening ? <Loader2 className="animate-spin" size={28} /> : <Mic size={28} />}
          </motion.button>
        </div>
        <p className="text-center text-[10px] font-bold text-gray-400 mt-3 uppercase tracking-widest opacity-60">
          {isListening ? t('listening') : t('tap_mic')}
        </p>
      </footer>
    </div>
  )
}

export default AIChat
