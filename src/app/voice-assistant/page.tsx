import VoiceAssistant from '@/components/VoiceAssistant/VoiceAssistant';

export const metadata = {
  title: 'Voice Assistant - Kannada to English',
  description: 'A voice assistant that translates Kannada to English, processes with AI, and responds in Kannada',
};

export default function VoiceAssistantPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Kannada Voice Assistant</h1>
        <p className="text-center mb-8 max-w-2xl mx-auto text-gray-600">
          Speak in Kannada, get responses in Kannada. This assistant translates your Kannada speech to English,
          processes it with AI, and responds back in Kannada.
        </p>
        
        <VoiceAssistant />
      </div>
    </main>
  );
} 