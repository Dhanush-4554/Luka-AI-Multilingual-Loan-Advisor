"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

interface FlowChartProps {
  title?: string;
  description?: string;
  className?: string;
}

interface CardData {
  id: number;
  title: string;
  content: string;
  icon: string;
  gradient: string;
}

const FlowChart: React.FC<FlowChartProps> = ({ 
  title = "Process Flow", 
  description = "Visual representation of the process flow",
  className = ""
}) => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [cardWidths, setCardWidths] = useState<number[]>(Array(8).fill(64));
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Positions for the cards - moved to the left with line on right
  const cardX = 100; // Card position X
  const lineX = 230; // Line position X (to the right of cards)

  // Vertical positions for the cards
  const positions = [
    { y: 50 },     // Application Submission
    { y: 200 },    // Evaluation of Applicant
    { y: 350 },    // Property & Legal Evaluation
    { y: 500 },    // Process Start
    { y: 650 },    // Legal Check
    { y: 800 },    // Committee Sanction
    { y: 950 },    // Collection & Report
    { y: 1100 },   // Loan Release
  ];

  // Updated paths for vertical connecting lines
  const paths = [
    `M${lineX} 100 L${lineX} 200`,   // Application Submission to Evaluation
    `M${lineX} 250 L${lineX} 350`,   // Evaluation to Property
    `M${lineX} 400 L${lineX} 500`,   // Property to Process Start
    `M${lineX} 550 L${lineX} 650`,   // Process Start to Legal Check
    `M${lineX} 700 L${lineX} 800`,   // Legal Check to Committee
    `M${lineX} 850 L${lineX} 950`,   // Committee to Collection
    `M${lineX} 1000 L${lineX} 1100`, // Collection to Loan Release
  ];

  // Define fallback data outside the fetch function to avoid duplication
  const fallbackData = [
    { 
      id: 1, 
      title: "Application Submission", 
      content: "Application form is filled and submitted with required details",
      icon: "📝",
      gradient: "from-blue-500 to-indigo-600"
    },
    { 
      id: 2, 
      title: "Evaluation of Applicant", 
      content: "Check ITR, Bank Statements and verify provided details",
      icon: "🔍",
      gradient: "from-indigo-500 to-purple-600"
    },
    { 
      id: 3, 
      title: "Property & Legal Evaluation", 
      content: "Evaluate property and perform legal checks",
      icon: "🏠",
      gradient: "from-purple-500 to-pink-600"
    },
    { 
      id: 4, 
      title: "Process Start", 
      content: "Document verification and physical authority grants",
      icon: "🔄",
      gradient: "from-pink-500 to-red-600"
    },
    { 
      id: 5, 
      title: "Legal Check", 
      content: "Ensure compliance with legal norms and verify certificates",
      icon: "⚖️",
      gradient: "from-red-500 to-orange-600"
    },
    { 
      id: 6, 
      title: "Committee Sanction", 
      content: "Review, sanction and collect original documents",
      icon: "✅",
      gradient: "from-orange-500 to-yellow-600"
    },
    { 
      id: 7, 
      title: "Collection & Report", 
      content: "Prepare reports based on document verification",
      icon: "📊",
      gradient: "from-yellow-500 to-green-600"
    },
    { 
      id: 8, 
      title: "Loan Release", 
      content: "Final verification and loan disbursement to applicant",
      icon: "💰",
      gradient: "from-green-500 to-teal-600"
    }
  ];

  // Fetch data from OpenAI
  useEffect(() => {
    const fetchDataFromOpenAI = async () => {
      setIsLoading(true);
      setApiError(null);
      
      try {
        console.log('Fetching rephrased content from OpenAI...');
        
        // Use AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        // Fetch rephrased content from OpenAI API
        const response = await fetch('/api/openai/rephrase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            cardData: fallbackData,
            type: 'loan_process'
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`API error: ${response.status} ${response.statusText} ${errorData.error || ''}`);
        }

        const data = await response.json();
        console.log('Received data from OpenAI:', data);
        
        // Try multiple fallback patterns for the response format
        if (data.rephrased && Array.isArray(data.rephrased) && data.rephrased.length > 0) {
          console.log('Using rephrased data from OpenAI (standard format)');
          setCardData(data.rephrased);
        } else if (Array.isArray(data) && data.length > 0) {
          console.log('Using rephrased data from OpenAI (direct array)');
          setCardData(data);
        } else if (typeof data === 'object' && Object.keys(data).length > 0) {
          // Try to find any array in the response
          const firstArrayKey = Object.keys(data).find(key => Array.isArray(data[key]) && data[key].length > 0);
          if (firstArrayKey) {
            console.log(`Using rephrased data from OpenAI (found in key: ${firstArrayKey})`);
            setCardData(data[firstArrayKey]);
          } else {
            throw new Error('Invalid response format: No valid array found in response');
          }
        } else {
          throw new Error('Invalid response format: Expected array of card data');
        }
      } catch (error) {
        console.error('Error fetching data from OpenAI:', error);
        setApiError(error instanceof Error ? error.message : 'Unknown error occurred');
        
        // Use fallback data on error
        console.log('Using fallback data due to API error');
        setCardData(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataFromOpenAI();
  }, []);

  // Measure card widths after they're rendered
  useEffect(() => {
    if (!cardData.length) return;
    
    const measureCards = () => {
      const newWidths = cardRefs.current.map(ref => 
        ref ? ref.offsetWidth : 64
      );
      setCardWidths(newWidths);
    };

    // Measure after a short delay to ensure cards are rendered
    const timer = setTimeout(measureCards, 500);
    return () => clearTimeout(timer);
  }, [visibleCards, cardData]);

  // Auto-scroll to the latest card when new cards appear
  useEffect(() => {
    if (visibleCards.length > 0 && containerRef.current) {
      const lastCardIndex = visibleCards[visibleCards.length - 1];
      
      // Special handling for the last card to ensure it's fully visible
      if (lastCardIndex === cardData.length - 1) {
        // Scroll to bottom with extra padding to ensure full visibility
        containerRef.current.scrollTo({
          top: positions[lastCardIndex].y + 100,
          behavior: 'smooth'
        });
      } else {
        // Normal scrolling for other cards
        const scrollTarget = positions[lastCardIndex].y - 200; // Offset to show some context
        
        containerRef.current.scrollTo({
          top: scrollTarget,
          behavior: 'smooth'
        });
      }
    }
  }, [visibleCards, cardData.length]);

  // Generate the path data for the continuous flow line
  const generatePathData = () => {
    if (visibleCards.length === 0) return `M${lineX} 50`;
    
    let pathData = `M${lineX} 50`; // Start at the first card
    
    // For each visible card, add a line to its position
    for (let i = 0; i < visibleCards.length; i++) {
      const index = visibleCards[i];
      if (index > 0) { // Skip the first card as we already started there
        pathData += ` L${lineX} ${positions[index].y}`;
      }
    }
    
    return pathData;
  };

  // Add cards one by one with a delay
  useEffect(() => {
    if (isLoading || cardData.length === 0) return;
    
    // Reset visible cards when card data changes
    setVisibleCards([]);
    
    const interval = setInterval(() => {
      setVisibleCards(prev => {
        if (prev.length < cardData.length) {
          // Add the next card
          return [...prev, prev.length];
        }
        clearInterval(interval);
        return prev;
      });
    }, 2000); // 2 seconds between cards

    return () => clearInterval(interval);
  }, [isLoading, cardData]);

  // Animate the line progress based on visible cards
  useEffect(() => {
    if (visibleCards.length === 0 || cardData.length === 0) return;

    // Calculate target progress based on visible cards
    const targetProgress = visibleCards.length / cardData.length;
    
    // Animate to each card with pauses
    const animateProgress = async () => {
      // Calculate intermediate steps for each card
      for (let i = 0; i < visibleCards.length; i++) {
        const stepProgress = (i + 1) / cardData.length;
        
        // Animate to this step
        const duration = 500; // ms
        const startTime = Date.now();
        const startProgress = animationProgress;
        
        // Animate to the next card
        while (Date.now() - startTime < duration) {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeInOutCubic(progress);
          
          setAnimationProgress(
            startProgress + (stepProgress - startProgress) * easedProgress
          );
          
          await new Promise(resolve => requestAnimationFrame(resolve));
        }
        
        // Ensure we reach exactly the target
        setAnimationProgress(stepProgress);
        
        // Pause at each card
        if (i < visibleCards.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    };
    
    animateProgress();
  }, [visibleCards, cardData]);

  // Easing function for smoother animation
  const easeInOutCubic = (t: number): number => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Function to scroll to the bottom of the flowchart
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: positions[positions.length - 1].y + 100,
        behavior: 'smooth'
      });
    }
  };

  // Function to scroll to the top of the flowchart
  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const progress = scrollTop / (scrollHeight - clientHeight);
        setScrollProgress(Math.min(Math.max(progress, 0), 1));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Reset the animation when card data changes
  useEffect(() => {
    if (cardData.length > 0) {
      setAnimationProgress(0);
      setVisibleCards([]);
    }
  }, [cardData]);
  return (
    <div className={`relative bg-white rounded-xl shadow-xl overflow-auto ${className} `}>
      
      
      
      {/* Flowchart Container */}
      <div ref={containerRef} className="relative w-full h-[700px] p-6 overflow-auto pb-20 top-[-70px]">
        <div className="min-h-[1350px] relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-4000"></div>
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-indigo-50 rounded-full mix-blend-multiply opacity-20 animate-blob"></div>
              </div>

              {/* Main Vertical Line */}
              <div 
                className="absolute top-0 bottom-0 w-[4px] bg-gradient-to-b from-blue-500 via-purple-500 to-teal-500 transform -translate-x-1/2 opacity-20"
                style={{ left: `${lineX}px` }}
              ></div>

              {/* Continuous Flow Line */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <motion.path
                  d={generatePathData()}
                  stroke="blue"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
                />
                <defs>
                  <linearGradient id="gradientLine" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#0D9488" />
                  </linearGradient>
                  <linearGradient id="horizontalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Connecting Lines */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {paths.map((path, index) => (
                  visibleCards.includes(index + 1) && (
                    <motion.path
                      key={index}
                      d={path}
                      stroke="url(#gradientLine)"
                      strokeWidth="3"
                      strokeDasharray="6 6"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1}}
                      transition={{ 
                        duration: 3.0, 
                        ease: "easeInOut",
                        delay: 0.3 // Delay to start after the main line reaches the card
                      }}
                    />
                  )
                ))}
              </svg>

              {/* Horizontal Connecting Lines */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {positions.map((pos, index) => (
                  visibleCards.includes(index) && (
                    <motion.path
                      key={`connector-${index}`}
                      d={`M${cardX + cardWidths[index]} ${pos.y} L${lineX} ${pos.y}`}
                      stroke="url(#horizontalGradient)"
                      strokeWidth="3"
                      strokeDasharray="4 4"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ 
                        duration: 0.8, 
                        ease: "easeInOut",
                        delay: 0.3
                      }}
                    />
                  )
                ))}
              </svg>

              {/* Cards */}
              <AnimatePresence>
                {cardData.map((card, index) => (
                  visibleCards.includes(index) && (
        <motion.div
                      key={card.id}
                      ref={el => {
                        cardRefs.current[index] = el;
                      }}
                      className="absolute bg-white rounded-lg shadow-md p-4 w-64 h-auto flex flex-col overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
                      style={{
                        left: cardX,
                        top: positions[index].y,
                        transform: "translateY(-50%)", // Center vertically
                      }}
                      initial={{ scale: 0.8, opacity: 0, x: -20 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
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
                          sequence={['', 500, card.content]}
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
            </>
          )}
        </div>
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