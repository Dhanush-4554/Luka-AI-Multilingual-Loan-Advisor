export const LANGUAGES = [
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'en-IN', name: 'English' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'te-IN', name: 'Telugu' },
  { code: 'kn-IN', name: 'Kannada' },
  { code: 'ml-IN', name: 'Malayalam' },
  { code: 'mr-IN', name: 'Marathi' },
  { code: 'gu-IN', name: 'Gujarati' },
];

export const WELCOME_MESSAGES = {
  'hi-IN': 'लोन गाइड में आपका स्वागत है',
  'en-IN': 'Welcome to the Loan Guide',
  'ta-IN': 'கடன் வழிகாட்டிக்கு வரவேற்கிறோம்',
  'te-IN': 'లోన్ గైడ్‌కు స్వాగతం',
  'kn-IN': 'ಲೋನ್ ಗೈಡ್‌ಗೆ ಸುಸ್ವಾಗತ',
  'ml-IN': 'ലോൺ ഗൈഡിലേക്ക് സ്വാഗതം',
  'mr-IN': 'कर्ज मार्गदर्शक मध्ये आपले स्वागत आहे',
  'gu-IN': 'લોન ગાઇડમાં આપનું સ્વાગત છે',
};

export const QUESTIONS = {
  'hi-IN': [
    'आपका नाम क्या है?',
    'आपका जन्म स्थान कहाँ है?',
    'आपका वर्तमान पता क्या है?',
    'क्या आप काम कर रहे हैं?',
    'आपकी मासिक आय कितनी है?',
    'आपको लोन की आवश्यकता क्यों है?'
  ],
  'en-IN': [
    'What is your name?',
    'What is your place of birth?',
    'What is your current address?',
    'Are you currently employed?',
    'What is your monthly income?',
    'Why do you require the loan?'
  ],
  'ta-IN': [
    'உங்கள் பெயர் என்ன?',
    'உங்கள் பிறப்பிடம் எங்கே?',
    'உங்கள் தற்போதைய முகவரி என்ன?',
    'நீங்கள் தற்போது வேலை செய்கிறீர்களா?',
    'உங்கள் மாதாந்திர வருமானம் என்ன?',
    'நீங்கள் கடன் தேவைப்படுவதற்கான காரணம் என்ன?'
  ],
  'te-IN': [
    'మీ పేరు ఏమిటి?',
    'మీ పుట్టిన ప్రదేశం ఎక్కడ?',
    'మీ ప్రస్తుత చిరునామా ఏమిటి?',
    'మీరు ప్రస్తుతం ఉద్యోగంలో ఉన్నారా?',
    'మీ నెలవారీ ఆదాయం ఎంత?',
    'మీరు రుణం అవసరం కలిగి ఉన్న కారణం ఏమిటి?'
  ],
  'kn-IN': [
    'ನಿಮ್ಮ ಹೆಸರೇನು?',
    'ನಿಮ್ಮ ಜನ್ಮಸ್ಥಳ ಎಲ್ಲಿದೆ?',
    'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ವಿಳಾಸ ಯಾವುದು?',
    'ನೀವು ಪ್ರಸ್ತುತ ಉದ್ಯೋಗದಲ್ಲಿದ್ದೀರಾ?',
    'ನಿಮ್ಮ ಮಾಸಿಕ ಆದಾಯ ಎಷ್ಟು?',
    'ನೀವು ಸಾಲದ ಅಗತ್ಯವಿರುವ ಕಾರಣ ಏನು?'
  ],
  'ml-IN': [
    'നിങ്ങളുടെ പേര് എന്താണ്?',
    'നിങ്ങളുടെ ജനനസ്ഥലം എവിടെയാണ്?',
    'നിങ്ങളുടെ ഇപ്പോഴത്തെ വിലാസം എന്താണ്?',
    'നിങ്ങൾ ഇപ്പോൾ ജോലി ചെയ്യുന്നുണ്ടോ?',
    'നിങ്ങളുടെ പ്രതിമാസ വരുമാനം എത്രയാണ്?',
    'നിങ്ങൾക്ക് വായ്പ ആവശ്യമായി വരുന്നത് എന്തുകൊണ്ട്?'
  ],
  'mr-IN': [
    'तुमचे नाव काय आहे?',
    'तुमचा जन्मस्थान कोठे आहे?',
    'तुमचा सध्याचा पत्ता काय आहे?',
    'तुम्ही सध्या नोकरी करत आहात का?',
    'तुमचे मासिक उत्पन्न किती आहे?',
    'तुम्हाला कर्जाची आवश्यकता का आहे?'
  ],
  'gu-IN': [
    'તમારું નામ શું છે?',
    'તમારું જન્મસ્થળ ક્યાં છે?',
    'તમારું વર્તમાન સરનામું શું છે?',
    'શું તમે હાલમાં નોકરી કરો છો?',
    'તમારી માસિક આવક કેટલી છે?',
    'તમને લોનની જરૂરિયાત શા માટે છે?'
  ]
};

