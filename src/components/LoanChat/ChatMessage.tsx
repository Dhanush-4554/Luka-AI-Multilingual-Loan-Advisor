import { Message } from './ChatInterface';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[80%] p-3 rounded-lg flex items-start gap-3 ${
        message.sender === 'user' 
          ? 'bg-blue-500 text-white' 
          : 'bg-white text-gray-800 border border-gray-200'
      }`}>
        <div className="pt-1">
          {message.sender === 'user' ? (
            <User className="w-5 h-5" />
          ) : (
            <Bot className="w-5 h-5 text-blue-500" />
          )}
        </div>
        <div className="flex-1">
          {message.text}
        </div>
      </div>
    </div>
  );
} 