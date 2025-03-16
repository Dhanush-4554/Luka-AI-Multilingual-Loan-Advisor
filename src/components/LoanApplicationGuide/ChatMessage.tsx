import { Message } from './LoanChatInterface';
import { User, Bot, CheckCircle2 } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  // Function to format the message text with proper styling
  const formatMessageContent = (text: string) => {
    // Split the text into sections based on numbers followed by dots or parentheses
    const sections = text.split(/(\d+[\.)]\s+)/);

    // Check if this is a process explanation message
    const isProcessExplanation = text.includes("Document Collection") ||
      text.includes("Basic Eligibility") ||
      text.includes("Application Submission") ||
      text.includes("Verification Process");

    // Format acknowledgment questions
    const formatAcknowledgment = (text: string) => {
      if (text.includes("?") && (
        text.includes("understand") ||
        text.includes("clear") ||
        text.includes("questions") ||
        text.includes("doubts")
      )) {
        return (
          <div className="mt-4 flex items-center gap-2 text-blue-600 font-medium">
            <CheckCircle2 className="w-5 h-5" />
            <span>{text}</span>
          </div>
        );
      }
      return text;
    };

    if (isProcessExplanation) {
      return (
        <div className="space-y-4">
          {sections.map((section, index) => {
            // If section starts with a number, it's a heading
            if (/^\d+[\.)]\s+/.test(section)) {
              return (
                <div key={index} className="font-semibold text-lg mt-4">
                  {section}
                </div>
              );
            }
            // Check if section contains bullet points
            else if (section.includes("-")) {
              const bullets = section.split("-").filter(Boolean);
              return (
                <div key={index} className="ml-4 space-y-2">
                  {bullets.map((bullet, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                      <span className="text-gray-700">{bullet.trim()}</span>
                    </div>
                  ))}
                </div>
              );
            }
            // Check for acknowledgment questions
            else if (section.includes("?")) {
              return <div key={index}>{formatAcknowledgment(section)}</div>;
            }
            // Regular text
            else if (section.trim()) {
              return <p key={index} className="text-gray-700">{section}</p>;
            }
            return null;
          })}
        </div>
      );
    }

    // For regular messages or questions
    return <p className="text-current">{text}</p>;
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-[85%] p-4 rounded-lg flex items-start gap-4 shadow-sm ${message.sender === 'user'
        ? 'bg-blue-500 text-white'
        : 'bg-white text-gray-800 border border-gray-100'
        }`}>
        <div className={`p-2 rounded-full ${message.sender === 'user'
          ? 'bg-blue-600'
          : 'bg-blue-500'
          }`}>
          {message.sender === 'user' ? (
            <User className="w-5 h-5 text-blue-500" />
          ) : (
            <Bot className="w-5 h-5 text-blue-500" />
          )}
        </div>
        <div className="flex-1 pt-1">
          {formatMessageContent(message.text)}
        </div>
      </div>
    </div>
  );
} 