export const PERSONAL_LOAN_STEPS = {
  en: [
    {
      title: "Step 1: Check Eligibility",
      description: "To verify your eligibility, we'll need some basic information. This includes your monthly income, employment status, and credit score. A good credit score increases your chances of approval. Did you understand this step? If you have any doubts, please let us know."
    },
    {
      title: "Step 2: Submit Documents",
      description: "For document verification, please upload clear copies of your ID proof (like Aadhaar or PAN card), address proof (such as utility bills or rental agreement), and income statements (salary slips or bank statements). Make sure all documents are valid and clearly visible. Did you understand this step? If you have any questions, please ask."
    },
    {
      title: "Step 3: Loan Approval",
      description: "After submitting your application and documents, our team will review your details. If approved, the loan amount will be disbursed to your account within 24 hours. You'll receive a confirmation message once the process is complete. Did you understand this step? If you need clarification, please let us know."
    }
  ],
  'hi-IN': [
    {
      title: "चरण 1: पात्रता जांचें",
      description: "आपकी पात्रता सत्यापित करने के लिए, हमें कुछ बुनियादी जानकारी की आवश्यकता होगी। इसमें आपकी मासिक आय, रोजगार स्थिति और क्रेडिट स्कोर शामिल है। एक अच्छा क्रेडिट स्कोर आपके अनुमोदन की संभावना बढ़ाता है। क्या आप इस चरण को समझ गए? यदि आपके कोई संदेह हैं, तो कृपया हमें बताएं।"
    },
    {
      title: "चरण 2: दस्तावेज़ जमा करें",
      description: "दस्तावेज़ सत्यापन के लिए, कृपया अपने आईडी प्रूफ (जैसे आधार या पैन कार्ड), पता प्रूफ (जैसे उपयोगिता बिल या किराया समझौता) और आय विवरण (वेतन पर्ची या बैंक स्टेटमेंट) की स्पष्ट प्रतियां अपलोड करें। सुनिश्चित करें कि सभी दस्तावेज़ वैध और स्पष्ट रूप से दिखाई दे रहे हैं। क्या आप इस चरण को समझ गए? यदि आपके कोई प्रश्न हैं, तो कृपया पूछें।"
    },
    {
      title: "चरण 3: ऋण स्वीकृति",
      description: "आपका आवेदन और दस्तावेज़ जमा करने के बाद, हमारी टीम आपके विवरणों की समीक्षा करेगी। यदि अनुमोदित होता है, तो ऋण राशि 24 घंटे के भीतर आपके खाते में जमा कर दी जाएगी। प्रक्रिया पूरी होने पर आपको एक पुष्टिकरण संदेश प्राप्त होगा। क्या आप इस चरण को समझ गए? यदि आपको स्पष्टीकरण की आवश्यकता है, तो कृपया हमें बताएं।"
    }
  ],
  'kn-IN': [
    {
      title: "ಹಂತ 1: ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ",
      description: "ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು, ನಮಗೆ ಕೆಲವು ಮೂಲಭೂತ ಮಾಹಿತಿ ಅಗತ್ಯವಿದೆ. ಇದರಲ್ಲಿ ನಿಮ್ಮ ಮಾಸಿಕ ಆದಾಯ, ಉದ್ಯೋಗ ಸ್ಥಿತಿ ಮತ್ತು ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್ ಸೇರಿವೆ. ಉತ್ತಮ ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್ ನಿಮ್ಮ ಅನುಮೋದನೆಯ ಸಾಧ್ಯತೆಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ. ನೀವು ಈ ಹಂತವನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೀರಾ? ನಿಮಗೆ ಯಾವುದೇ ಸಂಶಯಗಳಿದ್ದರೆ, ದಯವಿಟ್ಟು ನಮಗೆ ತಿಳಿಸಿ."
    },
    {
      title: "ಹಂತ 2: ದಾಖಲೆಗಳನ್ನು ಸಲ್ಲಿಸಿ",
      description: "ದಾಖಲೆಗಳ ಪರಿಶೀಲನೆಗಾಗಿ, ದಯವಿಟ್ಟು ನಿಮ್ಮ ID ಪುರಾವೆ (ಆಧಾರ್ ಅಥವಾ PAN ಕಾರ್ಡ್), ವಿಳಾಸ ಪುರಾವೆ (ಯುಟಿಲಿಟಿ ಬಿಲ್ಗಳು ಅಥವಾ ಬಾಡಿಗೆ ಒಪ್ಪಂದ) ಮತ್ತು ಆದಾಯ ಹೇಳಿಕೆಗಳ (ಸಂಬಳ ಪತ್ರಗಳು ಅಥವಾ ಬ್ಯಾಂಕ್ ಸ್ಟೇಟ್ಮೆಂಟ್ಗಳು) ಸ್ಪಷ್ಟ ಪ್ರತಿಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ. ಎಲ್ಲಾ ದಾಖಲೆಗಳು ಮಾನ್ಯವಾಗಿವೆ ಮತ್ತು ಸ್ಪಷ್ಟವಾಗಿ ಗೋಚರಿಸುತ್ತವೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ. ನೀವು ಈ ಹಂತವನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೀರಾ? ನಿಮಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿದ್ದರೆ, ದಯವಿಟ್ಟು ಕೇಳಿ."
    },
    {
      title: "ಹಂತ 3: ಸಾಲ ಅನುಮೋದನೆ",
      description: "ನಿಮ್ಮ ಅರ್ಜಿ ಮತ್ತು ದಾಖಲೆಗಳನ್ನು ಸಲ್ಲಿಸಿದ ನಂತರ, ನಮ್ಮ ತಂಡ ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸುತ್ತದೆ. ಅನುಮೋದಿಸಿದರೆ, ಸಾಲದ ಮೊತ್ತವನ್ನು 24 ಗಂಟೆಗಳೊಳಗೆ ನಿಮ್ಮ ಖಾತೆಗೆ ವಿತರಿಸಲಾಗುತ್ತದೆ. ಪ್ರಕ್ರಿಯೆ ಪೂರ್ಣಗೊಂಡ ನಂತರ ನೀವು ಒಂದು ದೃಢೀಕರಣ ಸಂದೇಶವನ್ನು ಸ್ವೀಕರಿಸುತ್ತೀರಿ. ನೀವು ಈ ಹಂತವನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೀರಾ? ನಿಮಗೆ ಸ್ಪಷ್ಟೀಕರಣದ ಅಗತ್ಯವಿದ್ದರೆ, ದಯವಿಟ್ಟು ನಮಗೆ ತಿಳಿಸಿ."
    }
  ]
  // Add more languages as needed
};

