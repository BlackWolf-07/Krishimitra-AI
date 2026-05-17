export type Intent = 'farming' | 'weather' | 'emergency' | 'medicine' | 'govt_scheme' | 'greeting' | 'casual';

const keywordMap: Record<Intent, string[]> = {
  farming: [
    // English
    'crop', 'fertilizer', 'soil', 'seed', 'pest', 'fungus', 'harvest', 'farming', 'irrigation', 'water', 'plant', 'growth', 'yield', 'insect', 'organic', 'compost', 'urea', 'pesticide', 'neem', 'drainage', 'rotation', 'rabi', 'kharif',
    // Hindi
    'खेती', 'फसल', 'खाद', 'मिट्टी', 'बीज', 'कीट', 'फफूंद', 'कटाई', 'सिंचाई', 'पानी', 'पौधा', 'विकास', 'उपज', 'कीड़ा', 'जैविक', 'यूरिया', 'कीटनाशक', 'नीम', 'जल निकासी', 'रबी', 'खरीफ',
    // Bengali
    'চাষ', 'ফসল', 'সার', 'মাটি', 'বীজ', 'পোকা', 'ছত্রাক', 'কাটা', 'সেচ', 'জল', 'চারা', 'বৃদ্ধি', 'ফলন', 'কীটপতঙ্গ', 'জৈব', 'ইউরিয়া', 'কীটনাশক', 'নিম', 'নিষ্কাশন', 'রবি', 'খরিফ',
    // Tamil
    'விவசாயம்', 'பயிர்', 'உரம்', 'மண்', 'விதை', 'பூச்சி', 'காளான்', 'அறுவடை', 'பாசனம்', 'தண்ணீர்', 'செடி', 'வளர்ச்சி', 'மகசூல்', 'பூச்சிக்கொல்லி', 'வேம்பு', 'கால்வாய்',
    // Telugu
    'వ్యవసాయం', 'పంట', 'ఎరువు', 'నేల', 'విత్తనం', 'పురుగు', 'శిలీంధ్రం', 'కోత', 'సాగు', 'నీరు', 'మొక్క', 'పెరుగుదల', 'దిగుబడి', 'సేంద్రీయ', 'వేప',
    // Marathi
    'शेती', 'पीक', 'खत', 'माती', 'बी', 'कीड', 'बुरशी', 'काढणी', 'सिंचन', 'पाणी', 'रोप', 'वाढ', 'उत्पन्न', 'कीटकनाशक', 'कडुलिंब'
  ],
  weather: [
    // English
    'rain', 'sun', 'temp', 'weather', 'storm', 'monsoon', 'forecast', 'wind', 'humidity', 'cloud', 'heat', 'cold', 'winter', 'summer', 'flood', 'cyclone',
    // Hindi
    'बारिश', 'मौसम', 'धूप', 'तापमान', 'तूफान', 'मानसून', 'पूर्वानुमान', 'हवा', 'नमी', 'बादल', 'गर्मी', 'सर्दी', 'बाढ़', 'चक्रवात',
    // Bengali
    'বৃষ্টি', 'আবহাওয়া', 'রোদ', 'তাপমাত্রা', 'ঝড়', 'বর্ষা', 'বাতাস', 'আর্দ্রতা', 'মেঘ', 'গরম', 'শীত', 'বন্যা', 'ঘূর্ণিঝড়',
    // Tamil
    'மழை', 'வானிலை', 'வெயில்', 'வெப்பநிலை', 'புயல்', 'பருவமழை', 'காற்று', 'ஈரப்பதம்', 'மேகம்', 'வெள்ளம்',
    // Telugu
    'వర్షం', 'వాతావరణం', 'ఎండ', 'ఉష్ణోగ్రత', 'తుపాను', 'రుతుపవనం', 'గాలి', 'తేమ', 'మబ్బు', 'వరద',
    // Marathi
    'पाऊस', 'हवामान', 'ऊन', 'तापमान', 'वादळ', 'मान्सून', 'वारा', 'ढग', 'पूर'
  ],
  emergency: [
    // English
    'help', 'sos', 'accident', 'danger', 'police', 'ambulance', 'hospital', 'urgent', 'snake', 'bite', 'injury', 'blood', 'fire', 'burn',
    // Hindi
    'बचाओ', 'खतरा', 'पुलिस', 'एम्बुलेंस', 'अस्पताल', 'जरूरी', 'सांप', 'काटना', 'चोट', 'खून', 'आग', 'जलना',
    // Bengali
    'বাঁচাও', 'বিপদ', 'পুলিশ', 'অ্যাম্বুলেন্স', 'হাসপাতাল', 'জরুরি', 'সাপ', 'কামড়', 'আঘাত', 'রক্ত', 'আগুন',
    // Tamil
    'உதவி', 'ஆபத்து', 'காவல்துறை', 'மருத்துவ ஊர்தி', 'மருத்துவமனை', 'அவசரம்', 'பாம்பு', 'காயம்', 'இரத்தம்', 'தீ',
    // Telugu
    'సహాయం', 'ప్రమాదం', 'పోలీసు', 'అంబులెన్స్', 'ఆసుపత్రి', 'అత్యవసరం', 'పాము', 'గాయం', 'రక్తం', 'మంటలు',
    // Marathi
    'मदत', 'धोका', 'पोलीस', 'रुग्णवाहिका', 'रुग्णालय', 'साप', 'जखम', 'रक्त', 'आग'
  ],
  medicine: [
    // English
    'doctor', 'pills', 'tablet', 'cough', 'fever', 'medicine', 'sick', 'health', 'pain', 'vomit', 'cold', 'infection', 'ors',
    // Hindi
    'डॉक्टर', 'दवा', 'बीमार', 'बुखार', 'गोली', 'स्वास्थ्य', 'दर्द', 'उल्टी', 'जुकाम', 'संक्रमण',
    // Bengali
    'ডাক্তার', 'ওষুধ', 'অসুখ', 'জ্বর', 'বড়ি', 'স্বাস্থ্য', 'ব্যথা', 'বমি', 'সর্দি', 'সংক্রমণ',
    // Tamil
    'மருத்துவர்', 'மருந்து', 'காய்ச்சல்', 'மாத்திரை', 'உடல்நலம்', 'வலி', 'வாந்தி',
    // Telugu
    'డాక్టర్', 'మందు', 'జ్వరం', 'మాత్ర', 'ఆరోగ్యం', 'నొప్పి', 'వాంతులు',
    // Marathi
    'डॉक्टर', 'औषध', 'आजारी', 'ताप', 'गोळी', 'आरोग्य', 'वेदना'
  ],
  govt_scheme: [
    // English
    'paisa', 'money', 'subsidy', 'scheme', 'yojana', 'kisan nidhi', 'insurance', 'loan', 'credit card', 'kcc', 'pension', 'fund',
    // Hindi
    'योजना', 'सब्सिडी', 'पैसा', 'रुपया', 'बीमा', 'कर्ज', 'पेंशन', 'निधि', 'किस्त',
    // Bengali
    'প্রকল্প', 'টাকা', 'স্কিম', 'বিমা', 'ঋণ', 'পেনশন', 'তহবিল', 'কিস্তি',
    // Tamil
    'திட்டம்', 'நிதி', 'பணம்', 'மானியம்', 'காப்பீடு', 'கடன்', 'ஓய்வூதியம்',
    // Telugu
    'పథకం', 'నిధి', 'డబ్బు', 'సబ్సిడీ', 'భీమా', 'రుణం', 'పెన్షన్',
    // Marathi
    'योजना', 'पैसे', 'अनुदान', 'विमा', 'कर्ज', 'पेन्शन'
  ],
  greeting: [
    'hello', 'hi', 'namaste', 'morning', 'night', 'नमस्ते', 'प्रणाम', 'হ্যালো', 'নমস্কার', 'வணக்கம்', 'నమస్కారం', 'नमस्कार'
  ],
  casual: [
    'how are you', 'what can you do', 'who are you', 'क्या हाल है', 'कैसे हो', 'কেমন আছো', 'எப்படி இருக்கிறாய்', 'ఎలా ఉన్నావు', 'कसे आहात'
  ]
};

export const classifyIntent = (text: string): Intent => {
  const lowerText = text.toLowerCase();

  // Scoring system for better accuracy
  const scores: Record<Intent, number> = {
    farming: 0,
    weather: 0,
    emergency: 0,
    medicine: 0,
    govt_scheme: 0,
    greeting: 0,
    casual: 0
  };

  for (const [intent, keywords] of Object.entries(keywordMap)) {
    keywords.forEach(kw => {
      if (lowerText.includes(kw)) {
        scores[intent as Intent] += 1;
      }
    });
  }

  // Find intent with highest score
  let bestIntent: Intent = 'casual';
  let maxScore = 0;

  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestIntent = intent as Intent;
    }
  }

  // Specific checks for greetings if score is 0
  if (maxScore === 0) {
    if (lowerText.length < 10) return 'greeting';
    return 'casual';
  }

  return bestIntent;
};

