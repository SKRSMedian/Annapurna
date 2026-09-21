import { Language } from '../types';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  script: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    script: 'Latin',
    region: 'All India (Default)'
  },
  {
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    script: 'Devanagari',
    region: 'उत्तर व मध्य भारत'
  },
  {
    code: 'pa',
    label: 'Punjabi',
    nativeLabel: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    region: 'ਪੰਜਾਬ / Punjab'
  },
  {
    code: 'mr',
    label: 'Marathi',
    nativeLabel: 'मराठी',
    script: 'Devanagari',
    region: 'महाराष्ट्र / Maharashtra'
  },
  {
    code: 'te',
    label: 'Telugu',
    nativeLabel: 'తెలుగు',
    script: 'Telugu',
    region: 'ఆంధ్రప్రదేశ్ & తెలంగాణ'
  }
];

export const TRANSLATIONS = {
  // App Titles
  appName: {
    en: 'Annapurna',
    hi: 'अन्नपूर्णा',
    pa: 'ਅੰਨਪੂਰਨਾ',
    mr: 'अन्नपूर्णा',
    te: 'అన్నపూర్ణ'
  },
  appTagline: {
    en: 'Direct Farm-to-Table',
    hi: 'सीधा खेत से थाली तक',
    pa: 'ਸਿੱਧਾ ਖੇਤ ਤੋਂ ਰਸੋਈ ਤੱਕ',
    mr: 'थेट शेतातून पानापर्यंत',
    te: 'రైతు పొలం నుండి నేరుగా ఇంటికి'
  },
  appSubheading: {
    en: 'Eliminating middlemen. Fair profits for farmers, fresh organic produce for consumers with 100% price transparency.',
    hi: 'बिचौलियों का अंत। किसानों को पूरा मूल्य और उपभोक्ताओं को शुद्ध ताज़ा फसल पारदर्शी दरों पर।',
    pa: 'ਵਿਚੋਲਿਆਂ ਦਾ ਅੰਤ। ਕਿਸਾਨਾਂ ਨੂੰ ਸਹੀ ਮੁਨਾਫਾ ਅਤੇ ਗਾਹਕਾਂ ਨੂੰ ਤਾਜ਼ੀ ਕੁਦਰਤੀ ਫਸਲ ਪੂਰੀ ਪਾਰਦਰਸ਼ਤਾ ਨਾਲ।',
    mr: 'दलालांना हद्दपार. शेतकऱ्याला रास्त भाव आणि ग्राहकाला शेतातील ताजा माल संपूर्ण पारदर्शकतेने.',
    te: 'దళారులకు చరమగీతం. రైతులకు న్యాయమైన ధర, వినియోగదారులకు తాజా వ్యవసాయ ఉత్పత్తులు.'
  },

  // Tabs
  tabMarket: {
    en: 'Market',
    hi: 'मार्केट',
    pa: 'ਮੰਡੀ',
    mr: 'बाजारपेठ',
    te: 'మార్కెట్'
  },
  tabFarmerHub: {
    en: 'Farmer Hub',
    hi: 'किसान हब',
    pa: 'ਕਿਸਾਨ ਹੱਬ',
    mr: 'शेतकरी केंद्र',
    te: 'రైతు హబ్'
  },
  tabTrack: {
    en: 'Track & Trace',
    hi: 'ट्रेस व ट्रैकिंग',
    pa: 'ਟਰੈਕ ਤੇ ਟਰੇਸ',
    mr: 'थेट मागोवा',
    te: 'ట్రాక్ & ట్రేస్'
  },
  tabOrders: {
    en: 'My Orders',
    hi: 'मेरे ऑर्डर',
    pa: 'ਮੇਰੇ ਆਰਡਰ',
    mr: 'माझे ऑर्डर्स',
    te: 'నా ఆర్డర్లు'
  },
  tabDispatchedOrders: {
    en: 'Orders Dispatched',
    hi: 'डिस्पैच ऑर्डर',
    pa: 'ਭੇਜੇ ਆਰਡਰ',
    mr: 'पाठवलेले ऑर्डर्स',
    te: 'డిస్పాచ్ అయిన ఆర్డర్లు'
  },
  tabProfiles: {
    en: 'Farmer Profiles',
    hi: 'किसान प्रोफाइल',
    pa: 'ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ',
    mr: 'शेतकरी माहिती',
    te: 'రైతు ప్రొఫైల్'
  },
  tabConsumerProfile: {
    en: 'My Profile',
    hi: 'मेरी प्रोफाइल',
    pa: 'ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ',
    mr: 'माझे प्रोफाइल',
    te: 'నా ప్రొఫైల్'
  },
  tabCart: {
    en: 'Basket',
    hi: 'टोकरी',
    pa: 'ਟੋਕਰੀ',
    mr: 'टोपली',
    te: 'బుట్ట'
  },
  tabKisaanHub: {
    en: 'Kisaan Hub',
    hi: 'किसान हब',
    pa: 'ਕਿਸਾਨ ਹੱਬ',
    mr: 'शेतकरी केंद्र',
    te: 'రైతు హబ్'
  },
  tabMandiRates: {
    en: 'Mandi Rates',
    hi: 'मंडी भाव',
    pa: 'ਮੰਡੀ ਭਾਅ',
    mr: 'बाजार भाव',
    te: 'మార్కెట్ ధరలు'
  },

  // Header & Roles
  imFarmer: {
    en: 'I am a Farmer',
    hi: 'मैं किसान हूँ',
    pa: 'ਮੈਂ ਕਿਸਾਨ ਹਾਂ',
    mr: 'मी शेतकरी आहे',
    te: 'నేను రైతును'
  },
  imConsumer: {
    en: 'I am a Consumer',
    hi: 'मैं उपभोक्ता हूँ',
    pa: 'ਮੈਂ ਖਪਤਕਾਰ ਹਾਂ',
    mr: 'मी ग्राहक आहे',
    te: 'నేను వినియోగదారుడిని'
  },
  producerBadge: {
    en: 'Sell Produce Direct',
    hi: 'सीधी बिक्री करें',
    pa: 'ਸਿੱਧੀ ਫਸਲ ਵੇਚੋ',
    mr: 'थेट विक्री करा',
    te: 'నేరుగా పంట అమ్మండి'
  },
  consumerBadge: {
    en: 'Buy Farm Fresh',
    hi: 'ताज़ा फसल खरीदें',
    pa: 'ਤਾਜ਼ੀ ਫਸਲ ਖਰੀਦੋ',
    mr: 'ताजा माल खरेदी करा',
    te: 'తాజా పంట కొనండి'
  },

  // Onboarding & Auth
  welcomeTitle: {
    en: 'Welcome to Annapurna Direct',
    hi: 'अन्नपूर्णा डायरेक्ट में स्वागत है',
    pa: 'ਅੰਨਪੂਰਨਾ ਡਾਇਰੈਕਟ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ',
    mr: 'अन्नपूर्णा डायरेक्ट मध्ये आपले स्वागत आहे',
    te: 'అన్నపూర్ణ డైరెక్ట్‌కు స్వాగతం'
  },
  selectLanguageTitle: {
    en: 'Select Regional Language',
    hi: 'अपनी क्षेत्रीय भाषा चुनें',
    pa: 'ਆਪਣੀ ਖੇਤਰੀ ਬੋਲੀ ਚੁਣੋ',
    mr: 'तुमची प्रादेशिक भाषा निवडा',
    te: 'మీ ప్రాంతీయ భాషను ఎంచుకోండి'
  },
  continueToAuth: {
    en: 'Continue to Verification',
    hi: 'सत्यापन के लिए आगे बढ़ें',
    pa: 'ਤਸਦੀਕ ਲਈ ਅੱਗੇ ਵਧੋ',
    mr: 'पडताळणीसाठी पुढे जा',
    te: 'ధృవీకరణకు కొనసాగండి'
  },
  loginMobileTitle: {
    en: 'Mobile Login & Verification',
    hi: 'मोबाइल लॉगिन व सत्यापन',
    pa: 'ਮੋਬਾਈਲ ਲਾਗਇਨ ਅਤੇ ਤਸਦੀਕ',
    mr: 'मोबाईल लॉगिन आणि पडताळणी',
    te: 'మొబైల్ లాగిన్ & ధృవీకరణ'
  },
  enterMobileNumber: {
    en: 'Enter 10-digit Mobile Number',
    hi: '10 अंकों का मोबाइल नंबर दर्ज करें',
    pa: '10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਭਰੋ',
    mr: '10 अंकी मोबाईल क्रमांक टाका',
    te: '10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి'
  },
  sendOtp: {
    en: 'Send OTP',
    hi: 'ओटीपी भेजें',
    pa: 'ਓ.ਟੀ.ਪੀ. ਭੇਜੋ',
    mr: 'ओटीपी पाठवा',
    te: 'ఓటీపీ పంపండి'
  },
  enterOtp: {
    en: 'Enter 4-Digit Verification Code',
    hi: '4 अंकों का ओटीपी कोड दर्ज करें',
    pa: '4 ਅੰਕਾਂ ਦਾ ਕੋਡ ਭਰੋ',
    mr: '4 अंकी पडताळणी कोड टाका',
    te: '4 అంకెల ధృవీకరణ కోడ్ నమోదు చేయండి'
  },
  verifyAndContinue: {
    en: 'Verify & Continue',
    hi: 'सत्यापित करें और आगे बढ़ें',
    pa: 'ਤਸਦੀਕ ਕਰੋ ਤੇ ਅੱਗੇ ਵਧੋ',
    mr: 'पडताळणी करा आणि पुढे जा',
    te: 'ధృవీకరించి కొనసాగండి'
  },
  resendCode: {
    en: 'Resend Code',
    hi: 'दोबारा कोड भेजें',
    pa: 'ਦੁਬਾਰਾ ਕੋਡ ਭੇਜੋ',
    mr: 'पुन्हा कोड पाठवा',
    te: 'కోడ్ మళ్లీ పంపండి'
  },
  demoFarmerLogin: {
    en: 'Quick Demo: Login as Sardar Gurpreet',
    hi: 'त्वरित डेमो: किसान गुरप्रीत लॉगिन',
    pa: 'ਸਿੱਧਾ ਲਾਗਇਨ: ਸਰਦਾਰ ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ',
    mr: 'जलद डेमो: शेतकरी गुरप्रीत लॉगिन',
    te: 'డెమో లాగిన్: రైతు గుర్ ప్రీత్ సింగ్'
  },
  demoConsumerLogin: {
    en: 'Quick Demo: Login as Priya Sharma (Consumer)',
    hi: 'त्वरित डेमो: उपभोक्ता प्रिया शर्मा लॉगिन',
    pa: 'ਸਿੱਧਾ ਲਾਗਇਨ: ਪ੍ਰਿਆ ਸ਼ਰਮਾ (ਖਪਤਕਾਰ)',
    mr: 'जलद डेमो: ग्राहक प्रिया शर्मा लॉगिन',
    te: 'డెమో లాగిన్: ప్రియా శర్మ (వినియోగదారు)'
  },
  farmerDetailsTitle: {
    en: 'Farmer & Location Profile',
    hi: 'किसान व क्षेत्र विवरण',
    pa: 'ਕਿਸਾਨ ਅਤੇ ਖੇਤਰੀ ਵੇਰਵਾ',
    mr: 'शेतकरी आणि परिसर तपशील',
    te: 'రైతు & ప్రాంత వివరాలు'
  },
  fullName: {
    en: 'Full Name',
    hi: 'पूरा नाम',
    pa: 'ਪੂਰਾ ਨਾਮ',
    mr: 'पूर्ण नाव',
    te: 'పూర్తి పేరు'
  },
  selectState: {
    en: 'Select State',
    hi: 'राज्य चुनें',
    pa: 'ਸੂਬਾ ਚੁਣੋ',
    mr: 'राज्य निवडा',
    te: 'రాష్ట్రాన్ని ఎంచుకోండి'
  },
  selectDistrict: {
    en: 'Select District / Mandi Hub',
    hi: 'जिला / कृषि हब चुनें',
    pa: 'ਜ਼ਿਲ੍ਹਾ / ਖੇਤੀ ਹੱਬ ਚੁਣੋ',
    mr: 'जिल्हा / कृषी केंद्र निवडा',
    te: 'జిల్లా / మార్కెట్ హబ్ ఎంచుకోండి'
  },
  farmNameOptional: {
    en: 'Farm / Land Name (Optional)',
    hi: 'खेत का नाम (वैकल्पिक)',
    pa: 'ਖੇਤ ਦਾ ਨਾਮ (ਵਿਕਲਪਿਕ)',
    mr: 'शेताचे नाव (पर्यायी)',
    te: 'వ్యవసాయ క్షేత్రం పేరు (ఐచ్ఛికం)'
  },
  saveAndEnter: {
    en: 'Save & Enter Annapurna',
    hi: 'सुरक्षित करें और प्रवेश करें',
    pa: 'ਸੰਭਾਲੋ ਅਤੇ ਦਾਖਲ ਹੋਵੋ',
    mr: 'जतन करा आणि सुरू करा',
    te: 'సేవ్ చేసి కొనసాగండి'
  },

  // Smart Recommendations & Insights
  smartRecommendations: {
    en: 'Smart Recommendations & Insights',
    hi: 'स्मार्ट सिफारिशें व क्षेत्रीय इनसाइट्स',
    pa: 'ਸਮਾਰਟ ਸਿਫ਼ਾਰਸ਼ਾਂ ਅਤੇ ਖੇਤਰੀ ਜਾਣਕਾਰੀ',
    mr: 'स्मार्ट शिफारशी आणि प्रादेशिक अंदाज',
    te: 'స్మార్ట్ సిఫార్సులు & ప్రాంతీయ విశ్లేషణలు'
  },
  smartInsightsSubtitle: {
    en: 'Hyper-local weather forecasts, cooperative EV logistics, and high-demand urban crop pricing.',
    hi: 'स्थानीय मौसम चेतावनियां, सहकारी शीत-वाहन व्यवस्था, और शहरों में उच्च मांग वाली फसलों के भाव।',
    pa: 'ਸਥਾਨਕ ਮੌਸਮ ਚੇਤਾਵਨੀਆਂ, ਠੰਢੀਆਂ ਗੱਡੀਆਂ ਦੀ ਸਹੂਲਤ, ਅਤੇ ਵੱਧ ਮੰਗ ਵਾਲੀਆਂ ਫਸਲਾਂ ਦੇ ਭਾਅ।',
    mr: 'स्थानिक हवामान अंदाज, सहकारी शीत वाहतूक आणि शहरांतील वाढत्या मागणीनुसार पिकांचे भाव.',
    te: 'స్థానిక వాతావరణ హెచ్చరికలు, శీతల రవాణా సదుపాయాలు మరియు నగరాల్లో అధిక డిమాండ్ ఉన్న పంటల ధరలు.'
  },
  weatherCropForecast: {
    en: 'Weather & Crop Forecast',
    hi: 'मौसम व फसल पूर्वानुमान',
    pa: 'ਮੌਸਮ ਅਤੇ ਫਸਲ ਪੂਰਵ-ਅਨੁਮਾਨ',
    mr: 'हवामान आणि पीक सल्ला',
    te: 'వాతావరణం & పంట సూచనలు'
  },
  logisticsSupport: {
    en: 'Logistics & Transport Support',
    hi: 'परिवहन व कोल्ड-स्टोरेज सहायता',
    pa: 'ਟਰਾਂਸਪੋਰਟ ਅਤੇ ਕੋਲਡ ਸਟੋਰੇਜ ਸਹੂਲਤ',
    mr: 'वाहतूक आणि शीतगृह साहाय्य',
    te: 'రవాణా & కోల్డ్ స్టోరేజ్ సహాయం'
  },
  trendingProduce: {
    en: 'Trending & High-Demand Produce',
    hi: 'उच्च मांग वाली फसलें व मंडी भाव',
    pa: 'ਵੱਧ ਮੰਗ ਵਾਲੀਆਂ ਫਸਲਾਂ ਅਤੇ ਭਾਅ',
    mr: 'वाढती मागणी असणारी पिके',
    te: 'అధిక డిమాండ్ ఉన్న పంటలు & ధరలు'
  },
  optimalWindow: {
    en: 'Optimal Window',
    hi: 'सर्वोत्तम समय सीमा',
    pa: 'ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਸਮਾਂ',
    mr: 'उत्कृष्ट वेळ',
    te: 'అనుకూల సమయం'
  },
  rainfallChance: {
    en: 'Rainfall Chance',
    hi: 'बारिश की संभावना',
    pa: 'ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ',
    mr: 'पावसाची शक्यता',
    te: 'వర్షపాతం అవకాశం'
  },
  humidity: {
    en: 'Humidity',
    hi: 'नमी (आर्द्रता)',
    pa: 'ਨਮੀ',
    mr: 'हवेतील दमटपणा',
    te: 'తేమ'
  },
  windSpeed: {
    en: 'Wind Speed',
    hi: 'हवा की गति',
    pa: 'ਹਵਾ ਦੀ ਗਤੀ',
    mr: 'वाऱ्याचा वेग',
    te: 'గాలి వేగం'
  },
  verifiedEVFleet: {
    en: 'Verified EV Cold Fleet',
    hi: 'प्रमाणित इलेक्ट्रिक कोल्ड-वैन',
    pa: 'ਪ੍ਰਮਾਣਿਤ ਇਲੈਕਟ੍ਰਿਕ ਕੋਲਡ ਵੈਨ',
    mr: 'प्रमाणित इलेक्ट्रिक शीत वाहन',
    te: 'ధృవీకరించబడిన EV కోల్డ్ వ్యాన్'
  },
  bookTransit: {
    en: 'Book Transit Slot',
    hi: 'वाहन स्लॉट बुक करें',
    pa: 'ਗੱਡੀ ਸਲਾਟ ਬੁੱਕ ਕਰੋ',
    mr: 'वाहतूक स्लॉट बुक करा',
    te: 'రవాణా స్లాట్ బుక్ చేయండి'
  },
  reserveStorage: {
    en: 'Reserve Cold Space',
    hi: 'कोल्ड स्टोरेज बुक करें',
    pa: 'ਕੋਲਡ ਸਟੋਰੇਜ ਬੁੱਕ ਕਰੋ',
    mr: 'शीतगृहात जागा राखून ठेवा',
    te: 'కోల్డ్ స్పేస్ రిజర్వ్ చేయండి'
  },
  listThisCrop: {
    en: '+ List This Crop',
    hi: '+ इस फसल को लिस्ट करें',
    pa: '+ ਇਹ ਫਸਲ ਸ਼ਾਮਲ ਕਰੋ',
    mr: '+ हे पीक नोंदवा',
    te: '+ ఈ పంటను జోడించండి'
  },
  urbanDemandSurge: {
    en: 'Urban Demand Surge',
    hi: 'शहरी मांग में वृद्धि',
    pa: 'ਸ਼ਹਿਰੀ ਮੰਗ ਵਿੱਚ ਵਾਧਾ',
    mr: 'शहरी मागणीत वाढ',
    te: 'నగరాల్లో డిమాండ్ పెరుగుదల'
  },
  annapurnaRate: {
    en: 'Annapurna Direct Rate',
    hi: 'अन्नपूर्णा सीधा भाव',
    pa: 'ਅੰਨਪੂਰਨਾ ਸਿੱਧਾ ਭਾਅ',
    mr: 'अन्नपूर्णा थेट दर',
    te: 'అన్నపూర్ణ నేరు ధర'
  },
  mandiRate: {
    en: 'APMC Mandi Rate',
    hi: 'मंडी आढ़तिया दर',
    pa: 'ਮੰਡੀ ਦਾ ਰੇਟ',
    mr: 'एपीएमसी बाजारभाव',
    te: 'ఏపీఎంసీ మార్కెట్ ధర'
  },
  farmerNetGain: {
    en: 'Extra Farmer Gain',
    hi: 'किसान का अतिरिक्त मुनाफा',
    pa: 'ਕਿਸਾਨ ਦਾ ਵਾਧੂ ਲਾਭ',
    mr: 'शेतकऱ्याचा अतिरिक्त नफा',
    te: 'రైతు అదనపు లాభం'
  },

  // Farmer Dashboard Actions
  listProduceBtn: {
    en: '+ List New Produce',
    hi: '+ नई फसल जोड़ें',
    pa: '+ ਨਵੀਂ ਫਸਲ ਸ਼ਾਮਲ ਕਰੋ',
    mr: '+ नवीन पीक जोडा',
    te: '+ కొత్త పంటను నమోదు చేయండి'
  },
  directRevenueTitle: {
    en: 'Direct Selling Revenue',
    hi: 'सीधी आय (100% किसान को)',
    pa: 'ਸਿੱਧੀ ਕਮਾਈ (100% ਕਿਸਾਨ ਨੂੰ)',
    mr: 'थेट उत्पन्न (100% शेतकऱ्याला)',
    te: 'నేరుగా వచ్చిన ఆదాయం'
  },
  middlemanSaved: {
    en: 'Middleman Commission Saved',
    hi: 'बिचौलिया कमीशन बचाया',
    pa: 'ਵਿਚੋਲਿਆਂ ਦਾ ਕਮਿਸ਼ਨ ਬਚਾਇਆ',
    mr: 'दलालीचे वाचलेले पैसे',
    te: 'దళారీ కమీషన్ ఆదా'
  },
  nextBankTransfer: {
    en: 'Next Direct Bank Transfer',
    hi: 'अगला बैंक ट्रांसफर',
    pa: 'ਅਗਲਾ ਬੈਂਕ ਟਰਾਂਸਫਰ',
    mr: 'पुढील थेट बँक जमा',
    te: 'తదుపరి బ్యాంక్ బదిలీ'
  },
  activeBatches: {
    en: 'Active Harvest Batches',
    hi: 'सक्रिय फसल बैच',
    pa: 'ਚੱਲ ਰਹੇ ਫਸਲ ਬੈਚ',
    mr: 'उपलब्ध पीक साठा',
    te: 'యాక్టివ్ పంట బ్యాచ్‌లు'
  },
  directOrders: {
    en: 'Direct Buyer Orders',
    hi: 'सीधे ग्राहक ऑर्डर',
    pa: 'ਸਿੱਧੇ ਗਾਹਕ ਆਰਡਰ',
    mr: 'थेट ग्राहक ऑर्डर्स',
    te: 'నేరుగా వచ్చిన ఆర్డర్లు'
  },
  acceptOrder: {
    en: 'Accept Order',
    hi: 'ऑर्डर स्वीकार करें',
    pa: 'ਆਰਡਰ ਮਨਜ਼ੂਰ ਕਰੋ',
    mr: 'ऑर्डर स्वीकारा',
    te: 'ఆర్డర్ అంగీకరించండి'
  },
  reschedule: {
    en: 'Reschedule Slot',
    hi: 'समय बदलें',
    pa: 'ਸਮਾਂ ਬਦਲੋ',
    mr: 'वेळ बदला',
    te: 'సమయాన్ని మార్చండి'
  },

  // Marketplace
  searchPlaceholder: {
    en: 'Search organic Roma tomatoes, Sharbati wheat, garlic...',
    hi: 'खोजें: ऑर्गेनिक टमाटर, शरबती गेहूं, प्याज, सरसों तेल...',
    pa: 'ਖੋਜੋ: ਦੇਸੀ ਟਮਾਟਰ, ਸ਼ਰਬਤੀ ਕਣਕ, ਪਿਆਜ਼, ਸਰ੍ਹੋਂ ਦਾ ਤੇਲ...',
    mr: 'शोधा: सेंद्रिय टोमॅटो, शरबती गहू, कांदा, मोहरीचे तेल...',
    te: 'వెతకండి: ఆర్గానిక్ టమాటాలు, గోధుమలు, ఉల్లిపాయలు...'
  },
  dawnPicked: {
    en: 'Dawn Picked Lot',
    hi: 'सुबह की ताज़ा तुड़ाई',
    pa: 'ਸਵੇਰੇ ਤੋੜੀ ਫਸਲ',
    mr: 'पहाटेची ताजी तोडणी',
    te: 'ఉదయం కోసిన తాజా పంట'
  },
  addToBasket: {
    en: 'Add to Basket',
    hi: 'टोकरी में जोड़ें',
    pa: 'ਟੋਕਰੀ ਚ ਪਾਓ',
    mr: 'टोपलीत जोडा',
    te: 'బుట్టలో చేర్చండి'
  },
  directBuy: {
    en: 'Direct Buy',
    hi: 'सीधा खरीदें',
    pa: 'ਸਿੱਧਾ ਖਰੀਦੋ',
    mr: 'थेट खरेदी करा',
    te: 'నేరుగా కొనండి'
  },
  mandiComparison: {
    en: 'cheaper than local retail',
    hi: 'स्थानीय बाज़ार से सस्ता',
    pa: 'ਸਥਾਨਕ ਬਾਜ਼ਾਰ ਨਾਲੋਂ ਸਸਤਾ',
    mr: 'किरकोळ बाजारापेक्षा स्वस्त',
    te: 'స్థానిక మార్కెట్ కంటే చౌక'
  },
  viewBasket: {
    en: 'View Basket & Checkout',
    hi: 'टोकरी देखें व चेकआउट करें',
    pa: 'ਟੋਕਰੀ ਵੇਖੋ ਤੇ ਖਰੀਦੋ',
    mr: 'टोपली पहा व ऑर्डर द्या',
    te: 'బుట్టను చూసి కొనుగోలు చేయండి'
  },

  // Units
  perKg: {
    en: '/ kg',
    hi: '/ किग्रा',
    pa: '/ ਕਿਲੋ',
    mr: '/ किलो',
    te: '/ కిలో'
  },
  perQuintal: {
    en: '/ quintal',
    hi: '/ क्विंटल',
    pa: '/ ਕੁਇੰਟਲ',
    mr: '/ क्विंटल',
    te: '/ క్వింటాల్'
  },
  perLitre: {
    en: '/ Litre',
    hi: '/ लीटर',
    pa: '/ ਲੀਟਰ',
    mr: '/ लिटर',
    te: '/ లీటరు'
  },
  verifiedOrganic: {
    en: 'Verified Organic',
    hi: 'प्रमाणित जैविक',
    pa: 'ਪ੍ਰਮਾਣਿਤ ਕੁਦਰਤੀ',
    mr: 'प्रमाणित सेंद्रिय',
    te: 'ధృవీకరించబడిన ఆర్గానిక్'
  },
  chooseLanguage: {
    en: 'Choose Language',
    hi: 'भाषा चुनें',
    pa: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    mr: 'भाषा निवडा',
    te: 'భాషను ఎంచుకోండి'
  },
  loginWithOtp: {
    en: 'Mobile OTP Login',
    hi: 'मोबाइल OTP लॉगिन',
    pa: 'ਮੋਬਾਈਲ OTP ਲੌਗਇਨ',
    mr: 'मोबाईल OTP लॉगिन',
    te: 'మొబైల్ OTP లాగిన్'
  },
  welcomeAnnapurna: {
    en: 'Welcome to Annapurna',
    hi: 'अन्नपूर्णा में आपका स्वागत है',
    pa: 'ਅੰਨਪੂਰਨਾ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ',
    mr: 'अन्नपूर्णा मध्ये आपले स्वागत आहे',
    te: 'అన్నపూర్ణకు స్వాగతం'
  },
  appDescription: {
    en: 'Direct Farm-to-Fork Movement. Eliminating middlemen. Fair profits for farmers, fresh organic produce for consumers at transparent rates.',
    hi: 'सीधा खेत से थाली तक आंदोलन। बिचौलियों का अंत। किसानों को पूरा मूल्य और उपभोक्ताओं को शुद्ध ताज़ा फसल पारदर्शी दरों पर।',
    pa: 'ਸਿੱਧਾ ਖੇਤ ਤੋਂ ਰਸੋਈ ਤੱਕ। ਵਿਚੋਲਿਆਂ ਦਾ ਅੰਤ। ਕਿਸਾਨਾਂ ਨੂੰ ਸਹੀ ਮੁਨਾਫਾ ਅਤੇ ਗਾਹਕਾਂ ਨੂੰ ਤਾਜ਼ੀ ਕੁਦਰਤੀ ਫਸਲ ਪੂਰੀ ਪਾਰਦਰਸ਼ਤਾ ਨਾਲ।',
    mr: 'थेट शेतातून पानापर्यंत चळवळ. दलालांना हद्दपार. शेतकऱ्याला रास्त भाव आणि ग्राहकाला शेतातील ताजा माल संपूर्ण पारदर्शकतेने.',
    te: 'రైతు పొలం నుండి నేరుగా ఇంటికి. దళారులకు చరమగీతం. రైతులకు న్యాయమైన ధర, వినియోగదారులకు తాజా వ్యవసాయ ఉత్పత్తులు.'
  },
  enterAsFarmer: {
    en: 'Enter as Farmer',
    hi: 'किसान के रूप में प्रवेश करें',
    pa: 'ਕਿਸਾਨ ਵਜੋਂ ਦਾਖਲ ਹੋਵੋ',
    mr: 'शेतकरी म्हणून प्रवेश करा',
    te: 'రైతుగా ప్రవేశించండి'
  },
  enterAsConsumer: {
    en: 'Explore Fresh Produce',
    hi: 'ताज़ा उपज देखें',
    pa: 'ਤਾਜ਼ੀ ਫਸਲ ਦੇਖੋ',
    mr: 'ताजी भाजीपाला आणि शेतमाल पहा',
    te: 'తాజా పంటలను చూడండి'
  },
  logout: {
    en: 'Log Out',
    hi: 'लॉगआउट',
    pa: 'ਲਾਗਆਉਟ',
    mr: 'लॉगआउट',
    te: 'లాగ్ అవుట్'
  },
  login: {
    en: 'Log In',
    hi: 'लॉगिन',
    pa: 'ਲਾਗਇਨ',
    mr: 'लॉगिन',
    te: 'లాగిన్'
  },
  lockedNotice: {
    en: 'Locked while logged in',
    hi: 'लॉगिन स्थिति में लॉक',
    pa: 'ਲਾਗਇਨ ਦੌਰਾਨ ਲਾਕ',
    mr: 'लॉगिन असताना लॉक केलेले',
    te: 'లాగిన్ స్థితిలో లాక్ చేయబడింది'
  },
  languageLocked: {
    en: 'Language locked to active session',
    hi: 'सक्रिय सत्र के लिए भाषा लॉक है',
    pa: 'ਭਾਸ਼ਾ ਇਸ ਸੈਸ਼ਨ ਲਈ ਲਾਕ ਹੈ',
    mr: 'या सत्रासाठी भाषा लॉक आहे',
    te: 'భాష ప్రస్తుత సెషన్‌కు లాక్ చేయబడింది'
  },
  regionLocked: {
    en: 'Region locked to active session',
    hi: 'सक्रिय सत्र के लिए क्षेत्र लॉक है',
    pa: 'ਖੇਤਰ ਇਸ ਸੈਸ਼ਨ ਲਈ ਲਾਕ ਹੈ',
    mr: 'या सत्रासाठी परिसर लॉक आहे',
    te: 'ప్రాంతం ప్రస్తుత సెషన్‌కు లాక్ చేయబడింది'
  },
  logoutToChange: {
    en: 'Log out to change region or language',
    hi: 'क्षेत्र या भाषा बदलने के लिए लॉगआउट करें',
    pa: 'ਖੇਤਰ ਜਾਂ ਭਾਸ਼ਾ ਬਦਲਣ ਲਈ ਲਾਗਆਉਟ ਕਰੋ',
    mr: 'परिसर किंवा भाषा बदलण्यासाठी लॉगआउट करा',
    te: 'ప్రాంతం లేదా భాషను మార్చడానికి లాగ్ అవుట్ చేయండి'
  }
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS;

export function t(key: TranslationKey, lang: Language): string {
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  return entry[lang] || entry['en'] || key;
}