export const BUSINESS_LOAN_STEPS = {
  en: [
    {
      title: "Step 1: Business Information",
      description: "Provide details about your business, including its name, type, and years in operation. Accurate information helps us assess your eligibility. Did you understand this step? If you have any doubts, please let us know."
    },
    {
      title: "Step 2: Financial Details",
      description: "Submit your business's financial statements, including profit and loss statements, balance sheets, and cash flow statements. This helps us understand your financial health. Did you understand this step? If you have any questions, please ask."
    },
    {
      title: "Step 3: Loan Purpose",
      description: "Explain the purpose of the loan, such as expanding operations, purchasing equipment, or managing working capital. A clear purpose increases your chances of approval. Did you understand this step? If you need clarification, please let us know."
    }
  ],
  'hi-IN': [
    {
      title: "चरण 1: व्यवसाय जानकारी",
      description: "अपने व्यवसाय के बारे में विवरण प्रदान करें, जिसमें उसका नाम, प्रकार और संचालन के वर्ष शामिल हैं। सटीक जानकारी से हमें आपकी पात्रता का आकलन करने में मदद मिलती है। क्या आप इस चरण को समझ गए? यदि आपके कोई संदेह हैं, तो कृपया हमें बताएं।"
    },
    {
      title: "चरण 2: वित्तीय विवरण",
      description: "अपने व्यवसाय के वित्तीय विवरण जमा करें, जिसमें लाभ और हानि विवरण, बैलेंस शीट और नकदी प्रवाह विवरण शामिल हैं। इससे हमें आपके वित्तीय स्वास्थ्य को समझने में मदद मिलती है। क्या आप इस चरण को समझ गए? यदि आपके कोई प्रश्न हैं, तो कृपया पूछें।"
    },
    {
      title: "चरण 3: ऋण उद्देश्य",
      description: "ऋण के उद्देश्य की व्याख्या करें, जैसे कि संचालन का विस्तार करना, उपकरण खरीदना या कार्यशील पूंजी का प्रबंधन करना। एक स्पष्ट उद्देश्य से आपके अनुमोदन की संभावना बढ़ जाती है। क्या आप इस चरण को समझ गए? यदि आपको स्पष्टीकरण की आवश्यकता है, तो कृपया हमें बताएं।"
    }
  ],
  'kn-IN': [
    {
      title: "ಹಂತ 1: ವ್ಯವಹಾರ ಮಾಹಿತಿ",
      description: "ನಿಮ್ಮ ವ್ಯವಹಾರದ ಬಗ್ಗೆ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ, ಅದರ ಹೆಸರು, ಪ್ರಕಾರ ಮತ್ತು ಕಾರ್ಯಾಚರಣೆಯ ವರ್ಷಗಳನ್ನು ಒಳಗೊಂಡಂತೆ. ನಿಖರವಾದ ಮಾಹಿತಿಯು ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ನಿರ್ಣಯಿಸಲು ನಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ. ನೀವು ಈ ಹಂತವನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೀರಾ? ನಿಮಗೆ ಯಾವುದೇ ಸಂಶಯಗಳಿದ್ದರೆ, ದಯವಿಟ್ಟು ನಮಗೆ ತಿಳಿಸಿ."
    },
    {
      title: "ಹಂತ 2: ಹಣಕಾಸಿನ ವಿವರಗಳು",
      description: "ನಿಮ್ಮ ವ್ಯವಹಾರದ ಹಣಕಾಸಿನ ಹೇಳಿಕೆಗಳನ್ನು ಸಲ್ಲಿಸಿ, ಲಾಭ ಮತ್ತು ನಷ್ಟ ಹೇಳಿಕೆಗಳು, ಬ್ಯಾಲೆನ್ಸ್ ಶೀಟ್‌ಗಳು ಮತ್ತು ನಗದು ಹರಿವಿನ ಹೇಳಿಕೆಗಳನ್ನು ಒಳಗೊಂಡಂತೆ. ಇದು ನಿಮ್ಮ ಹಣಕಾಸಿನ ಆರೋಗ್ಯವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ. ನೀವು ಈ ಹಂತವನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೀರಾ? ನಿಮಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿದ್ದರೆ, ದಯವಿಟ್ಟು ಕೇಳಿ."
    },
    {
      title: "ಹಂತ 3: ಸಾಲದ ಉದ್ದೇಶ",
      description: "ಸಾಲದ ಉದ್ದೇಶವನ್ನು ವಿವರಿಸಿ, ಉದಾಹರಣೆಗೆ ಕಾರ್ಯಾಚರಣೆಗಳನ್ನು ವಿಸ್ತರಿಸುವುದು, ಉಪಕರಣಗಳನ್ನು ಖರೀದಿಸುವುದು ಅಥವಾ ಕಾರ್ಯನಿರತ ಬಂಡವಾಳವನ್ನು ನಿರ್ವಹಿಸುವುದು. ಸ್ಪಷ್ಟವಾದ ಉದ್ದೇಶವು ನಿಮ್ಮ ಅನುಮೋದನೆಯ ಸಾಧ್ಯತೆಗಳನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ. ನೀವು ಈ ಹಂತವನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೀರಾ? ನಿಮಗೆ ಸ್ಪಷ್ಟೀಕರಣದ ಅಗತ್ಯವಿದ್ದರೆ, ದಯವಿಟ್ಟು ನಮಗೆ ತಿಳಿಸಿ."
    }
  ]
  // Add more languages as needed
};

