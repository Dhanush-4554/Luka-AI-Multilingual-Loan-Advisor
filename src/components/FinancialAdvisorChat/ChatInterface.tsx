

'use client';
import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { Message } from './types';
import { sendChatMessage } from '@/utils/financialLiteracy';
import { generateTTS } from '@/utils/tts';
import { LANGUAGES } from '@/components/LoanGuide/data';
import { transcribeAudio } from '@/utils/stt';
import { Mic, Headphones, MessageCircle, ChevronDown, ArrowRight, DollarSign, PieChart, BarChart, ChevronLeft, Settings, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define supported language codes
type LanguageCode = 'hi-IN' | 'kn-IN' | 'te-IN' | 'ta-IN' | 'mr-IN' | 'ml-IN' | 'gu-IN' | 'en-IN';

// Define multilingual greetings
const GREETINGS: Record<LanguageCode, string> = {
  'hi-IN': 'नमस्ते! मैं आपका वित्तीय सलाहकार हूं। आपकी वित्तीय स्थिति के बारे में अधिक जानने और व्यक्तिगत सुझाव प्रदान करने में मदद करने के लिए, मुझे बस कुछ बुनियादी जानकारी चाहिए। आपका नाम क्या है?',
  'kn-IN': 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಹಣಕಾಸು ಸಲಹೆಗಾರ. ನಿಮ್ಮ ಹಣಕಾಸು ಸ್ಥಿತಿಯ ಬಗ್ಗೆ ಹೆಚ್ಚು ತಿಳಿದುಕೊಳ್ಳಲು ಮತ್ತು ವೈಯಕ್ತಿಕ ಸಲಹೆಗಳನ್ನು ನೀಡಲು ಸಹಾಯ ಮಾಡಲು, ನನಗೆ ಕೇವಲ ಕೆಲವು ಮೂಲ ಮಾಹಿತಿ ಬೇಕು. ನಿಮ್ಮ ಹೆಸರೇನು?',
  'te-IN': 'నమస్కారం! నేను మీ ఆర్థిక సలహాదారుని. మీ ఆర్థిక పరిస్థితి గురించి మరింత తెలుసుకోవడానికి మరియు వ్యక్తిగత చిట్కాలను అందించడంలో సహాయపడటానికి, నాకు కొంత ప్రాథమిక సమాచారం మాత్రమే కావాలి. మీ పేరు ఏమిటి?',
  'ta-IN': 'வணக்கம்! நான் உங்கள் நிதி ஆலோசகர். உங்கள் நிதி நிலைமை பற்றி மேலும் அறிந்து கொள்ளவும், தனிப்பட்ட உதவிக்குறிப்புகளை வழங்கவும், எனக்கு சில அடிப்படை தகவல்கள் மட்டுமே தேவை. உங்கள் பெயர் என்ன?',
  'mr-IN': 'नमस्कार! मी तुमचा आर्थिक सल्लागार आहे. तुमच्या आर्थिक स्थितीबद्दल अधिक जाणून घेण्यासाठी आणि वैयक्तिक टिप्स देण्यासाठी, मला फक्त काही मूलभूत माहिती हवी आहे. तुमचे नाव काय आहे?',
  'ml-IN': 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ സാമ്പത്തിക ഉപദേശകനാണ്. നിങ്ങളുടെ സാമ്പത്തിക സ്ഥിതിയെക്കുറിച്ച് കൂടുതൽ അറിയാനും വ്യക്തിഗത നുറുങ്ങുകൾ നൽകാനും സഹായിക്കുന്നതിന്, എനിക്ക് ചില അടിസ്ഥാന വിവരങ്ങൾ മാത്രമേ ആവശ്യമുള്ളൂ. നിങ്ങളുടെ പേര് എന്താണ്?',
  'gu-IN': 'નમસ્તે! હું તમારો નાણાકીય સલાહકાર છું. તમારી નાણાકીય સ્થિતિ વિશે વધુ જાણવા અને વ્યક્તિગત ટિપ્સ પ્રદાન કરવામાં મદદ કરવા માટે, મારે માત્ર કેટલીક મૂળભૂત માહિતીની જરૂર છે. તમારું નામ શું છે?',
  'en-IN': 'Hello! I\'m your Financial Advisor. To help you learn more about your financial situation and provide personalized tips, I just need some basic information. What\'s your name?'
};

export default function ChatInterface() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(10000); // Start with 10 seconds
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [visualizationData, setVisualizationData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [userId] = useState<string>(`user-${Math.random().toString(36).substring(2, 9)}`);
  const [darkMode, setDarkMode] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const animations = ['pulse', 'wave', 'bounce', 'float'];
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(0);

  // Initialize audio context and analyser
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current.connect(audioContextRef.current.destination);
    }
  };

  // Start conversation when language is selected
  useEffect(() => {
    if (selectedLanguage) {
      startConversation();
    }
  }, [selectedLanguage]);


  const startConversation = async () => {
    try {
      setIsProcessing(true);
      const greeting = GREETINGS[selectedLanguage as LanguageCode] || GREETINGS['en-IN'];
      setMessages(prev => [...prev, { text: greeting, sender: 'bot' }]);
      await generateTTS(selectedLanguage!, greeting);
      
      setTimeout(() => {
        startRecording();
      }, 2000);
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    if (isTTSPlaying || isRecording) return;
    
    try {
      initAudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      const source = audioContextRef.current!.createMediaStreamSource(stream);
      source.connect(analyserRef.current!);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          processAudio(audioBlob);
        } else {
          startRecording();
        }
      };

      scriptProcessorRef.current!.onaudioprocess = (event) => {
        const inputData = event.inputBuffer.getChannelData(0);
        let volume = 0;
        for (let i = 0; i < inputData.length; i++) {
          volume += Math.abs(inputData[i]);
        }
        volume /= inputData.length;

        if (volume > 0.02) {
          if (!isRecording && mediaRecorderRef.current!.state !== 'recording') {
            mediaRecorderRef.current!.start();
            setIsRecording(true);
          }
        } else if (isRecording && mediaRecorderRef.current!.state === 'recording') {
          mediaRecorderRef.current!.stop();
          setIsRecording(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      recordingTimeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, recordingDuration);

    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      const sttResponse = await transcribeAudio(audioBlob, selectedLanguage!);
      
      if (sttResponse?.transcript) {
        const userMessage = sttResponse.transcript.trim();
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        await processUserMessage(userMessage);
      } else {
        startRecording();
      }
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const playTTS = async (languageCode: string, text: string) => {
    try {
      setIsTTSPlaying(true);
      
      const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
      const chunks = [];
      let currentChunk = '';
      
      for (const sentence of sentences) {
        if ((currentChunk + sentence).length <= 200) {
          currentChunk += sentence;
        } else {
          if (currentChunk) chunks.push(currentChunk);
          currentChunk = sentence;
        }
      }
      if (currentChunk) chunks.push(currentChunk);

      for (const chunk of chunks) {
        const response = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': '47b5a700-2f9e-4e1d-afe0-c46ed9cda77e',
          },
          body: JSON.stringify({
            inputs: [chunk],
            target_language_code: languageCode,
            speaker: 'meera',
            pace: 1.0,
            loudness: 1.0,
          }),
        });

        const data = await response.json();
        if (data.audios && data.audios.length > 0) {
          const audio = new Audio(`data:audio/wav;base64,${data.audios[0]}`);
          
          if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
          }

          await new Promise<void>((resolve) => {
            audio.play();
            audio.onended = () => resolve();
          });
        }
      }
    } catch (error) {
      console.error('Error generating TTS:', error);
    } finally {
      setIsTTSPlaying(false);
      if (!isRecording) {
        setTimeout(() => {
          startRecording();
        }, 1000);
      }
    }
  };

  const calculateRecordingDuration = (response: string) => {
    const wordCount = response.split(' ').length;
    
    const baseDuration = 5000;
    const perWordDuration = 200;
    const maxDuration = 30000;
    
    const calculatedDuration = baseDuration + (wordCount * perWordDuration);
    return Math.min(calculatedDuration, maxDuration);
  };

  // Check for redirect phrase in bot messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.sender === 'bot' && 
        (lastMessage.text.includes('financial-literacy') || 
         lastMessage.text.toLowerCase().includes('financial literacy page'))) {
      
      // Set redirect flag and start countdown
      setShouldRedirect(true);
      setRedirectCountdown(5);
    }
  }, [messages]);

  // Handle redirect countdown
  useEffect(() => {
    if (shouldRedirect && redirectCountdown > 0) {
      redirectTimeoutRef.current = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
    } else if (shouldRedirect && redirectCountdown === 0) {
      // Open financial literacy page in a new tab
      window.open('/financial-literacy', '_blank');
      // Reset redirect state after opening
      setShouldRedirect(false);
    }

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [shouldRedirect, redirectCountdown]);

  // Process user message and get response
  const processUserMessage = async (message: string) => {
    try {
      console.log('Processing user message:', message);
      
      const response = await sendChatMessage(userId, message, selectedLanguage!);
      console.log('Received response:', response);
      
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
      
      // Calculate new recording duration based on response length
      const newDuration = calculateRecordingDuration(response);
      setRecordingDuration(newDuration);
      
      // Check if response contains redirect phrase
      if (response.includes('/financial-literacy') || 
          response.toLowerCase().includes('financial literacy page')) {
        setShouldRedirect(true);
        setRedirectCountdown(5);
      }
      
      await playTTS(selectedLanguage!, response);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = "I'm sorry, I encountered an error. Please try again.";
      setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
      
      // Start recording again after error
      setTimeout(() => {
        if (!isRecording) {
          startRecording();
        }
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(err => {
          console.error('Error getting microphone permission:', err);
        });
    }

    try {
      initAudioContext();
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }

    return () => {
      if (audioContextRef.current) {
        if (scriptProcessorRef.current) {
          scriptProcessorRef.current.disconnect();
        }
        if (analyserRef.current) {
          analyserRef.current.disconnect();
        }
        try {
          audioContextRef.current.close();
        } catch (err) {
          console.error('Error closing audio context:', err);
        }
      }
    };
  }, []);

  const generateVisualization = async () => {
    try {
      setIsVisualizing(true);
      
      // Cycle through animations
      setAnimationIndex((animationIndex + 1) % animations.length);
      
      const mockVisualizationData = {
        summary: "Based on our conversation, you're interested in improving your financial literacy and getting personalized financial advice.",
        flowChart: {
          nodes: [
            { id: 1, type: 'start', label: 'Financial Assessment' },
            { id: 2, type: 'question', label: 'Income & Expenses' },
            { id: 3, type: 'question', label: 'Savings Goals' },
            { id: 4, type: 'action', label: 'Investment Strategy' }
          ]
        },
        blockDiagram: {
          sections: [
            { 
              title: "Budgeting", 
              content: ["Track expenses", "Create monthly budget", "Reduce unnecessary spending"] 
            },
            { 
              title: "Saving", 
              content: ["Emergency fund", "Automatic transfers", "High-yield accounts"] 
            },
            { 
              title: "Investing", 
              content: ["Retirement accounts", "Index funds", "Asset allocation"] 
            }
          ]
        },
        graphs: [
          {
            title: "Income Allocation",
            data: {
              values: [50, 30, 20]
            }
          },
          {
            title: "Savings Growth",
            data: {
              values: [10, 25, 45, 70, 100]
            }
          }
        ]
      };
      
      setVisualizationData(mockVisualizationData);
    } catch (error) {
      console.error('Error generating visualization:', error);
    } finally {
      setIsVisualizing(false);
    }
  };

  const generateSummary = async () => {
    try {
      setIsSummarizing(true);
      setSummaryData(null);
      setIsSummaryOpen(true);
      
      const mockSummaryData = {
        summary: "Based on our conversation, you're looking to improve your financial situation with a focus on budgeting, saving, and investing for the future.",
        keyPoints: [
          "Create an emergency fund with 3-6 months of expenses",
          "Pay off high-interest debt first",
          "Start investing in retirement accounts",
          "Consider low-cost index funds for long-term growth",
          "Review and adjust your budget monthly"
        ]
      };
      
      setSummaryData(mockSummaryData);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummaryData(null);
    } finally {
      setIsSummarizing(false);
    }
  };

  const VisualizationPanel = () => (
    <div className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl p-6 overflow-y-auto max-h-[400px] transition-all duration-300`}>
      <div className="grid grid-cols-1 gap-8">
        {/* Summary Section */}
        <div className={`${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} p-6 rounded-xl shadow-sm backdrop-blur-sm`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-800'} mb-3`}>Conversation Summary</h3>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{visualizationData.summary}</p>
        </div>

        {/* Flow Chart Section */}
        <div className={`${darkMode ? 'bg-gray-700/40' : 'bg-white'} p-6 rounded-xl shadow-sm backdrop-blur-sm border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Conversation Flow</h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            {visualizationData.flowChart.nodes.map((node: any) => (
              <div 
                key={node.id} 
                className={`p-4 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 ${
                  darkMode ? 
                    (node.type === 'start' ? 'bg-emerald-900/40' : 
                    node.type === 'question' ? 'bg-blue-900/40' : 'bg-purple-900/40') :
                    (node.type === 'start' ? 'bg-emerald-50' : 
                    node.type === 'question' ? 'bg-blue-50' : 'bg-purple-50')
                }`}
              >
                <div className={`text-base font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{node.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Block Diagram Section */}
        <div className={`${darkMode ? 'bg-gray-700/40' : 'bg-white'} p-6 rounded-xl shadow-sm backdrop-blur-sm border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Key Concepts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visualizationData.blockDiagram.sections.map((section: any, index: number) => (
              <div 
                key={index} 
                className={`${darkMode ? 'bg-gray-800/60' : 'bg-gray-50'} p-5 rounded-xl shadow-md transition-all duration-300 transform hover:scale-102 hover:shadow-lg backdrop-blur-sm ${animations[animationIndex % animations.length]}`}
              >
                <h4 className={`font-medium text-xl ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-3`}>{section.title}</h4>
                <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {section.content.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Graphs Section */}
        <div className={`${darkMode ? 'bg-gray-700/40' : 'bg-white'} p-6 rounded-xl shadow-sm backdrop-blur-sm border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visualizationData.graphs.map((graph: any, index: number) => (
              <div 
                key={index} 
                className={`${darkMode ? 'bg-gray-800/60' : 'bg-gray-50'} p-5 rounded-xl shadow-md transition-all duration-300`}
              >
                <h4 className={`font-medium text-lg ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>{graph.title}</h4>
                <div className={`h-48 ${darkMode ? 'bg-gray-900/70' : 'bg-white'} rounded-lg shadow-inner p-4`}>
                  <div className="flex items-end h-full gap-2">
                    {graph.data.values.map((value: number, i: number) => (
                      <div 
                        key={i}
                        style={{ height: `${value}%` }}
                        className={`flex-1 ${darkMode ? 'bg-blue-500/80' : 'bg-blue-400'} rounded-t-lg transition-all duration-500 transform hover:scale-y-105 relative group`}
                      >
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white text-xs py-1 px-2 rounded-md">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Summary Panel Component
  const SummaryPanel = () => (
    <div className={`fixed inset-y-0 left-0 w-96 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl transform transition-transform duration-500 ease-in-out z-50 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className={`p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between backdrop-blur-sm`}>
          <button
            onClick={() => setIsSummaryOpen(false)}
            className={`p-2 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
          >
            <ChevronLeft className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Financial Summary</h3>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSummarizing ? (
            <div className="flex items-center justify-center h-full">
              <div className={`animate-spin rounded-full h-10 w-10 border-4 ${darkMode ? 'border-blue-400 border-t-transparent' : 'border-blue-500 border-t-transparent'}`}></div>
            </div>
          ) : summaryData ? (
            <>
              {/* Summary Section */}
              <div className="mb-8">
                <h4 className={`font-medium text-lg ${darkMode ? 'text-gray-300' : 'text-gray-800'} mb-3`}>Summary</h4>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-base leading-relaxed`}>{summaryData.summary || 'No summary available'}</p>
              </div>

              {/* Key Points Flow */}
              <div>
                <h4 className={`font-medium text-lg ${darkMode ? 'text-gray-300' : 'text-gray-800'} mb-4`}>Key Points</h4>
                <div className="space-y-4">
                  {summaryData.keyPoints?.map((point: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`min-w-10 h-10 flex items-center justify-center ${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-600'} rounded-full shadow-md`}>
                        {index + 1}
                      </div>
                      <div className={`flex-1 p-4 ${darkMode ? 'bg-gray-800/70' : 'bg-gray-50'} rounded-xl shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md`}>
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{point}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className={`text-lg ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No summary data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-[calc(100vh-4rem)] ${darkMode ? 'bg-gray-900' : 'bg-[hsl(var(--finance-background))]'} relative transition-colors duration-300`}>
      {/* Redirect Overlay */}
      {shouldRedirect && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md text-center">
            <DollarSign className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Redirecting to Financial Literacy Tools</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              You'll be redirected to our interactive financial tools in {redirectCountdown} seconds...
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => {
                  window.open('/financial-literacy', '_blank');
                  setShouldRedirect(false);
                }}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Go Now
              </button>
              <button 
                onClick={() => {
                  setShouldRedirect(false);
                  setRedirectCountdown(0);
                }}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Panel Overlay */}
      <div className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-500 z-40 ${
        isSummaryOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <SummaryPanel />
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`p-4 ${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'} text-white shadow-lg backdrop-filter backdrop-blur-lg`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Financial Advisor</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                title={darkMode ? "Light Mode" : "Dark Mode"}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => {
                  setIsSummaryOpen(true);
                  generateSummary();
                }}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                title="View Financial Summary"
              >
                <BarChart className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  setIsVisualizing(!isVisualizing);
                  if (!visualizationData) generateVisualization();
                }}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                title="View Financial Visualization"
              >
                <PieChart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        {!selectedLanguage ? (
          <div className={`flex flex-col items-center justify-center flex-1 p-6 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-50 to-blue-50'}`}>
            <div className={`w-24 h-24 mb-8 flex items-center justify-center rounded-full ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} shadow-lg`}>
              <DollarSign className={`w-12 h-12 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-gray-200' : 'text-gray-800'} tracking-tight text-center`}>Select Your Preferred Language</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-2xl">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-5 ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-400'} border rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                >
                  <span className={`text-lg ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Chat Messages */}
              <div 
                ref={chatContainerRef}
                className={`flex-1 overflow-y-auto p-5 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-300`}
                style={{ scrollbarWidth: 'thin', scrollbarColor: darkMode ? '#4B5563 #1F2937' : '#CBD5E0 transparent' }}
              >
                <div className="max-w-3xl mx-auto space-y-6 pb-4">
                  {messages.map((msg, index) => (
                    <ChatMessage 
                      key={index} 
                      message={msg} 
                     
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              
              {/* Visualization Panel (if active) */}
              {isVisualizing && visualizationData && (
                <div className="p-4 bg-white border-t border-gray-200 overflow-y-auto max-h-[40vh]">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Financial Insights</h3>
                      <button 
                        onClick={() => setIsVisualizing(false)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </button>
                    </div>
                    <VisualizationPanel />
                  </div>
                </div>
              )}

              {/* Status Bar */}
              <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} transition-colors duration-300`}>
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <Headphones className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-[hsl(var(--finance-primary))]'} animate-pulse`} />
                        <span className={darkMode ? 'text-gray-300' : ''}>Processing your request...</span>
                      </div>
                    ) : isRecording ? (
                      <div className="flex items-center gap-2">
                        <Mic className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-[hsl(var(--finance-primary))]'} animate-bounce`} />
                        <span className={darkMode ? 'text-gray-300' : ''}>Listening...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ChevronDown className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-[hsl(var(--finance-primary))]'}`} />
                        <span className={darkMode ? 'text-gray-300' : ''}>Ready to assist</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => isRecording ? null : startRecording()}
                    disabled={isProcessing || isTTSPlaying}
                    className={`p-3 rounded-full ${
                      isRecording 
                        ? 'bg-red-500 text-white' 
                        : darkMode ? 'bg-blue-600 text-white' : 'bg-[hsl(var(--finance-primary))] text-white'
                    } disabled:opacity-50 hover:opacity-90 transition-opacity shadow-md`}
                    title={isRecording ? 'Recording...' : 'Start Recording'}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 