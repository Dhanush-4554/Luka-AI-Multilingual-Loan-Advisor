'use client';
import { useState, useEffect, useRef } from 'react';
import { Mic, Headphones, MessageCircle, ChevronDown, ArrowRight, Check, AlertCircle, Loader, Globe } from 'lucide-react';
import { LANGUAGES, WELCOME_MESSAGES } from '@/components/LoanGuide/data';
import { transcribeAudio } from '@/utils/stt';
import { generateLoanGuidance, detectLoanTypeWithAI, checkUnderstandingWithAI } from '@/utils/loanGuidance';

// Define message type
export type Message = {
  text: string;
  sender: 'user' | 'agent';
  step?: number;
  loanType?: string;
};

// Define loan types
const LOAN_TYPES = [
  { id: 'home', name: 'Home Loan' },
  { id: 'personal', name: 'Personal Loan' },
  { id: 'business', name: 'Business Loan' },
  { id: 'education', name: 'Education Loan' },
  { id: 'vehicle', name: 'Vehicle Loan' },
];

export default function LoanGuidanceAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loanType, setLoanType] = useState<string | null>(null);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [processingStage, setProcessingStage] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize audio context
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    }
  };

  // Start conversation when language is selected
  useEffect(() => {
    if (selectedLanguage) {
      startConversation();
    }
  }, [selectedLanguage]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Start the conversation
  const startConversation = async () => {
    try {
      setIsProcessing(true);
      setProcessingStage('Initializing');
      
      // Get greeting in selected language
      const greeting = WELCOME_MESSAGES[selectedLanguage as keyof typeof WELCOME_MESSAGES] || 
        "Hello! I'm your loan guidance agent. What type of loan are you interested in applying for? I can help with home loans, personal loans, business loans, education loans, or vehicle loans.";
      
      setMessages(prev => [...prev, { text: greeting, sender: 'agent' }]);
      
      await playTTS(selectedLanguage!, greeting);
      startRecording();
      
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setIsProcessing(false);
      setProcessingStage(null);
    }
  };

  // Start recording audio
  const startRecording = async () => {
    if (isTTSPlaying) return; // Don't start recording if TTS is playing
    
    try {
      initAudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Connect audio stream to analyser
      if (audioContextRef.current && analyserRef.current) {
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Set timeout for automatic stop
      recordingTimeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 10000); // 10 seconds max recording time

    } catch (error) {
      console.error('Error starting recording:', error);
      // Fallback to text input if recording fails
      const fallbackMessage = "I couldn't access your microphone. Please type your response instead.";
      setMessages(prev => [...prev, { text: fallbackMessage, sender: 'agent' }]);
    }
  };

  // Process recorded audio
  const processAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      setProcessingStage('Transcribing');
      
      const sttResponse = await transcribeAudio(audioBlob, selectedLanguage!);
      
      if (sttResponse?.transcript) {
        setMessages(prev => [...prev, { text: sttResponse.transcript, sender: 'user' }]);
        await processUserMessage(sttResponse.transcript);
      } else {
        // If no transcript, prompt user to try again
        const retryMessage = "I'm sorry, I couldn't hear you clearly. Could you please try again?";
        setMessages(prev => [...prev, { text: retryMessage, sender: 'agent' }]);
        await playTTS(selectedLanguage!, retryMessage);
        startRecording();
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      const errorMessage = "I'm sorry, there was an error processing your audio. Let's try again.";
      setMessages(prev => [...prev, { text: errorMessage, sender: 'agent' }]);
      await playTTS(selectedLanguage!, errorMessage);
      startRecording();
    } finally {
      setIsProcessing(false);
      setProcessingStage(null);
    }
  };

  // Process user message
  const processUserMessage = async (message: string) => {
    try {
      setIsProcessing(true);
      setProcessingStage('Processing');
      
      // If loan type is not set, try to determine it from the message using AI
      if (!loanType) {
        setProcessingStage('Detecting loan type');
        const detectedLoanType = await detectLoanTypeWithAI(message, selectedLanguage!);
        
        if (detectedLoanType) {
          setLoanType(detectedLoanType);
          await handleLoanTypeSelection(detectedLoanType);
          return;
        } else {
          // If loan type not detected, ask again
          const clarificationMessage = "I'm not sure which type of loan you're interested in. Could you please specify if you're looking for a home loan, personal loan, business loan, education loan, or vehicle loan?";
          setMessages(prev => [...prev, { text: clarificationMessage, sender: 'agent' }]);
          await playTTS(selectedLanguage!, clarificationMessage);
          startRecording();
          return;
        }
      }
      
      // Handle response based on current step
      setProcessingStage('Generating response');
      const response = await generateLoanGuidance(loanType, currentStep, message, selectedLanguage!);
      
      // Check if user understood and wants to proceed using AI
      setProcessingStage('Checking understanding');
      const understood = await checkUnderstandingWithAI(message, selectedLanguage!);
      
      if (understood) {
        // Move to next step if user understood
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        
        setMessages(prev => [...prev, { 
          text: response, 
          sender: 'agent',
          step: nextStep,
          loanType: loanType
        }]);
        
        await playTTS(selectedLanguage!, response);
      } else {
        // Repeat current step with more details if user didn't understand
        const clarificationResponse = await generateLoanGuidance(loanType, currentStep, "I need more details", selectedLanguage!);
        
        setMessages(prev => [...prev, { 
          text: `Let me explain that again. ${clarificationResponse}`, 
          sender: 'agent',
          step: currentStep,
          loanType: loanType
        }]);
        
        await playTTS(selectedLanguage!, `Let me explain that again. ${clarificationResponse}`);
      }
      
      // Start recording again after response
      startRecording();
      
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = "I'm sorry, there was an error processing your request. Let's try again.";
      setMessages(prev => [...prev, { text: errorMessage, sender: 'agent' }]);
      await playTTS(selectedLanguage!, errorMessage);
      startRecording();
    } finally {
      setIsProcessing(false);
      setProcessingStage(null);
    }
  };

  // Handle loan type selection
  const handleLoanTypeSelection = async (selectedLoanType: string) => {
    setLoanType(selectedLoanType);
    setCurrentStep(1); // Move to first step
    
    // Get initial guidance for the selected loan type
    const initialGuidance = await generateLoanGuidance(selectedLoanType, 1, "", selectedLanguage!);
    
    const confirmationMessage = `Great! You've selected a ${getLoanTypeName(selectedLoanType)}. Let's start the application process. ${initialGuidance}`;
    
    setMessages(prev => [...prev, { 
      text: confirmationMessage, 
      sender: 'agent',
      step: 1,
      loanType: selectedLoanType
    }]);
    
    await playTTS(selectedLanguage!, confirmationMessage);
    startRecording();
  };

  // Play text-to-speech
  const playTTS = async (languageCode: string, text: string) => {
    try {
      setIsTTSPlaying(true);
      
      // Stop recording if it's active
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
      
      // Split text into sentences or chunks of max 200 characters
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

      // Process each chunk sequentially
      for (const chunk of chunks) {
        try {
          const response = await fetch('https://api.sarvam.ai/text-to-speech', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-subscription-key': '05ca5a88-9265-4e62-a25a-507687a900d3',
            },
            body: JSON.stringify({
              inputs: [chunk],
              target_language_code: languageCode,
              speaker: 'meera',
              pace: 1.0,
              loudness: 1.0,
            }),
          });

          if (!response.ok) {
            throw new Error(`TTS API error: ${response.status}`);
          }

          const data = await response.json();
          if (data.audios && data.audios.length > 0) {
            const audio = new Audio(`data:audio/wav;base64,${data.audios[0]}`);
            
            // Wait for this chunk to finish playing
            await new Promise<void>((resolve) => {
              audio.play().catch(err => {
                console.error('Error playing audio:', err);
                resolve(); // Continue even if audio fails
              });
              audio.onended = () => resolve();
            });
          }
        } catch (error) {
          console.error('Error with TTS chunk:', error);
          // Continue with next chunk even if one fails
        }
      }
    } catch (error) {
      console.error('Error generating TTS:', error);
    } finally {
      setIsTTSPlaying(false);
    }
  };

  // Get loan type name from ID
  const getLoanTypeName = (loanTypeId: string): string => {
    const loanType = LOAN_TYPES.find(type => type.id === loanTypeId);
    return loanType ? loanType.name : 'Loan';
  };

  // Handle text input for fallback
  const handleTextInput = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.elements.namedItem('userInput') as HTMLInputElement;
    const message = input.value.trim();
    
    if (message) {
      setMessages(prev => [...prev, { text: message, sender: 'user' }]);
      processUserMessage(message);
      input.value = '';
    }
  };

  // Render chat message
  const ChatMessage = ({ message }: { message: Message }) => {
    const isAgent = message.sender === 'agent';
    
    return (
      <div className={`flex ${isAgent ? 'justify-start' : 'justify-end'} mb-4`}>
        <div className={`max-w-[80%] p-3 rounded-lg ${
          isAgent 
            ? 'bg-blue-50 text-gray-800 rounded-tl-none' 
            : 'bg-blue-500 text-white rounded-tr-none'
        }`}>
          {message.step && message.loanType && isAgent && (
            <div className="mb-1 text-xs font-medium text-blue-600">
              {getLoanTypeName(message.loanType)} - Step {message.step}
            </div>
          )}
          <p className="text-sm">{message.text}</p>
        </div>
      </div>
    );
  };

  // Render processing indicator
  const ProcessingIndicator = () => (
    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 h-10">
      {processingStage && (
        <>
          <Loader className="w-4 h-4 text-blue-500 animate-spin" />
          <span>{processingStage}...</span>
        </>
      )}
    </div>
  );

  // Get language name from code
  const getLanguageName = (code: string): string => {
    const language = LANGUAGES.find(lang => lang.code === code);
    return language ? language.name : 'Unknown';
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Language Selection */}
      {!selectedLanguage ? (
        <div className="flex flex-col items-center justify-center h-full p-6">
          <Globe className="w-12 h-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Select your preferred language</h2>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="text-gray-700">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Selected Language Indicator */}
          <div className="bg-blue-50 p-2 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-700">{getLanguageName(selectedLanguage)}</span>
            </div>
            <button 
              onClick={() => setSelectedLanguage(null)}
              className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              Change
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Text Input Fallback */}
          <form onSubmit={handleTextInput} className="p-2 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="userInput"
                placeholder="Type your message here..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isProcessing || isTTSPlaying}
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
                disabled={isProcessing || isTTSPlaying}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Status Bar */}
          <div className="p-2 border-t border-gray-200 bg-white">
            {isProcessing ? (
              <ProcessingIndicator />
            ) : isRecording ? (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 h-10">
                <Mic className="w-4 h-4 text-red-500 animate-pulse" />
                <span>Listening...</span>
              </div>
            ) : isTTSPlaying ? (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 h-10">
                <Headphones className="w-4 h-4 text-blue-500 animate-pulse" />
                <span>Speaking...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 h-10">
                <ChevronDown className="w-4 h-4 text-blue-500" />
                <span>Ready to assist</span>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          {loanType && (
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Application Progress</span>
                <span className="text-xs text-gray-500">Step {currentStep} of 8</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / 8) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 