export const EDUCATION_LOAN_STEPS = {
  en: [
    {
      title: "Step 1: Student Information",
      description: "Provide details about the student, including their name, educational institution, and course of study. Accurate information helps us assess eligibility. Did you understand this step? If you have any doubts, please let us know."
    },
    {
      title: "Step 2: Co-applicant Information",
      description: "Submit details about the co-applicant, including their name, employment status, and income. This helps us understand the financial health. Did you understand this step? If you have any questions, please ask."
    },
    {
      title: "Step 3: Loan Requirements",
      description: "Explain the loan requirements, such as the amount needed, the duration of the course, and any collateral offered. A clear purpose increases your chances of approval. Did you understand this step? If you need clarification, please let us know."
    }
  ],
  'hi-IN': [
    {
      title: "चरण 1: छात्र जानकारी",
      description: "छात्र के बारे में विवरण प्रदान करें, जिसमें उनका नाम, शैक्षणिक संस्थान और अध्ययन का पाठ्यक्रम शामिल है। सटीक जानकारी से हमें पात्रता का आकलन करने में मदद मिलती है। क्या आप इस चरण को समझ गए? यदि आपके कोई संदेह हैं, तो कृपया हमें बताएं।"
    },
    {
      title: "चरण 2: सह-आवेदक जानकारी",
      description: "सह-आवेदक के बारे में विवरण जमा करें, जिसमें उनका नाम, रोजगार की स्थिति और आय शामिल है। इससे हमें वित्तीय स्वास्थ्य को समझने में मदद मिलती है। क्या आप इस चरण को समझ गए? यदि आपके कोई प्रश्न हैं, तो कृपया पूछें।"
    },
    {
      title: "चरण 3: ऋण आवश्यकताएँ",
      description: "ऋण आवश्यकताओं की व्याख्या करें, जैसे कि आवश्यक राशि, पाठ्यक्रम की अवधि और कोई भी संपार्श्विक की पेशकश की गई। एक स्पष्ट उद्देश्य से आपके अनुमोदन की संभावना बढ़ जाती है। क्या आप इस चरण को समझ गए? यदि आपको स्पष्टीकरण की आवश्यकता है, तो कृपया हमें बताएं।"
    }
  ],
  'kn-IN': [
    {
      title: "ಹಂತ 1: ವಿದ್ಯಾರ್ಥಿ ಮಾಹಿತಿ",
      description: "ವಿದ್ಯಾರ್ಥಿಯ ಬಗ್ಗೆ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ, ಅವರ ಹೆಸರು, ಶೈಕ್ಷಣಿಕ ಸಂಸ್ಥೆ ಮತ್ತು ಅಧ್ಯಯನದ ಕೋರ್ಸ್ ಸೇರಿದಂತೆ. ನಿಖರವಾದ ಮಾಹಿತಿಯು ಅರ್ಹತೆಯನ್ನು ನಿರ್ಣಯಿಸಲು ನಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ. ನೀವು ಈ ಹಂತವನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೀರಾ? ನಿಮಗೆ ಯಾವುದೇ ಸಂಶಯಗಳಿದ್ದರೆ, ದಯವಿಟ್ಟು ನಮಗೆ ತಿಳಿಸಿ."
    },
    {
      title: "ಹಂತ 2: ಸಹ-ಅರ್ಜಿದಾರರ ಮಾಹಿತಿ",
      description: "ಸಹ-ಅರ್ಜಿದಾರರ ಬಗ್ಗೆ ವಿವರಗಳನ್ನು ಸಲ್ಲಿಸಿ, ಅವರ ಹೆಸರು, ಉದ್ಯೋಗ ಸ್ಥಿತಿ ಮತ್ತು ಆದಾಯ ಸೇರಿದಂತೆ. ಇದು ಹಣಕಾಸಿನ ಆರೋಗ್ಯವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ. ನೀವು ಈ ಹಂತವನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೀರಾ? ನಿಮಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿದ್ದರೆ, ದಯವಿಟ್ಟು ಕೇಳಿ."
    },
    {
      title: "ಹಂತ 3: ಸಾಲದ ಅಗತ್ಯತೆಗಳು",
      description: "ಸಾಲದ ಅಗತ್ಯತೆಗಳನ್ನು ವಿವರಿಸಿ, ಅಗತ್ಯವಿರುವ ಮೊತ್ತ, ಕೋರ್ಸ್‌ನ ಅವಧಿ ಮತ್ತು ಯಾವುದೇ ಮೇಲಾಧಾರವನ್ನು ಒಳಗೊಂಡಂತೆ. ಸ್ಪಷ್ಟವಾದ ಉದ್ದೇಶವು ನಿಮ್ಮ ಅನುಮೋದನೆಯ ಸಾಧ್ಯತೆಗಳನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ. ನೀವು ಈ ಹಂತವನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೀರಾ? ನಿಮಗೆ ಸ್ಪಷ್ಟೀಕರಣದ ಅಗತ್ಯವಿದ್ದರೆ, ದಯವಿಟ್ಟು ನಮಗೆ ತಿಳಿಸಿ."
    }
  ]
  // Add more languages as needed
}; 