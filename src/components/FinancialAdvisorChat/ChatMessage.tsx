import { Message } from './types';
import { User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div 
        className={`max-w-[85%] p-4 rounded-lg shadow-sm flex items-start gap-3 ${
          message.sender === 'user' 
            ? 'bg-[hsl(var(--finance-primary))] text-blue-600 rounded-tr-none' 
            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
        }`}
      >
        <div className={`flex-shrink-0 ${message.sender === 'user' ? 'order-last ml-2' : 'mr-2'}`}>
          {message.sender === 'user' ? (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
              <Bot className="w-4 h-4 text-[hsl(var(--finance-primary))]" />
            </div>
          )}
        </div>
        <div className="flex-1 break-words">
          {message.text}
        </div>
      </div>
    </motion.div>
  );
} 