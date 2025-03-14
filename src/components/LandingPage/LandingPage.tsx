"use client"
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import Accordion from './Accordion';


const FeatureCard: React.FC<{
    icon: string;
    title: string;
    description: string;
    delay: number;
    className?: string;
}> = ({ icon, title, description, delay, className }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: delay * 0.1 }}
            className={`bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all p-6 group hover:-translate-y-2 ${className || ''}`}
        >
            <div className="bg-blue-100 rounded-2xl p-4 w-16 h-16 mb-6 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Image src={`/icons/${icon}.svg`} alt={title} width={32} height={32} className="group-hover:filter group-hover:brightness-0 group-hover:invert transition-all" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </motion.div>
    );
};

const LandingPage: React.FC = () => {
    const chatbotRef = useRef<HTMLDivElement>(null);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="min-h-screen">

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden">
                {/* Background gradients and effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 opacity-95"></div>
                <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-15"></div>
                
                {/* Animated particles */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-full h-full">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full bg-white"
                                initial={{
                                    opacity: Math.random() * 0.5 + 0.3,
                                    x: Math.random() * window.innerWidth,
                                    y: Math.random() * window.innerHeight,
                                    scale: Math.random() * 0.2 + 0.1,
                                }}
                                animate={{
                                    y: [null, Math.random() * -100 - 50],
                                    opacity: [null, 0],
                                }}
                                transition={{
                                    duration: Math.random() * 10 + 20,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                style={{ width: `${Math.random() * 4 + 1}px`, height: `${Math.random() * 4 + 1}px` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Animated gradient orbs */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-500/20 blur-3xl"
                            initial={{
                                width: `${Math.random() * 400 + 300}px`,
                                height: `${Math.random() * 400 + 300}px`,
                                x: `${Math.random() * 100}%`,
                                y: `${Math.random() * 100}%`,
                                opacity: 0.4,
                            }}
                            animate={{
                                x: [null, `${Math.random() * 20 - 10}%`],
                                y: [null, `${Math.random() * 20 - 10}%`],
                                opacity: [0.4, 0.6, 0.4],
                            }}
                            transition={{
                                duration: Math.random() * 15 + 15,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                {/* Animated grid lines */}
                <div className="absolute inset-0 overflow-hidden opacity-10">
                    <div className="absolute w-full h-full border-t border-l border-blue-300/20" 
                        style={{ backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)', 
                                backgroundSize: '80px 80px' }}>
                    </div>
                </div>

                <div className="container mx-auto px-4 z-10 flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 text-white">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.2,
                                        delayChildren: 0.3,
                                    }
                                }
                            }}
                        >
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                                }}
                                className="mb-2"
                            >
                                <span className="bg-white/10 backdrop-filter backdrop-blur-lg px-4 py-1.5 rounded-full text-sm font-medium text-blue-200 border border-white/10 inline-flex items-center">
                                    <motion.span
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="w-4 h-4 mr-2 bg-blue-400 rounded-full flex items-center justify-center"
                                    >
                                        <span className="text-xs">✦</span>
                                    </motion.span>
                                    AI-Powered Financial Assistant
                                </span>
                            </motion.div>

                            <motion.h1 
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                                }}
                                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                            >
                                Your Multilingual{" "}
                                <span className="relative inline-block">
                                    <span className="relative z-10 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">Financial Companion</span>
                                    <motion.span 
                                        className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-blue-500/40 to-indigo-500/40 rounded-full blur-sm z-0"
                                        animate={{ width: ["0%", "100%"] }}
                                        transition={{ duration: 1, delay: 1 }}
                                    ></motion.span>
                                </span>
                            </motion.h1>

                            <motion.p 
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                                }}
                                className="text-xl text-blue-100/90 mb-10 max-w-lg leading-relaxed"
                            >
                                Luka AI helps you understand loan eligibility, guides through application processes, and provides financial literacy in 10+ languages.
                            </motion.p>

                            <motion.div 
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                                }}
                                className="flex flex-wrap gap-5"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/get-started"
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-blue-500/50 flex items-center group relative overflow-hidden"
                                    >
                                        <span className="relative z-10">Get Started</span>
                                        <motion.span 
                                            className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-700 z-0"
                                            initial={{ x: "-100%" }}
                                            whileHover={{ x: 0 }}
                                            transition={{ duration: 0.4 }}
                                        ></motion.span>
                                        <motion.div
                                            className="relative z-10 ml-2 bg-white/20 rounded-full w-6 h-6 flex items-center justify-center"
                                            whileHover={{ 
                                                x: [0, 5, 0],
                                                transition: { repeat: Infinity, duration: 1 }
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </motion.div>
                                    </Link>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/demo"
                                        className="bg-white/10 hover:bg-white/15 backdrop-filter backdrop-blur-lg text-white font-medium px-8 py-4 rounded-full border border-white/20 transition-all flex items-center group"
                                    >
                                        <motion.div
                                            className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center mr-2"
                                            animate={{ 
                                                scale: [1, 1.2, 1],
                                                opacity: [0.7, 1, 0.7]
                                            }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                            </svg>
                                        </motion.div>
                                        <span>Watch Demo</span>
                                    </Link>
                                </motion.div>
                            </motion.div>

                            {/* Language pills */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1, transition: { delay: 1.2, duration: 0.8 } }
                                }}
                                className="mt-10 flex flex-wrap gap-2"
                            >
                                {["Hindi", "English", "Tamil", "Telugu", "Bengali"].map((lang, i) => (
                                    <motion.span
                                        key={lang}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1.4 + i * 0.1, duration: 0.3 }}
                                        className="text-xs bg-white/10 backdrop-filter backdrop-blur-sm text-blue-100 px-3 py-1 rounded-full border border-white/10"
                                    >
                                        {lang}
                                    </motion.span>
                                ))}
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.9, duration: 0.3 }}
                                    className="text-xs bg-blue-500/30 backdrop-filter backdrop-blur-sm text-blue-100 px-3 py-1 rounded-full border border-blue-400/30"
                                >
                                    +5 more
                                </motion.span>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Hero Image/Animation */}
                    <div className="lg:w-1/2 mt-16 lg:mt-0">
                        <motion.div
                            ref={chatbotRef}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="relative mx-auto max-w-md"
                        >
                            {/* Animated rings */}
                            <motion.div 
                                className="absolute -inset-4 rounded-full border-2 border-blue-400/20 z-0"
                                animate={{ 
                                    scale: [1, 1.05, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                    rotate: [0, 5, 0, -5, 0]
                                }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            ></motion.div>
                            
                            <motion.div 
                                className="absolute -inset-8 rounded-full border-2 border-indigo-400/10 z-0"
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    opacity: [0.2, 0.3, 0.2],
                                    rotate: [0, -5, 0, 5, 0]
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            ></motion.div>

                            {/* Chat interface */}
                            <motion.div
                                className="bg-white/90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-5 relative z-10 border border-white/50"
                                whileHover={{ 
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
                                    y: -5,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                {/* Glowing dots */}
                                <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400 rounded-full blur-sm animate-pulse"></div>
                                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-indigo-400 rounded-full blur-sm animate-pulse delay-700"></div>
                                
                                {/* Header with audio visualization */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3 shadow-md">
                                            <motion.svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                className="h-5 w-5 text-white" 
                                                viewBox="0 0 20 20" 
                                                fill="currentColor"
                                                animate={{ 
                                                    scale: [1, 1.2, 1],
                                                    rotate: [0, 10, 0, -10, 0]
                                                }}
                                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                            </motion.svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-md">Luka AI</h3>
                                            <p className="text-xs text-gray-500">Voice & Text Assistant</p>
                                        </div>
                                    </div>

                                    {/* Audio visualization */}
                                    <div className="flex items-center space-x-1 h-8 bg-blue-50 px-3 py-1 rounded-full">
                                        {[3, 6, 9, 12, 9, 6, 3].map((height, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 bg-gradient-to-t from-blue-400 to-indigo-600 rounded-full"
                                                animate={{ height: [`${height}px`, `${height + 6}px`, `${height}px`] }}
                                                transition={{
                                                    duration: 1.2,
                                                    repeat: Infinity,
                                                    delay: i * 0.1,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Chat messages */}
                                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto bg-gray-50 rounded-xl p-3">
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.8 }}
                                        className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg rounded-tl-none p-3 max-w-xs shadow-sm"
                                    >
                                        <p className="text-gray-700 text-sm">Hello! I'm Luka AI. How can I help with your loan needs today?</p>
                                    </motion.div>

                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 1.3 }}
                                        className="bg-gray-100 rounded-lg rounded-tr-none p-3 max-w-xs ml-auto shadow-sm"
                                    >
                                        <p className="text-gray-700 text-sm">I need a home loan. Not sure where to start.</p>
                                    </motion.div>

                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 1.8 }}
                                        className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg rounded-tl-none p-3 max-w-xs shadow-sm"
                                    >
                                        <p className="text-gray-700 text-sm">I can help you with that! Let's check your eligibility. What's your preferred language?</p>
                                    </motion.div>

                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 2.3 }}
                                        className="bg-gray-100 rounded-lg rounded-tr-none p-3 max-w-xs ml-auto shadow-sm"
                                    >
                                        <p className="text-gray-700 text-sm">Hindi, please.</p>
                                    </motion.div>

                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 2.8 }}
                                        className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg rounded-tl-none p-3 max-w-xs shadow-sm"
                                    >
                                        <p className="text-gray-700 text-sm">अब हम हिंदी में बात कर सकते हैं। आपके होम लोन के लिए, कृपया अपनी मासिक आय बताएं?</p>
                                    </motion.div>
                                </div>

                                {/* Interactive controls */}
                                <div className="flex flex-col gap-3">
                                    {/* Voice input visualization */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 3.2 }}
                                        className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-xl flex items-center justify-between shadow-sm"
                                    >
                                        <div className="flex items-center space-x-3 flex-grow">
                                            <div className="flex items-center space-x-1 h-6 bg-white/80 px-2 py-1 rounded-full">
                                                {[2, 4, 6, 8, 6, 4, 2, 4, 6].map((height, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-0.5 bg-gradient-to-t from-blue-400 to-indigo-600 rounded-full"
                                                        animate={{
                                                            height: [`${height}px`, `${height + 4}px`, `${height}px`],
                                                            opacity: [0.5, 1, 0.5]
                                                        }}
                                                        transition={{
                                                            duration: 0.8,
                                                            repeat: Infinity,
                                                            delay: i * 0.1,
                                                            repeatType: "reverse"
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600 font-medium">Listening...</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <motion.button 
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                                                </svg>
                                            </motion.button>
                                            <motion.button 
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                                                </svg>
                                            </motion.button>
                                        </div>
                                    </motion.div>

                                    {/* Text input */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 3.5 }}
                                        className="flex items-center"
                                    >
                                        <div className="relative flex-grow">
                                            <input
                                                type="text"
                                                placeholder="Type your message..."
                                                className="bg-gray-50 rounded-full py-2.5 px-4 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 border border-gray-200"
                                            />
                                            <motion.div 
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                                                </svg>
                                            </motion.div>
                                        </div>
                                        <motion.button 
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="ml-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full p-2.5 shadow-md hover:shadow-lg transition-all"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                            </svg>
                                        </motion.button>
                                    </motion.div>

                                    {/* Language selection pills */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 3.8 }}
                                        className="flex flex-wrap gap-2 mt-1"
                                    >
                                        <motion.span 
                                            whileHover={{ scale: 1.05 }}
                                            className="text-sm bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-3 py-1 rounded-full font-medium shadow-sm"
                                        >
                                            Hindi
                                        </motion.span>
                                        {["English", "Tamil", "Telugu"].map((lang, i) => (
                                            <motion.span 
                                                key={lang}
                                                whileHover={{ scale: 1.05 }}
                                                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium shadow-sm"
                                            >
                                                {lang}
                                            </motion.span>
                                        ))}
                                        <motion.span 
                                            whileHover={{ scale: 1.05 }}
                                            className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium shadow-sm"
                                        >
                                            +7
                                        </motion.span>
                                    </motion.div>
                                </div>

                                {/* Floating badges */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 4, duration: 0.5 }}
                                    className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                                >
                                    Live Demo
                                </motion.div>
                            </motion.div>
                            </motion.div>
                        </div>
                    </div>
            </section>

            {/* Video Demo Section */}
            <section className="py-32 bg-gradient-to-b from-blue-900 to-indigo-900 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
                </div>
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-30"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="inline-block mb-4"
                        >
                            <span className="text-blue-300 font-semibold tracking-wider bg-white/10 backdrop-filter backdrop-blur-md px-6 py-2 rounded-full shadow-md border border-white/10 inline-flex items-center">
                                <motion.span 
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 10, 0, -10, 0]
                                    }}
                                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                    className="inline-block mr-2"
                                >
                                    🎬
                                </motion.span>
                                WATCH LUKA AI IN ACTION
                            </span>
                        </motion.div>
                        
                        <motion.h2 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl font-bold mt-4 mb-6 text-white leading-tight"
                        >
                            See How Luka AI Transforms <br />
                            <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                                Loan Assistance
                            </span>
                        </motion.h2>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="max-w-3xl mx-auto text-xl text-blue-100/90 leading-relaxed mb-16"
                        >
                            Experience the seamless interaction, multilingual support, and personalized guidance that makes Luka AI the future of financial assistance.
                        </motion.p>
                    </motion.div>

                    {/* Video Player */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="max-w-5xl mx-auto relative"
                    >
                        {/* Video Container with Glowing Effect */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            {/* Animated Glow Effect */}
                            <motion.div 
                                className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl blur-sm z-0"
                                animate={{ 
                                    opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            ></motion.div>
                            
                            {/* Video Placeholder */}
                            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-white/10 z-10">
                                {/* Video Thumbnail Overlay */}
                                <div className="absolute inset-0 bg-[url('/placeholder-video-thumbnail.jpg')] bg-cover bg-center opacity-50"></div>
                                
                                {/* Play Button */}
                                <motion.div 
                                    className="absolute inset-0 flex items-center justify-center"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        className="w-24 h-24 rounded-full bg-white/10 backdrop-filter backdrop-blur-md flex items-center justify-center cursor-pointer border border-white/20 group"
                                        whileHover={{ 
                                            boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
                                        }}
                                        animate={{ 
                                            scale: [1, 1.05, 1],
                                            boxShadow: [
                                                "0 0 0px rgba(59, 130, 246, 0)",
                                                "0 0 20px rgba(59, 130, 246, 0.4)",
                                                "0 0 0px rgba(59, 130, 246, 0)"
                                            ]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <motion.div
                                            className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-300"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                            </svg>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                                
                                {/* Video Controls */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                    <div className="flex flex-col space-y-3">
                                        {/* Progress Bar */}
                                        <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
                                            <motion.div 
                                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                                style={{ width: '35%' }}
                                                whileHover={{ opacity: 0.8 }}
                                            ></motion.div>
                                            <div className="absolute top-1/2 left-[35%] transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                                        </div>
                                        
                                        {/* Control Buttons */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <motion.button 
                                                    className="text-white/80 hover:text-white transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 15.536L9.879 9.879m0 0L15.536 4.222M9.879 9.879L4.222 4.222m5.657 5.657l-5.657 5.657" />
                                                    </svg>
                                                </motion.button>
                                                
                                                <motion.button 
                                                    className="text-white hover:text-white transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                    </svg>
                                                </motion.button>
                                                
                                                <motion.button 
                                                    className="text-white/80 hover:text-white transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                                                    </svg>
                                                </motion.button>
                                            </div>
                                            
                                            <div className="text-white/90 text-sm font-medium">
                                                01:23 / 03:45
                                            </div>
                                            
                                            <div className="flex items-center space-x-4">
                                                <motion.button 
                                                    className="text-white/80 hover:text-white transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                                    </svg>
                                                </motion.button>
                                                
                                                <motion.button 
                                                    className="text-white/80 hover:text-white transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                                                    </svg>
                                                </motion.button>
                                                
                                                <motion.button 
                                                    className="text-white/80 hover:text-white transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                                                    </svg>
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Video Chapters/Highlights */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                {
                                    time: "00:15",
                                    title: "Multilingual Conversation",
                                    description: "See how Luka AI seamlessly switches between languages"
                                },
                                {
                                    time: "01:23",
                                    title: "Eligibility Assessment",
                                    description: "Watch the AI analyze loan requirements in real-time"
                                },
                                {
                                    time: "02:47",
                                    title: "Financial Education",
                                    description: "Learn how Luka explains complex terms simply"
                                }
                            ].map((chapter, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                    whileHover={{ 
                                        y: -5,
                                        backgroundColor: "rgba(255, 255, 255, 0.08)"
                                    }}
                                    className="bg-white/5 backdrop-filter backdrop-blur-lg rounded-xl p-4 border border-white/10 cursor-pointer group"
                                >
                                    <div className="flex items-start">
                                        <div className="bg-white/10 rounded-lg px-2 py-1 text-blue-300 font-mono text-sm mr-3">
                                            {chapter.time}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium group-hover:text-blue-300 transition-colors">{chapter.title}</h4>
                                            <p className="text-blue-100/70 text-sm mt-1">{chapter.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    
                   
                </div>
            </section>

            {/* Features Section */}
            <section className="py-28 bg-gradient-to-b from-white via-blue-50 to-blue-100 overflow-hidden relative">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply opacity-20 animate-blob"></div>
                    <div className="absolute top-1/3 -left-24 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="text-center mb-24"
                    >
                        <motion.div 
                            variants={{
                                hidden: { opacity: 0, y: -20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                            }}
                            className="inline-block"
                        >
                            <span className="text-blue-600 font-semibold tracking-wider bg-blue-50 px-6 py-2 rounded-full shadow-md border border-blue-100 inline-flex items-center">
                        <motion.span 
                                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                    className="inline-block mr-2"
                        >
                                    ✨
                                </motion.span>
                            POWERFUL FEATURES
                            </span>
                        </motion.div>
                        
                        <motion.h2 
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { 
                                    opacity: 1, 
                                    y: 0, 
                                    transition: { duration: 0.8, delay: 0.2 } 
                                }
                            }}
                            className="text-5xl font-bold mt-8 mb-6 text-gray-800 leading-tight"
                        >
                            Revolutionizing Loan Assistance
                        </motion.h2>
                        
                        <motion.p 
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { 
                                    opacity: 1, 
                                    y: 0, 
                                    transition: { duration: 0.8, delay: 0.4 } 
                                }
                            }}
                            className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed"
                        >
                            Our multilingual AI assistant makes understanding loans and financial planning accessible to everyone, 
                            regardless of language or financial background.
                        </motion.p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                    >
                        {[
                            {
                                icon: "globe",
                                title: "Multilingual Support",
                                description: "Communicate effortlessly in 10+ languages with specialized financial terminology and cultural adaptations.",
                                color: "from-blue-400 to-indigo-500",
                                delay: 1
                            },
                            {
                                icon: "calculator",
                                title: "Intelligent Eligibility Assessment",
                                description: "Get an accurate prequalification with minimal information and understand exactly what factors affect your score.",
                                color: "from-indigo-400 to-purple-500",
                                delay: 2
                            },
                            {
                                icon: "devices",
                                title: "Seamless Omnichannel Experience",
                                description: "Start on WhatsApp, continue on web, and never lose your progress as you navigate the loan process.",
                                color: "from-purple-400 to-pink-500",
                                delay: 3
                            },
                            {
                                icon: "education",
                                title: "Financial Empowerment Hub",
                                description: "Access easy-to-understand financial education with interactive tools showing real impact of decisions.",
                                color: "from-pink-400 to-red-500",
                                delay: 4
                            },
                            {
                                icon: "brain",
                                title: "Emotional Intelligence",
                                description: "Experience conversations that adapt to your stress levels, providing reassurance when anxiety is detected.",
                                color: "from-red-400 to-yellow-500",
                                delay: 5
                            },
                            {
                                icon: "shield",
                                title: "Privacy-First Approach",
                                description: "Your financial data is secured with enterprise-grade encryption and never shared without explicit consent.",
                                color: "from-yellow-400 to-green-500",
                                delay: 6
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ 
                                    duration: 0.7, 
                                    delay: index * 0.1,
                                    ease: "easeOut" 
                                }}
                                whileHover={{ 
                                    y: -10,
                                    transition: { duration: 0.3 }
                                }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-all duration-300 -z-10"
                                    style={{ 
                                        background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                                        transform: "translate(8px, 8px)"
                                    }}
                                ></div>
                                <div className="h-full bg-white rounded-2xl p-8 shadow-xl border border-gray-100 group-hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r opacity-10 rounded-bl-full"></div>
                                    <div className="mb-6 relative">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg`}>
                                            <motion.div
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <i className={`fas fa-${feature.icon} text-2xl`}></i>
                                            </motion.div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"
                                        >
                                            <i className="fas fa-arrow-right text-sm"></i>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-28 bg-white relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply opacity-20 animate-blob"></div>
                    <div className="absolute bottom-1/3 -right-24 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-4000"></div>
                    </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="text-center mb-24"
                    >
                        <motion.div 
                            variants={{
                                hidden: { opacity: 0, y: -20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                            }}
                            className="inline-block"
                        >
                            <span className="text-blue-600 font-semibold tracking-wider bg-blue-50 px-6 py-2 rounded-full shadow-md border border-blue-100 inline-flex items-center">
                                <motion.span 
                                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                    className="inline-block mr-2"
                                >
                                    🔄
                                </motion.span>
                                SIMPLE PROCESS
                            </span>
                        </motion.div>
                        
                        <motion.h2 
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } }
                            }}
                            className="text-5xl font-bold mt-8 mb-6 text-gray-800 leading-tight"
                        >
                            How Luka AI Works
                        </motion.h2>
                        
                        <motion.p 
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4 } }
                            }}
                            className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed"
                        >
                            Getting loan assistance has never been easier. Our AI assistant guides you every step of the way.
                        </motion.p>
                    </motion.div>

                    <div className="relative">
                        

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                            {[
                                {
                                    icon: "comments",
                                    title: "Start Conversation",
                                    description: "Begin chatting with Luka AI in your preferred language through voice or text.",
                                    color: "from-blue-400 to-indigo-500",
                                    step: 1
                                },
                                {
                                    icon: "chart-line",
                                    title: "Get Assessment",
                                    description: "Receive personalized loan eligibility assessment and explore your options.",
                                    color: "from-indigo-400 to-purple-500",
                                    step: 2
                                },
                                {
                                    icon: "file-signature",
                                    title: "Complete Application",
                                    description: "Get guided through the entire application process with real-time assistance.",
                                    color: "from-purple-400 to-blue-500",
                                    step: 3
                                }
                            ].map((step, index) => (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ 
                                        duration: 0.7, 
                                        delay: index * 0.3,
                                        ease: "easeOut" 
                                    }}
                                    className="flex flex-col items-center text-center relative group"
                                >
                                    {/* Step number with animated ring */}
                                    <motion.div 
                                        className="mb-8 relative"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <motion.div 
                                            animate={{ 
                                                scale: [1, 1.1, 1],
                                                opacity: [0.7, 0.9, 0.7]
                                            }}
                                            transition={{ 
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className={`absolute inset-0 rounded-full bg-gradient-to-r ${step.color} blur-sm`}
                                        />
                                        <div className={`relative bg-gradient-to-r ${step.color} text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg`}>
                                            <span className="text-2xl font-bold">{step.step}</span>
                                        </div>
                                    </motion.div>

                                    {/* Card content */}
                                    <motion.div 
                                        className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 w-full h-64 flex flex-col items-center justify-center group-hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                                        whileHover={{ 
                                            y: -5,
                                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                                        }}
                                    >
                                        {/* Background decoration */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r opacity-5 rounded-bl-full"></div>
                                        
                                        {/* Icon */}
                                        <div className="mb-6">
                                            <motion.div
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                                className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-md`}
                                            >
                                                <i className={`fas fa-${step.icon} text-2xl`}></i>
                                            </motion.div>
                                    </div>
                                        
                                        {/* Text content */}
                                        <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                        
                                        {/* Animated arrow */}
                                        {index < 2 && (
                                            <motion.div 
                                                className="absolute -right-5 top-1/2 transform -translate-y-1/2 hidden md:block"
                                                animate={{ 
                                                    x: [0, 10, 0],
                                                    opacity: [0.5, 1, 0.5]
                                                }}
                                                transition={{ 
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                <i className="fas fa-chevron-right text-3xl text-blue-400"></i>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                        
                        {/* Call to action button */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 1.2 }}
                            className="mt-16 text-center"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Start Your Journey Now
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </section>

           
          
           
            {/* FAQ Section */}
            <section className="py-28 bg-gradient-to-b from-blue-50 to-indigo-50 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply opacity-30 animate-blob"></div>
                    <div className="absolute -bottom-20 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-4000"></div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-40"></div>
                <div className="absolute top-10 left-10 text-blue-100 opacity-20 text-9xl font-bold">FAQ</div>
                <div className="absolute bottom-10 right-10 text-indigo-100 opacity-20 text-9xl font-bold">?</div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                        }}
                        className="text-center mb-20"
                    >
                        <motion.div 
                            variants={{
                                hidden: { opacity: 0, y: -20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                            }}
                            className="inline-block mb-4"
                        >
                            <span className="text-blue-600 font-semibold tracking-wider bg-white px-6 py-2 rounded-full shadow-md border border-blue-100 inline-flex items-center">
                                <motion.span 
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 10, 0, -10, 0]
                                    }}
                                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                    className="inline-block mr-2"
                                >
                                    💡
                                </motion.span>
                                FREQUENTLY ASKED QUESTIONS
                            </span>
                        </motion.div>
                        
                        <motion.h2 
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                            }}
                            className="text-5xl font-bold mt-4 mb-6 text-gray-800 leading-tight"
                        >
                            Got Questions? We've Got Answers
                        </motion.h2>
                        
                        <motion.p 
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                            }}
                            className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed"
                        >
                            Find answers to common questions about Luka AI and how it can assist with your loan needs.
                        </motion.p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        {[
                            {
                                question: "Which languages does Luka AI support?",
                                answer: "Luka AI currently supports 10+ languages including Hindi, English, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Urdu with more languages being added regularly.",
                                icon: "language",
                                color: "from-blue-400 to-indigo-500"
                            },
                            {
                                question: "Is my financial data secure with Luka AI?",
                                answer: "Absolutely. We implement enterprise-grade encryption and follow strict data protection protocols. Your financial data is never shared with third parties without your explicit consent.",
                                icon: "shield-alt",
                                color: "from-indigo-400 to-purple-500"
                            },
                            {
                                question: "How accurate is the loan eligibility assessment?",
                                answer: "Our AI uses the same criteria as major financial institutions but presents it in an easy-to-understand way. The assessment is highly accurate and gives you a clear picture of your chances of approval.",
                                icon: "chart-pie",
                                color: "from-purple-400 to-pink-500"
                            },
                            {
                                question: "Is Luka AI free to use?",
                                answer: "Yes, Luka AI is completely free for loan seekers. We partner with financial institutions who value our ability to pre-qualify and educate potential borrowers.",
                                icon: "hand-holding-usd",
                                color: "from-pink-400 to-red-500"
                            },
                            {
                                question: "Can Luka AI help me improve my eligibility?",
                                answer: "Yes! Luka AI provides personalized recommendations to improve your loan eligibility and creates a step-by-step action plan to help you qualify for better terms.",
                                icon: "arrow-up",
                                color: "from-red-400 to-yellow-500"
                            }
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ 
                                    duration: 0.7, 
                                    delay: index * 0.15,
                                    ease: "easeOut" 
                                }}
                                className="mb-6"
                            >
                                <Accordion faq={faq} index={index} />
                            </motion.div>
                        ))}
                    </div>
                   
                </div>
            </section>



        </div>
    );
};

export default LandingPage;