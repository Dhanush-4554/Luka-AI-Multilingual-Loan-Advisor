import { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        placeholder="Type your message..."
        disabled={isLoading}
      />
      <button
        onClick={handleSend}
        disabled={isLoading}
        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300"
      >
        <Send size={20} />
      </button>
    </div>
  );
} 