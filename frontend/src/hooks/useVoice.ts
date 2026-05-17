import { useState, useCallback, useEffect } from 'react'

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false)
  const [text, setText] = useState('')

  // Pre-load voices for better availability
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices()
    }
    loadVoices()
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  const speak = useCallback((message: string, lang: string = 'en-US') => {
    // Cancel any ongoing speech first
    window.speechSynthesis.cancel()

    const speech = new SpeechSynthesisUtterance(message)
    
    // Map internal codes to primary BCP 47 locales and fallbacks
    const localeMap: Record<string, string[]> = {
      'en': ['en-US', 'en-GB', 'en-IN'],
      'hi': ['hi-IN', 'hi'],
      'bn': ['bn-IN', 'bn-BD', 'bn'],
      'ta': ['ta-IN', 'ta-LK', 'ta'],
      'te': ['te-IN', 'te'],
      'mr': ['mr-IN', 'mr']
    }
    
    const targets = localeMap[lang] || [lang]
    speech.lang = targets[0]
    
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      // Try to find the best matching voice across all fallback targets
      let selectedVoice = null
      for (const target of targets) {
        selectedVoice = voices.find(v => v.lang === target) || 
                        voices.find(v => v.lang.replace('_', '-').toLowerCase() === target.toLowerCase())
        if (selectedVoice) break
      }

      // If still no exact match, try broad language match
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith(lang + '-')) ||
                        voices.find(v => v.lang.startsWith(lang))
      }
      
      if (selectedVoice) {
        speech.voice = selectedVoice
        speech.lang = selectedVoice.lang // Sync with found voice
      }
    }

    speech.rate = 0.8
    speech.pitch = 1
    speech.volume = 1

    // Small delay to ensure synthesis is ready
    setTimeout(() => {
      window.speechSynthesis.speak(speech)
    }, 50)
  }, [])

  const listen = useCallback((lang: string = 'en') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.")
      return
    }

    // Map to highly specific Indian Locales for maximum accuracy
    const recognitionLocaleMap: Record<string, string> = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'mr': 'mr-IN'
    }

    const recognition = new SpeechRecognition()
    recognition.lang = recognitionLocaleMap[lang] || lang
    recognition.interimResults = true
    recognition.continuous = false
    recognition.maxAlternatives = 3

    recognition.onstart = () => {
      setIsListening(true)
      setText('') // Clear previous text
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error)
      setIsListening(false)
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        } else {
          interimTranscript += event.results[i][0].transcript
        }
      }

      // Provide immediate feedback to the UI
      const currentText = finalTranscript || interimTranscript
      if (currentText) {
        setText(currentText)
      }
    }

    recognition.start()
  }, [])

  return { isListening, text, speak, listen }
}
