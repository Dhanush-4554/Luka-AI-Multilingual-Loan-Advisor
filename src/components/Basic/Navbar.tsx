"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    // Define navigation items with custom routes
    const navItems = [
        { name: 'Home', route: '/' },
        { name: 'Features', route: '/our-features' },
        { name: 'Eligibility', route: '/check-eligibility' },
        { name: 'Education', route: '/financial-education' },
        { name: 'Financial Advisor', route: '/financial-advisor' }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        
        // Only add scroll listener on home page
        if (isHomePage) {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        } else {
            // Force scrolled style on non-home pages
            setIsScrolled(true);
        }
    }, [isHomePage]);

    // Determine if we should show the scrolled style
    const shouldUseScrolledStyle = isScrolled || !isHomePage;

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${
            shouldUseScrolledStyle
                ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
                : 'bg-transperant py-4'
        }`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center">
                        <div className="flex flex-col">
                            <span className={`font-bold text-2xl ${
                                shouldUseScrolledStyle ? 'text-blue-600' : 'text-white'
                            }`}>Luka<span className={
                                shouldUseScrolledStyle ? 'text-blue-400' : 'text-blue-200'
                            }>AI</span></span>
                            <span className={`text-xs -mt-1 ${
                                shouldUseScrolledStyle ? 'text-gray-500' : 'text-white/80'
                            }`}>Financial Companion</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-2">
                        <Link
                            href="/"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                shouldUseScrolledStyle
                                    ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/80' 
                                    : 'text-white hover:text-white hover:bg-blue-500/50'
                            }`}
                        >
                            Home
                        </Link>
                        
                        <Link
                            href="/loan-chat"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                shouldUseScrolledStyle
                                    ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/80' 
                                    : 'text-white hover:text-white hover:bg-blue-500/50'
                            }`}
                        >
                            Eligibility
                        </Link>

                        <Link
                            href="/loan-assist"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                shouldUseScrolledStyle
                                    ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/80' 
                                    : 'text-white hover:text-white hover:bg-blue-500/50'
                            }`}
                        >
                            Guidance
                        </Link>

                        <Link
                            href="/financial-advisor"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                shouldUseScrolledStyle
                                    ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/80' 
                                    : 'text-white hover:text-white hover:bg-blue-500/50'
                            }`}
                        >
                            Financial Advisor
                        </Link>
                        <Link
                            href="/financial-literacy"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                shouldUseScrolledStyle
                                    ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/80' 
                                    : 'text-white hover:text-white hover:bg-blue-500/50'
                            }`}
                        >
                            Education
                        </Link>

                        <div className="ml-6 flex items-center space-x-3">
                            
                            <Link
                                href="/loan-chat"
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                    shouldUseScrolledStyle
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30' 
                                        : 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg shadow-blue-300/30 hover:shadow-blue-300/50'
                                }`}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="lg:hidden focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-6 w-6 transition-colors duration-200 ${
                                shouldUseScrolledStyle ? 'text-blue-600' : 'text-white'
                            }`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            {isMobileMenuOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            }
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className={`lg:hidden mt-4 rounded-2xl shadow-xl p-4 ${
                            shouldUseScrolledStyle
                                ? 'bg-white' 
                                : 'bg-blue-700 backdrop-blur-lg'
                        }`}
                    >
                        <Link
                            href="/"
                            className={`block px-4 py-3 rounded-xl transition-all ${
                                shouldUseScrolledStyle
                                    ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' 
                                    : 'text-white hover:bg-blue-600'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/loan-guide"
                            className={`block px-4 py-3 rounded-xl transition-all ${
                                shouldUseScrolledStyle
                                    ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' 
                                    : 'text-white hover:bg-blue-600'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Guidance
                        </Link>
                        <Link
                            href="/check-eligibility"
                            className={`block px-4 py-3 rounded-xl transition-all ${
                                shouldUseScrolledStyle
                                    ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' 
                                    : 'text-white hover:bg-blue-600'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Eligibility
                        </Link>
                        <Link
                            href="/financial-education"
                            className={`block px-4 py-3 rounded-xl transition-all ${
                                shouldUseScrolledStyle
                                    ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' 
                                    : 'text-white hover:bg-blue-600'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Education
                        </Link>
                        <Link
                            href="/about-us"
                            className={`block px-4 py-3 rounded-xl transition-all ${
                                shouldUseScrolledStyle
                                    ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' 
                                    : 'text-white hover:bg-blue-600'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            About
                        </Link>

                        <div className="mt-4 flex flex-col space-y-2 pt-4 border-t border-blue-500/30">
                            <Link
                                href="/user/login"
                                className={`px-4 py-3 rounded-xl text-center transition-all ${
                                    shouldUseScrolledStyle
                                        ? 'text-blue-600 border border-blue-200 hover:bg-blue-50'
                                        : 'text-white border border-white/30 hover:bg-blue-600'
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/user/signup"
                                className={`px-4 py-3 rounded-xl text-center transition-all ${
                                    shouldUseScrolledStyle
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-white text-blue-600 hover:bg-blue-50'
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;