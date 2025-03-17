"use client";

import React, { useState, useRef, useEffect } from 'react';
import { transcribeAudio } from '@/utils/stt';
import { translateText } from '@/utils/translate';
import { generateTTS } from '@/utils/tts';
import { Mic, MicOff, Loader2, Volume2, RefreshCw, VolumeX, Activity, Send, AlertTriangle } from 'lucide-react';

export default function VoiceAssistant() {
  // States
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translatedInput, setTranslatedInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [translatedResponse, setTranslatedResponse] = useState('');
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsError, setTtsError] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeechDetected, setIsSpeechDetected] = useState(false);
  const [consecutiveSilenceFrames, setConsecutiveSilenceFrames] = useState(0);
  const [customSilenceThreshold, setCustomSilenceThreshold] = useState(10);
  const [customSpeechThreshold, setCustomSpeechThreshold] = useState(25);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const silenceFramesRef = useRef<number>(0); // Direct ref to track silence frames

  // Constants
  const SILENCE_THRESHOLD = customSilenceThreshold;
  const SPEECH_THRESHOLD = customSpeechThreshold;
  const SILENCE_DURATION = 4000; // 4 seconds of silence to trigger processing
  const MIN_RECORDING_DURATION = 500;
  const MAX_RECORDING_DURATION = 30000; // Reduced to 30 seconds max
  const CONSECUTIVE_SILENCE_FRAMES_THRESHOLD = 240; // About 4 seconds at 60fps
  const BLOCK_LISTENING_DURING_PROCESSING = true; // Always block listening during processing
  const DEBUG_SILENCE_DETECTION = true; // Enable more verbose logging for silence detection

  // Initialize and clean up audio processing
  useEffect(() => {
    return () => {
      // Clean up on component unmount
      stopListening();
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Start automatic listening
  useEffect(() => {
    // Auto-start listening when component mounts
    startListening();
    
    return () => {
      stopListening();
    };
  }, []);

  // Monitor silence frames and trigger processing when threshold is reached
  useEffect(() => {
    // Only run this check if we're listening and speech has been detected
    if (isListening && isSpeechDetected && !isProcessing && !isSpeaking) {
      const silenceMonitorInterval = setInterval(() => {
        // Check if we've reached the silence threshold
        if (silenceFramesRef.current >= CONSECUTIVE_SILENCE_FRAMES_THRESHOLD) {
          console.log(`Silence monitor detected ${silenceFramesRef.current} frames of silence, processing...`);
          processCurrentRecording();
        } else if (silenceFramesRef.current > 0) {
          // Log progress if we have some silence
          console.log(`Silence monitor: ${silenceFramesRef.current} frames, ${(silenceFramesRef.current / 60).toFixed(1)}s of silence`);
        }
      }, 500); // Check every 500ms
      
      return () => clearInterval(silenceMonitorInterval);
    }
  }, [isListening, isSpeechDetected, isProcessing, isSpeaking]);

  // Start listening function
  const startListening = async () => {
    // Don't start listening if we're processing or speaking
    if (isProcessing || isSpeaking) {
      console.log("Cannot start listening while processing or speaking");
      return;
    }

    try {
      // Reset states
      setError('');
      resetConversation();
      
      // Get audio stream with specific constraints for better quality
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1
        } 
      });
      
      streamRef.current = stream;
      
      // Set up audio analysis for speech detection
      setupAudioAnalysis(stream);
      
      // Create media recorder with standard MIME type
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/webm' };
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up data collection
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Set up stop handler
      mediaRecorder.onstop = handleRecordingStop;
      
      // Start recording
      audioChunksRef.current = [];
      mediaRecorder.start(100); // Collect data every 100ms
      setIsListening(true);
      
      // Start duration timer
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1;
          // Auto-stop if recording for too long
          if (newDuration * 1000 >= MAX_RECORDING_DURATION) {
            console.log("Max recording duration reached, processing...");
            processCurrentRecording();
          }
          return newDuration;
        });
      }, 1000);
      
    } catch (err) {
      console.error('Error starting listening:', err);
      setError('Could not access microphone. Please check permissions.');
    }
  };

  // Set up audio analysis for speech detection
  const setupAudioAnalysis = (stream: MediaStream) => {
    try {
      // Create audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      // Create analyser node
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      // Create source from stream
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      // Set up data array for analysis
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      // Start analyzing audio
      analyzeAudio();
    } catch (err) {
      console.error('Error setting up audio analysis:', err);
    }
  };

  // Analyze audio for speech detection
  const analyzeAudio = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    
    // Get audio data
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Calculate average level
    const average = dataArrayRef.current.reduce((acc, val) => acc + val, 0) / dataArrayRef.current.length;
    setAudioLevel(average);
    
    // Debug audio levels (reduce logging frequency)
    if (DEBUG_SILENCE_DETECTION && Math.random() < 0.1) { // Increased logging frequency for debugging
      console.log(`Audio level: ${average.toFixed(2)}, Speech detected: ${isSpeechDetected}, Silence frames: ${silenceFramesRef.current}, Silence threshold: ${SILENCE_THRESHOLD}`);
    }
    
    // Detect speech or silence
    if (average > SPEECH_THRESHOLD && !isSpeechDetected) {
      // Speech detected
      console.log("Speech detected!");
      setIsSpeechDetected(true);
      silenceFramesRef.current = 0;
      setConsecutiveSilenceFrames(0);
      
      // Clear silence timer if it exists
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    } else if (average < SILENCE_THRESHOLD && isSpeechDetected) {
      // Silence after speech detected - CRITICAL PATH FOR PAUSE DETECTION
      console.log(`Silence detected: ${average.toFixed(2)} < ${SILENCE_THRESHOLD}, frame ${silenceFramesRef.current + 1}`);
      
      // Increment silence counter directly using ref to avoid state update delays
      silenceFramesRef.current += 1;
      
      // Update state for UI display
      setConsecutiveSilenceFrames(silenceFramesRef.current);
      
      // Log every 30 frames (about 0.5 second) for better visibility
      if (silenceFramesRef.current % 30 === 0) {
        console.log(`Silence for ${silenceFramesRef.current / 60} seconds (${silenceFramesRef.current} frames)`);
      }
      
      // If we've had enough consecutive silence frames, process the recording
      if (silenceFramesRef.current >= CONSECUTIVE_SILENCE_FRAMES_THRESHOLD && !isProcessing) {
        console.log(`${silenceFramesRef.current} consecutive silence frames detected (about 4 seconds), processing recording`);
        processCurrentRecording();
      }
      
      // Also use the timer as a backup
      if (!silenceTimerRef.current && !isProcessing) {
        console.log("Silence detected, starting 4-second timer...");
        silenceTimerRef.current = setTimeout(() => {
          console.log("4-second silence timer completed, processing recording");
          // Process the recording
          processCurrentRecording();
          silenceTimerRef.current = null;
        }, SILENCE_DURATION);
      }
    } else if (average > SPEECH_THRESHOLD && isSpeechDetected) {
      // Still speaking, reset silence counter
      if (silenceFramesRef.current > 0) {
        console.log(`Still speaking: ${average.toFixed(2)} > ${SPEECH_THRESHOLD}, resetting silence counter from ${silenceFramesRef.current}`);
      }
      silenceFramesRef.current = 0;
      setConsecutiveSilenceFrames(0);
      
      // Clear silence timer if it exists
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    } else if (average < SILENCE_THRESHOLD && !isSpeechDetected) {
      // Still silent before any speech, log occasionally
      if (DEBUG_SILENCE_DETECTION && Math.random() < 0.05) {
        console.log(`Background silence: ${average.toFixed(2)} < ${SILENCE_THRESHOLD}`);
      }
    }
    
    // Continue analyzing
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  };

  // Process current recording
  const processCurrentRecording = () => {
    console.log("Processing current recording...");
    
    // Prevent multiple processing calls
    if (isProcessing) {
      console.log("Already processing, ignoring duplicate call");
      return;
    }
    
    // Set processing state immediately to prevent race conditions
    setIsProcessing(true);
    setIsSpeechDetected(false);
    silenceFramesRef.current = 0;
    setConsecutiveSilenceFrames(0);
    
    // Clear any existing silence timers
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      // Stop the recorder to trigger the handleRecordingStop function
      mediaRecorderRef.current.stop();
      
      // Stop listening completely during processing
      stopListening();
    } else {
      console.log("MediaRecorder not in recording state:", mediaRecorderRef.current?.state);
      // Don't restart listening here - wait until processing is complete
      stopListening();
    }
  };

  // Stop listening function
  const stopListening = () => {
    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Clear timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    // Stop audio analysis
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    setIsListening(false);
    setIsSpeechDetected(false);
  };

  // Handle recording stop
  const handleRecordingStop = async () => {
    console.log("Recording stopped, processing audio...");
    try {
      if (audioChunksRef.current.length === 0) {
        console.log("No audio chunks collected");
        // No audio data, restart listening
        restartListening();
        return;
      }
      
      // Create audio blob
      const originalBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' });
      
      // Create URL for playback
      const url = URL.createObjectURL(originalBlob);
      setAudioUrl(url);
      
      // Check audio size
      const audioSizeKB = originalBlob.size / 1024;
      console.log(`Audio size: ${audioSizeKB.toFixed(2)} KB`);
      
      if (audioSizeKB < 1) {
        console.log("Audio too small, restarting");
        // Audio too short, restart listening
        restartListening();
        return;
      }
      
      // Process the audio
      setIsProcessing(true);
      
      // Convert to WAV for Sarvam API
      try {
        const wavBlob = await convertToWav(originalBlob);
        console.log(`Converted WAV size: ${(wavBlob.size / 1024).toFixed(2)} KB`);
        
        // Process the audio
        await processAudio(wavBlob);
      } catch (conversionError) {
        console.error('Error converting audio:', conversionError);
        setError('Error converting audio format. Please try again.');
        restartListening();
      }
    } catch (err) {
      console.error('Error processing recording:', err);
      setError('Error processing your voice. Please try again.');
      restartListening();
    }
  };

  // Restart listening after processing
  const restartListening = () => {
    console.log("Attempting to restart listening...");
    
    // Don't restart if we're still speaking or processing
    if (isSpeaking || isProcessing) {
      console.log("Still speaking or processing, delaying restart");
      setTimeout(() => restartListening(), 1000);
      return;
    }
    
    // Reset states
    setIsProcessing(false);
    setIsSpeechDetected(false);
    setConsecutiveSilenceFrames(0);
    
    // Small delay to ensure previous resources are cleaned up
    setTimeout(() => {
      console.log("Starting listening again...");
      startListening();
    }, 1000); // Longer delay to ensure cleanup
  };

  // Convert blob to WAV format
  const convertToWav = async (blob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      try {
        // Create an audio context
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext();
        
        // Create a file reader to read the blob
        const fileReader = new FileReader();
        
        fileReader.onload = async (event) => {
          try {
            // Decode the audio data
            const arrayBuffer = event.target?.result as ArrayBuffer;
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            
            // Convert to WAV
            const wavBlob = audioBufferToWav(audioBuffer);
            resolve(new Blob([wavBlob], { type: 'audio/wav' }));
          } catch (error) {
            console.error('Error decoding audio data:', error);
            reject(error);
          }
        };
        
        fileReader.onerror = (error) => {
          console.error('Error reading file:', error);
          reject(error);
        };
        
        fileReader.readAsArrayBuffer(blob);
      } catch (error) {
        console.error('Error in convertToWav:', error);
        reject(error);
      }
    });
  };

  // Convert AudioBuffer to WAV format
  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
    const numOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numOfChannels * 2;
    const sampleRate = buffer.sampleRate;
    
    const wavDataView = new DataView(new ArrayBuffer(44 + length));
    
    // Write WAV header
    writeString(wavDataView, 0, 'RIFF');
    wavDataView.setUint32(4, 36 + length, true);
    writeString(wavDataView, 8, 'WAVE');
    writeString(wavDataView, 12, 'fmt ');
    wavDataView.setUint32(16, 16, true);
    wavDataView.setUint16(20, 1, true); // PCM format
    wavDataView.setUint16(22, numOfChannels, true);
    wavDataView.setUint32(24, sampleRate, true);
    wavDataView.setUint32(28, sampleRate * numOfChannels * 2, true); // Byte rate
    wavDataView.setUint16(32, numOfChannels * 2, true); // Block align
    wavDataView.setUint16(34, 16, true); // Bits per sample
    writeString(wavDataView, 36, 'data');
    wavDataView.setUint32(40, length, true);
    
    // Write audio data
    const channels = [];
    for (let i = 0; i < numOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }
    
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        const int16Sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        wavDataView.setInt16(offset, int16Sample, true);
        offset += 2;
      }
    }
    
    return wavDataView.buffer;
  };

  // Helper function to write strings to DataView
  const writeString = (dataView: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      dataView.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // Process audio function
  const processAudio = async (audioBlob: Blob) => {
    try {
      // Set processing state immediately to prevent multiple processing
      setIsProcessing(true);
      
      // 1. Transcribe audio (Kannada)
      const transcriptionResult = await transcribeAudio(audioBlob, 'kn-IN');
      
      // Save debug info
      setDebugInfo(transcriptionResult);
      
      // Extract transcript from the response (API returns "transcript" not "text")
      const kannadaText = transcriptionResult.transcript || transcriptionResult.text || '';
      setTranscript(kannadaText);
      
      if (!kannadaText || kannadaText.trim() === '') {
        console.log("No transcription detected, restarting listening");
        // No transcription, restart listening
        restartListening();
        return;
      }
      
      // 2. Translate to English
      const translationResult = await translateText({
        input: kannadaText,
        sourceLanguageCode: 'kn-IN',
        targetLanguageCode: 'en-IN'
      }, '47b5a700-2f9e-4e1d-afe0-c46ed9cda77e');
      
      const englishText = translationResult.translated_text;
      setTranslatedInput(englishText);
      
      // 3. Send to OpenAI
      const openAIResponse = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: englishText }),
      });
      
      const openAIData = await openAIResponse.json();
      const englishResponse = openAIData.response;
      setAiResponse(englishResponse);
      
      // 4. Translate back to Kannada
      const backTranslationResult = await translateText({
        input: englishResponse,
        sourceLanguageCode: 'en-IN',
        targetLanguageCode: 'kn-IN'
      }, '47b5a700-2f9e-4e1d-afe0-c46ed9cda77e');
      
      const kannadaResponse = backTranslationResult.translated_text;
      setTranslatedResponse(kannadaResponse);
      
      // 5. Generate TTS for Kannada response
      setIsSpeaking(true);
      setTtsError('');
      try {
        console.log("Starting TTS playback...");
        await generateTTS('kn-IN', kannadaResponse);
        // Add a delay to account for audio playback
        console.log("TTS audio sent, waiting for playback to complete...");
        await new Promise(resolve => setTimeout(resolve, 3000)); // Longer delay for TTS to complete
        console.log("TTS playback complete");
      } catch (ttsErr) {
        console.error('TTS error:', ttsErr);
        setTtsError('Could not play audio response. Please check your audio settings.');
      } finally {
        setIsSpeaking(false);
      }
      
      // Only restart listening after TTS is complete
      console.log("Processing and TTS complete, restarting listening...");
      setIsProcessing(false); // Make sure to set processing to false before restarting
      restartListening();
      
    } catch (err) {
      console.error('Error in processing pipeline:', err);
      setError('An error occurred. Please try again.');
      setIsProcessing(false); // Make sure to set processing to false on error
      restartListening();
    }
  };

  // Reset conversation
  const resetConversation = () => {
    setTranscript('');
    setTranslatedInput('');
    setAiResponse('');
    setTranslatedResponse('');
    setTtsError('');
    
    // Release any existing object URLs
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  // Reset function
  const resetAssistant = () => {
    resetConversation();
    setError('');
    setDebugInfo(null);
    
    // Restart listening
    stopListening();
    startListening();
  };

  // Force reset function
  const forceReset = () => {
    console.log("Forcing complete reset of voice assistant...");
    
    // Stop everything
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.error("Error stopping media recorder:", err);
      }
    }
    
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error("Error stopping tracks:", err);
      }
      streamRef.current = null;
    }
    
    // Clear timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    // Stop audio analysis
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
        audioContextRef.current = null;
      } catch (err) {
        console.error("Error closing audio context:", err);
      }
    }
    
    // Reset all states
    setIsListening(false);
    setIsProcessing(false);
    setIsSpeechDetected(false);
    setConsecutiveSilenceFrames(0);
    resetConversation();
    setError('');
    setDebugInfo(null);
    
    // Wait a bit longer before restarting
    setTimeout(() => {
      console.log("Starting listening after force reset...");
      startListening();
    }, 1500);
  };

  // Render audio level indicator
  const renderAudioLevelIndicator = () => {
    const bars = 10;
    const activeBars = Math.min(Math.floor(audioLevel / 10), bars);
    
    return (
      <div className="flex items-center justify-center gap-0.5 h-6 mb-2">
        {Array.from({ length: bars }).map((_, i) => (
          <div 
            key={i}
            className={`w-1 rounded-full transition-all duration-100 ${
              i < activeBars 
                ? isSpeechDetected 
                  ? 'bg-green-500 h-full' 
                  : 'bg-blue-400 h-full'
                : 'bg-gray-200 h-2'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Voice Assistant</h1>
      
      {/* Current state indicator */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-center text-sm font-semibold mb-2">Current State</h2>
        <div className="flex justify-between items-center">
          <div className={`flex flex-col items-center p-2 rounded ${isListening && !isProcessing && !isSpeaking ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Mic className={`h-5 w-5 ${isListening && !isProcessing && !isSpeaking ? 'text-blue-500' : 'text-gray-400'}`} />
            <span className="text-xs mt-1">Listening</span>
          </div>
          <div className="w-4 h-0.5 bg-gray-200"></div>
          <div className={`flex flex-col items-center p-2 rounded ${isProcessing ? 'bg-yellow-100' : 'bg-gray-100'}`}>
            <Loader2 className={`h-5 w-5 ${isProcessing ? 'text-yellow-500 animate-spin' : 'text-gray-400'}`} />
            <span className="text-xs mt-1">Processing</span>
          </div>
          <div className="w-4 h-0.5 bg-gray-200"></div>
          <div className={`flex flex-col items-center p-2 rounded ${isSpeaking ? 'bg-purple-100' : 'bg-gray-100'}`}>
            <Volume2 className={`h-5 w-5 ${isSpeaking ? 'text-purple-500' : 'text-gray-400'}`} />
            <span className="text-xs mt-1">Speaking</span>
          </div>
        </div>
      </div>
      
      {/* Debug indicator - visible in all environments for troubleshooting */}
      <div className="text-xs bg-gray-100 p-2 rounded mb-4 font-mono">
        <div>Audio level: {audioLevel.toFixed(1)} (Threshold: {SPEECH_THRESHOLD})</div>
        <div>Speech detected: {isSpeechDetected ? 'Yes' : 'No'}</div>
        <div>Processing: {isProcessing ? 'Yes' : 'No'}</div>
        <div>Speaking: {isSpeaking ? 'Yes' : 'No'}</div>
        <div>Listening: {isListening ? 'Yes' : 'No'}</div>
        <div>
          Silence pause: {(consecutiveSilenceFrames / 60).toFixed(1)}s / {(CONSECUTIVE_SILENCE_FRAMES_THRESHOLD / 60).toFixed(1)}s
          {isSpeechDetected && (
            <div className="w-full bg-gray-200 h-1 mt-1 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full" 
                style={{ width: `${(consecutiveSilenceFrames / CONSECUTIVE_SILENCE_FRAMES_THRESHOLD) * 100}%` }}
              />
            </div>
          )}
        </div>
        <div>Recording time: {recordingDuration}s / {MAX_RECORDING_DURATION/1000}s</div>
        
        {/* Threshold adjustment sliders */}
        <div className="mt-2 border-t pt-2 border-gray-200">
          <div className="mb-1">
            <label className="flex justify-between">
              <span>Silence threshold: {customSilenceThreshold}</span>
              <span className="text-gray-500">Current audio: {audioLevel.toFixed(1)}</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="30" 
              value={customSilenceThreshold}
              onChange={(e) => setCustomSilenceThreshold(parseInt(e.target.value))}
              className="w-full h-2"
            />
          </div>
          <div>
            <label>Speech threshold: {customSpeechThreshold}</label>
            <input 
              type="range" 
              min="15" 
              max="100" 
              value={customSpeechThreshold}
              onChange={(e) => setCustomSpeechThreshold(parseInt(e.target.value))}
              className="w-full h-2"
            />
          </div>
          
          {/* Force reset button */}
          <div className="mt-2 flex justify-center">
            <button
              onClick={forceReset}
              className="flex items-center gap-1 px-2 py-1 bg-red-100 hover:bg-red-200 rounded-md text-red-700 transition-colors text-xs"
            >
              <AlertTriangle className="h-3 w-3" />
              Force Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Status indicator */}
      <div className="flex flex-col items-center mb-6">
        <div className={`p-4 rounded-full mb-2 ${
          isSpeaking
            ? 'bg-purple-100 animate-pulse'
            : isProcessing 
              ? 'bg-yellow-100' 
              : isSpeechDetected 
                ? 'bg-green-100 animate-pulse' 
                : isListening 
                  ? 'bg-blue-100' 
                  : 'bg-gray-100'
        }`}>
          {isSpeaking ? (
            <Volume2 className="h-8 w-8 text-purple-500" />
          ) : isProcessing ? (
            <Loader2 className="h-8 w-8 text-yellow-500 animate-spin" />
          ) : isSpeechDetected ? (
            <Activity className="h-8 w-8 text-green-500" />
          ) : isListening ? (
            <Mic className="h-8 w-8 text-blue-500" />
          ) : (
            <MicOff className="h-8 w-8 text-gray-500" />
          )}
        </div>
        
        {/* Audio level visualization */}
        {isListening && !isProcessing && !isSpeaking && renderAudioLevelIndicator()}
        
        {/* Status text */}
        <p className="text-center text-sm font-medium">
          {isSpeaking
            ? 'Speaking response...'
            : isProcessing 
              ? 'Processing your speech...' 
              : isSpeechDetected 
                ? consecutiveSilenceFrames > 0
                  ? `Pause detected (${(consecutiveSilenceFrames / 60).toFixed(1)}s of 4s)...`
                  : 'Listening to you...' 
                : isListening 
                  ? 'Waiting for speech...' 
                  : 'Microphone is off'}
        </p>
        
        {/* Recording duration */}
        {isListening && !isProcessing && !isSpeaking && (
          <p className="text-center text-xs font-mono mt-1">
            {isSpeechDetected 
              ? 'Pause for 4 seconds to process automatically' 
              : 'Speak to begin recording'}
          </p>
        )}
        
        {/* Processing steps indicator */}
        {isProcessing && (
          <div className="mt-2 text-xs text-gray-500 max-w-xs text-center">
            <p>Processing one step at a time:</p>
            <ol className="mt-1 list-decimal list-inside text-left">
              <li className={transcript ? 'text-green-600 font-medium' : ''}>Transcribing speech</li>
              <li className={translatedInput ? 'text-green-600 font-medium' : ''}>Translating to English</li>
              <li className={aiResponse ? 'text-green-600 font-medium' : ''}>Getting AI response</li>
              <li className={translatedResponse ? 'text-green-600 font-medium' : ''}>Translating to Kannada</li>
              <li className={isSpeaking ? 'text-purple-600 font-medium' : ''}>Speaking response</li>
            </ol>
          </div>
        )}
        
        {/* Manual process button - MADE MORE PROMINENT */}
        {isListening && isSpeechDetected && !isProcessing && !isSpeaking && (
          <button
            onClick={() => processCurrentRecording()}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md text-white transition-colors text-sm font-medium shadow-md"
          >
            <Send className="h-4 w-4" />
            Process Now
          </button>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Audio playback */}
      {audioUrl && (
        <div className="mb-4 flex justify-center">
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
            <Volume2 className="h-5 w-5 text-gray-600" />
            <audio controls src={audioUrl} className="h-8" />
          </div>
        </div>
      )}
      
      {/* Conversation display */}
      {transcript && (
        <div className="space-y-4 mt-6">
          <div className="p-3 bg-gray-100 rounded-lg">
            <h3 className="font-semibold">You said (Kannada):</h3>
            <p>{transcript}</p>
          </div>
          
          <div className="p-3 bg-gray-100 rounded-lg">
            <h3 className="font-semibold">Translated to English:</h3>
            <p>{translatedInput}</p>
          </div>
          
          {aiResponse && (
            <>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h3 className="font-semibold">AI Response (English):</h3>
                <p>{aiResponse}</p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg relative">
                <h3 className="font-semibold">Response in Kannada:</h3>
                <p>{translatedResponse}</p>
                
                {/* TTS indicator */}
                {isSpeaking && (
                  <div className="absolute top-3 right-3 animate-pulse">
                    <Volume2 className="h-5 w-5 text-blue-500" />
                  </div>
                )}
              </div>
              
              {/* TTS error message */}
              {ttsError && (
                <div className="p-2 bg-yellow-50 rounded-lg text-yellow-700 text-sm flex items-center gap-2">
                  <VolumeX className="h-4 w-4" />
                  <span>{ttsError}</span>
                </div>
              )}
              
              {/* TTS replay button */}
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => {
                    setIsSpeaking(true);
                    generateTTS('kn-IN', translatedResponse)
                      .then(() => setTimeout(() => setIsSpeaking(false), 500))
                      .catch(err => {
                        console.error('TTS replay error:', err);
                        setTtsError('Could not play audio response. Please check your audio settings.');
                        setIsSpeaking(false);
                      });
                  }}
                  disabled={isSpeaking}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-md text-blue-700 transition-colors text-sm"
                >
                  <Volume2 className="h-4 w-4" />
                  Play response again
                </button>
              </div>
            </>
          )}
          
          {/* Reset button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={resetAssistant}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>
      )}
      
      {/* Debug information (hidden in production) */}
      {debugInfo && process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-3 bg-gray-100 rounded-lg text-xs">
          <h3 className="font-semibold">Debug Info:</h3>
          <pre className="overflow-auto max-h-40">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 