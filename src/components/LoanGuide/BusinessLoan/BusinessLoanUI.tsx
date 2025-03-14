'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { generateTTS } from '@/utils/tts';
import { transcribeAudio } from '@/utils/stt';
import { BUSINESS_LOAN_STEPS } from '@/components/LoanGuide/data';
import { Mic, Loader2, CheckCircle, ArrowRight, XCircle } from 'lucide-react';

const businessLoanImages = [
  '/images/personal-loan-1.jpg',
  '/images/business-loan-1.jpg',
  '/images/business-loan-1.jpg',
];

export default function BusinessLoanUI({ language }: { language: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<{step: string, response: string, understood: boolean}[]>([]);
  const [status, setStatus] = useState<'idle' | 'reading' | 'recording' | 'transcribing' | 'checking' | 'completed'>('idle');
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(8);
  const [processCompleted, setProcessCompleted] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isProcessingRef = useRef<boolean>(false);

  const steps = BUSINESS_LOAN_STEPS[language as keyof typeof BUSINESS_LOAN_STEPS] || BUSINESS_LOAN_STEPS.en;

  const stopCurrentAudio = () => {
    // Stop all audio elements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.pause();
    });
    setIsAudioPlaying(false);
  };

  const checkUnderstanding = async (step: string, response: string): Promise<boolean> => {
    if (!isMountedRef.current) return false;
    
    try {
      setStatus('checking');
      const res = await fetch('/api/check-understanding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step,
          response,
          language
        }),
      });
      
      const data = await res.json();
      return data.understanding === 'yes';
    } catch (error) {
      console.error('Error checking understanding:', error);
      return false;
    }
  };

  const playAudioAndWait = async (text: string): Promise<void> => {
    if (isAudioPlaying || !isMountedRef.current) return;
    
    setIsAudioPlaying(true);
    setStatus('reading');
    
    try {
      // Stop any existing audio first
      stopCurrentAudio();
      
      // Play the audio
      await generateTTS(language, text);
      
      // Calculate approximate duration based on text length
      const estimatedDuration = Math.max(2000, text.length * 80);
      
      // Wait for estimated duration
      await new Promise(resolve => {
        if (!isMountedRef.current) resolve(null);
        setTimeout(resolve, estimatedDuration);
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      if (isMountedRef.current) {
        setIsAudioPlaying(false);
      }
    }
  };

  const processSteps = async () => {
    if (isProcessingRef.current || !isMountedRef.current) return;
    isProcessingRef.current = true;

    try {
      for (let i = 0; i < steps.length; i++) {
        if (!isMountedRef.current) break;
        
        setCurrentStep(i);
        let understood = false;
        
        while (!understood && isMountedRef.current) {
          // Read the step title
          await playAudioAndWait(steps[i].title);
          
          // Wait between title and description
          if (!isMountedRef.current) break;
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Read the description
          if (!isMountedRef.current) break;
          await playAudioAndWait(steps[i].description);
          
          // Wait before recording
          if (!isMountedRef.current) break;
          await new Promise(resolve => setTimeout(resolve, 1200));
          
          // Start recording
          if (!isMountedRef.current) break;
          const response = await recordResponse();
          const currentResponse = response || "(No response detected)";
          
          // Check understanding
          if (!isMountedRef.current) break;
          setStatus('checking');
          const isUnderstood = await checkUnderstanding(steps[i].title, currentResponse);
          
          // Store the response
          if (isMountedRef.current) {
            setResponses(prev => [...prev, {
              step: steps[i].title,
              response: currentResponse,
              understood: isUnderstood
            }]);
            
            understood = isUnderstood;
            
            if (!isUnderstood) {
              // If not understood, repeat the step
              await playAudioAndWait("Let's go through this step again to make sure it's clear.");
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
      }
      
      if (isMountedRef.current) {
        setProcessCompleted(true);
        setStatus('completed');
      }
    } finally {
      isProcessingRef.current = false;
    }
  };

  const recordResponse = async (): Promise<string | null> => {
    if (!isMountedRef.current) return null;
    
    try {
      setStatus('recording');
      setRecordingTimeLeft(8);
      
      // Make sure any previous recordings are stopped
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
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
      
      // Start recording
      mediaRecorder.start();
      
      // Set up countdown timer
      let timeLeft = 8;
      setRecordingTimeLeft(timeLeft);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = setInterval(() => {
        if (!isMountedRef.current && timerRef.current) {
          clearInterval(timerRef.current);
          return;
        }
        
        timeLeft -= 1;
        setRecordingTimeLeft(timeLeft);
        
        if (timeLeft <= 0 && timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          
          if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }
      }, 1000);
      
      // Wait for recording to complete
      const transcript = await new Promise<string | null>((resolve) => {
        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach(track => track.stop());
          
          if (!isMountedRef.current) {
            resolve(null);
            return;
          }
          
          setStatus('transcribing');
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          
          try {
            const result = await transcribeAudio(audioBlob, language);
            resolve(result.transcript);
          } catch (error) {
            console.error('Transcription error:', error);
            resolve(null);
          }
        };
        
        // Backup timeout
        setTimeout(() => {
          if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 8500);
      });
      
      return transcript;
    } catch (error) {
      console.error('Recording error:', error);
      return null;
    }
  };

  const resetSession = () => {
    stopCurrentAudio();
    setCurrentStep(0);
    setResponses([]);
    setStatus('idle');
    setProcessCompleted(false);
    
    // Start the process again
    setTimeout(() => {
      processSteps();
    }, 500);
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    if (language) {
      processSteps();
    }
    
    return () => {
      isMountedRef.current = false;
      stopCurrentAudio();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [language]);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === businessLoanImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? businessLoanImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Side - Image Slider and Application Form */}
      <div className="space-y-8">
        {/* Image Slider */}
        <div className="relative">
          <Image
            src={businessLoanImages[currentImageIndex]}
            alt="Business Loan"
            width={600}
            height={400}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white/75"
          >
            &lt;
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white/75"
          >
            &gt;
          </button>
          {/* Image Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {businessLoanImages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
          </div>
      </div>

      {/* Right Side */}
      <div className="space-y-8">
        {/* Steps Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Business Loan Process</h3>
          
          {/* Only show current step */}
          {currentStep < steps.length && !processCompleted && (
            <div className="p-4 rounded-lg bg-blue-50">
              <h4 className="font-medium">{steps[currentStep].title}</h4>
              <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
              
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  {status === 'idle' && (
                    <>
                      <span className="text-sm">Starting process...</span>
                    </>
                  )}
                  {status === 'reading' && (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span className="text-sm">Reading instructions...</span>
                    </>
                  )}
                  {status === 'recording' && (
                    <>
                      <Mic className="text-red-500 animate-pulse" size={20} />
                      <span className="text-sm">Recording ({recordingTimeLeft}s)</span>
                    </>
                  )}
                  {status === 'transcribing' && (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span className="text-sm">Transcribing your response...</span>
                    </>
                  )}
                  {status === 'checking' && (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span className="text-sm">Checking understanding...</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Show completion message when all steps are done */}
          {processCompleted && (
            <div className="p-4 rounded-lg bg-green-50">
              <h4 className="font-medium">Process Completed!</h4>
              <p className="text-sm text-gray-600">
                Thank you for completing all the steps of the business loan process.
              </p>
              <button
                onClick={resetSession}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
              >
                Start Again <ArrowRight className="ml-2" size={16} />
              </button>
            </div>
          )}
          
          {/* Progress indicator */}
          <div className="mt-4 flex">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`h-2 flex-1 mx-0.5 rounded-full ${
                  index < currentStep ? 'bg-green-500' : 
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Responses Section */}
        {responses.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Your Responses</h3>
            <div className="space-y-4">
              {responses.map((response, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">{response.step}</h4>
                  <div className="flex items-start">
                    {response.understood ? (
                      <CheckCircle className="text-green-500 mr-2 mt-1" size={16} />
                    ) : (
                      <XCircle className="text-red-500 mr-2 mt-1" size={16} />
                    )}
                    <p className="text-sm text-gray-600">{response.response}</p>
            </div>
            </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 