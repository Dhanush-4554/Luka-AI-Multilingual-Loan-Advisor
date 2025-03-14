'use client';
import { useState, useEffect, useRef } from 'react';
import { generateTTS } from '@/utils/tts';
import { transcribeAudio } from '@/utils/stt';
import { Mic, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { LANGUAGES, WELCOME_MESSAGES, QUESTIONS } from '@/components/LoanGuide/data';
import { useRouter } from 'next/navigation';

export default function LoanGuide() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{question: string, answer: string}[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  
  // State for UI feedback
  const [status, setStatus] = useState<'idle' | 'reading' | 'recording' | 'transcribing'>('idle');
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(8);
  
  // Refs for media handling
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Handle language selection and start the process
  const handleLanguageSelect = async (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setCurrentQuestionIndex(0);
    setResponses([]);
    setShowSummary(false);
    setStatus('idle');
    
    // Wait a moment before starting the welcome message
    setTimeout(() => {
      startFlowProcess(languageCode);
    }, 500);
  };

  // Main process controller
  const startFlowProcess = async (language: string) => {
    try {
      // Play welcome message
      setStatus('reading');
      await playTTS(language, WELCOME_MESSAGES[language as keyof typeof WELCOME_MESSAGES]);
      
      // Start the first question after a short delay
      setTimeout(() => {
        processQuestion(language, 0);
      }, 1000);
    } catch (error) {
      console.error('Error starting flow:', error);
      setStatus('idle');
    }
  };

  // Process a single question (play, record, transcribe)
  const processQuestion = async (language: string, questionIndex: number) => {
    if (!language || questionIndex >= QUESTIONS[language as keyof typeof QUESTIONS].length) {
      setShowSummary(true);
      setStatus('idle');
      return;
    }
    
    try {
      // 1. Play the question
      setStatus('reading');
      const questionText = QUESTIONS[language as keyof typeof QUESTIONS][questionIndex];
      await playTTS(language, questionText);
      
      // 2. Wait a moment, then start recording
      setTimeout(async () => {
        // Start recording
        setStatus('recording');
        setRecordingTimeLeft(8);
        await startRecording(language, questionIndex);
      }, 500);
    } catch (error) {
      console.error(`Error processing question ${questionIndex}:`, error);
      setStatus('idle');
    }
  };

  // Play TTS and wait for it to complete
  const playTTS = async (language: string, text: string): Promise<void> => {
    try {
      await generateTTS(language, text);
      
      // Estimate duration based on text length (100ms per character, minimum 1.5s)
      const estimatedDuration = Math.max(1500, text.length * 100);
      
      return new Promise((resolve) => {
        setTimeout(resolve, estimatedDuration);
      });
    } catch (error) {
      console.error('TTS error:', error);
      throw error;
    }
  };

  // Start recording function
  const startRecording = async (language: string, questionIndex: number): Promise<void> => {
    try {
      // Clean up any existing recorder
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current = null;
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Get audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Setup data collection
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Handle recording completion
      mediaRecorder.onstop = async () => {
        try {
          await processRecording(language, questionIndex);
        } catch (error) {
          console.error('Error processing recording:', error);
          
          // Move to next question even if there's an error
          moveToNextQuestion(language, questionIndex);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      
      // Set up countdown timer
      let timeLeft = 8;
      setRecordingTimeLeft(timeLeft);
      
      timerRef.current = setInterval(() => {
        timeLeft -= 1;
        setRecordingTimeLeft(timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          timerRef.current = null;
          
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
        }
      }, 1000);
      
      // Set backup timer to ensure recording stops
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          clearInterval(timerRef.current as NodeJS.Timeout);
          timerRef.current = null;
          mediaRecorderRef.current.stop();
        }
      }, 8500); // slightly longer than our countdown to ensure it triggers
      
      return new Promise((resolve) => {
        setTimeout(resolve, 8000); // This resolves after expected recording duration
      });
    } catch (error) {
      console.error('Recording error:', error);
      // Move to next question even if recording fails
      moveToNextQuestion(language, questionIndex);
      throw error;
    }
  };
  
  // Process the recording (transcribe and store)
  const processRecording = async (language: string, questionIndex: number): Promise<void> => {
    if (audioChunksRef.current.length === 0) {
      moveToNextQuestion(language, questionIndex);
      return;
    }
    
    setStatus('transcribing');
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      
      // Send to Sarvam AI for transcription
      const result = await transcribeAudio(audioBlob, language);
      
      // Store the response
      const questionText = QUESTIONS[language as keyof typeof QUESTIONS][questionIndex];
      setResponses(prev => [...prev, {
        question: questionText,
        answer: result.transcript || "(No response detected)"
      }]);
      
      // Clean up audio tracks
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      // Move to next question
      moveToNextQuestion(language, questionIndex);
    } catch (error) {
      console.error('Transcription error:', error);
      // Move to next question even if transcription fails
      moveToNextQuestion(language, questionIndex);
    }
  };
  
  // Move to the next question or finish
  const moveToNextQuestion = (language: string, currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    
    // Check if we're done with all questions
    if (nextIndex >= QUESTIONS[language as keyof typeof QUESTIONS].length) {
      setShowSummary(true);
      setStatus('idle');
      return;
    }
    
    // Move to next question
    setCurrentQuestionIndex(nextIndex);
    
    // Start next question after a brief delay
    setTimeout(() => {
      processQuestion(language, nextIndex);
    }, 1000);
  };
  
  // Reset the process
  const resetQuestions = () => {
    if (selectedLanguage) {
      setCurrentQuestionIndex(0);
      setResponses([]);
      setShowSummary(false);
      setStatus('idle');
      
      setTimeout(() => {
        startFlowProcess(selectedLanguage);
      }, 500);
    }
  };
  
  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Get status text for display
  const getStatusText = () => {
    switch (status) {
      case 'reading':
        return 'Reading question...';
      case 'recording':
        return `Recording (${recordingTimeLeft}s)`;
      case 'transcribing':
        return 'Transcribing...';
      default:
        return selectedLanguage ? 'Processing...' : 'Select a language';
    }
  };

  // Update the predictLoanType function to include language in the URL
  const predictLoanType = async () => {
    try {
      setStatus('transcribing');
      
      const response = await fetch('/api/predict-loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: responses
        }),
      });

      const data = await response.json();
      
      if (data.loanType) {
        // Include the selected language in the URL
        router.push(`/loan-guide/${data.loanType}?lang=${selectedLanguage}`);
      } else {
        throw new Error('No loan type received');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      setStatus('idle');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Loan Guide</h1>
      
      {!selectedLanguage ? (
        <div className="mt-4">
          <h2 className="text-lg mb-4">Please select your preferred language:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className="p-4 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      ) : !showSummary ? (
        <div className="mt-4 space-y-6">
          {/* Progress indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${((currentQuestionIndex) / QUESTIONS[selectedLanguage as keyof typeof QUESTIONS].length) * 100}%` }}
            ></div>
          </div>
          
          {/* Current question */}
          <div className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <p className="text-lg font-medium">Question {currentQuestionIndex + 1} of {QUESTIONS[selectedLanguage as keyof typeof QUESTIONS].length}</p>
            </div>
            <p className="text-xl">
              {QUESTIONS[selectedLanguage as keyof typeof QUESTIONS][currentQuestionIndex]}
            </p>
          </div>
          
          {/* Status indicator */}
          <div className="flex flex-col items-center py-4">
            <div className="flex items-center space-x-2 mb-4">
              {status === 'reading' && <Loader2 className="animate-spin" size={24} />}
              {status === 'recording' && <Mic className="text-red-500 animate-pulse" size={24} />}
              {status === 'transcribing' && <Loader2 className="animate-spin" size={24} />}
              <span className="font-medium">{getStatusText()}</span>
            </div>
            
            {status === 'recording' && (
              <div className="w-16 h-16 relative flex items-center justify-center">
                <div className="absolute w-full h-full rounded-full bg-red-500 opacity-25 animate-ping"></div>
                <div className="absolute w-12 h-12 rounded-full bg-red-500 opacity-50"></div>
                <Mic className="text-white z-10" size={24} />
              </div>
            )}
          </div>
          
          {/* Previous responses */}
          {responses.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="font-medium">Previous Responses:</h3>
              <div className="space-y-2">
                {responses.map((response, index) => (
                  index === responses.length - 1 && (
                    <div key={index} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                      <p className="font-medium">{response.question}</p>
                      <div className="flex items-start mt-1">
                        <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                        <p>{response.answer}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Summary table
        <div className="space-y-6">
          <h3 className="text-xl font-medium">Summary of Your Responses</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border p-2 text-left">Question</th>
                  <th className="border p-2 text-left">Your Response</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response, index) => (
                  <tr key={index} className="border-b">
                    <td className="border p-2 font-medium">{response.question}</td>
                    <td className="border p-2">{response.answer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={resetQuestions}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2"
            >
              Start Over
              <ArrowRight size={16} />
            </button>
            <button
              onClick={predictLoanType}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
              disabled={status === 'transcribing'}
            >
              {status === 'transcribing' ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Predicting...
                </>
              ) : (
                'Predict Loan Type'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}