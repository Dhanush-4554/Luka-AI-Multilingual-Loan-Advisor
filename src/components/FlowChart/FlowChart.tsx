"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

interface FlowChartProps {
  title?: string;
  description?: string;
  className?: string;
}

const FlowChart: React.FC<FlowChartProps> = ({ 
  title = "Process Flow", 
  description = "Visual representation of the process flow",
  className = ""
}) => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCards(prev => {
        if (prev.length < cardData.length) {
          return [...prev, prev.length];
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Data for the cards with enhanced styling
  const cardData = [
    { 
      id: 1, 
      title: "Start", 
      content: "Begin your journey here",
      icon: "🚀",
      gradient: "from-blue-500 to-indigo-600"
    },
    { 
      id: 2, 
      title: "Research", 
      content: "Gather information and data",
      icon: "🔍",
      gradient: "from-indigo-500 to-purple-600"
    },
    { 
      id: 3, 
      title: "Analysis", 
      content: "Process and interpret findings",
      icon: "📊",
      gradient: "from-purple-500 to-pink-600"
    },
    { 
      id: 4, 
      title: "Planning", 
      content: "Develop strategies and timelines",
      icon: "📋",
      gradient: "from-pink-500 to-red-600"
    },
    { 
      id: 5, 
      title: "Design", 
      content: "Create mockups and prototypes",
      icon: "🎨",
      gradient: "from-red-500 to-orange-600"
    },
    { 
      id: 6, 
      title: "Development", 
      content: "Build the actual product",
      icon: "💻",
      gradient: "from-orange-500 to-yellow-600"
    },
    { 
      id: 7, 
      title: "Testing", 
      content: "Verify quality and functionality",
      icon: "🧪",
      gradient: "from-yellow-500 to-green-600"
    },
    { 
      id: 8, 
      title: "Deployment", 
      content: "Release to production",
      icon: "🚀",
      gradient: "from-green-500 to-teal-600"
    },
    { 
      id: 9, 
      title: "Feedback", 
      content: "Collect user responses",
      icon: "💬",
      gradient: "from-teal-500 to-cyan-600"
    }
  ];

  // Positions for the cards
  const positions = [
    { x: 100, y: 100 },    // Start
    { x: 400, y: 100 },    // Research
    { x: 700, y: 100 },    // Analysis
    { x: 700, y: 300 },    // Planning
    { x: 400, y: 300 },    // Design
    { x: 100, y: 300 },    // Development
    { x: 100, y: 500 },    // Testing
    { x: 400, y: 500 },    // Deployment
    { x: 700, y: 500 },    // Feedback
  ];

  // Updated paths for connecting lines with lower Y coordinates
  const paths = [
    "M150 168 C250 168, 250 168, 350 168",      // Start to Research
    "M450 168 C550 168, 550 168, 650 168",      // Research to Analysis
    "M725 168 C725 243, 725 243, 725 268",      // Analysis to Planning
    "M650 368 C550 368, 550 368, 450 368",      // Planning to Design
    "M350 368 C250 368, 250 368, 150 368",      // Design to Development
    "M125 418 C125 493, 125 493, 125 518",      // Development to Testing
    "M150 568 C250 568, 250 568, 350 568",      // Testing to Deployment
    "M450 568 C550 568, 550 568, 650 568",      // Deployment to Feedback
  ];

  return (
    <div className={`relative bg-white rounded-xl shadow-xl overflow-hidden ${className}`}>
      {/* Flowchart Container */}
      <div className="relative w-full h-[800px] p-6">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-indigo-50 rounded-full mix-blend-multiply opacity-20 animate-blob"></div>
        </div>

        {/* Continuous Flow Line */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <motion.path
            d="M128 168 L428 168 L728 168 L728 368 L428 368 L128 368 L128 568 L428 568 L728 568"
            stroke="url(#gradientLine)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: visibleCards.length / cardData.length }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Connecting Lines */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {paths.map((path, index) => (
            <motion.path
              key={index}
              d={path}
              stroke="url(#gradientLine)"
              strokeWidth="2"
              strokeDasharray="6 6"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: visibleCards.includes(index + 1) ? 1 : 0 
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          ))}
        </svg>

        {/* Cards */}
        <AnimatePresence>
          {cardData.map((card, index) => (
            visibleCards.includes(index) && (
              <motion.div
                key={card.id}
                className="absolute bg-white rounded-lg shadow-md p-4 w-56 h-32 flex flex-col overflow-hidden hover:shadow-lg transition-shadow"
                style={{
                  left: positions[index].x,
                  top: positions[index].y,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ 
                  duration: 0.5,
                  scale: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
              
                
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${card.gradient} flex items-center justify-center text-white text-lg shadow-sm`}>
                    {card.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    <TypeAnimation
                      sequence={[card.title]}
                      wrapper="span"
                      speed={50}
                      repeat={0}
                      cursor={false}
                    />
                  </h4>
                </div>
                
                <p className="text-gray-600 text-sm flex-grow">
                  <TypeAnimation
                    sequence={['', 1000, card.content]}
                    wrapper="span"
                    speed={90}
                    repeat={0}
                    cursor={false}
                  />
                </p>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default FlowChart;