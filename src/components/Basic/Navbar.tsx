"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Define navigation items with custom routes
    const navItems = [
        { name: 'Home', route: '/' },
        { name: 'Features', route: '/our-features' },
        { name: 'Eligibility', route: '/check-eligibility' },
        { name: 'Education', route: '/financial-education' },
        { name: 'About', route: '/about-us' }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-3'}`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center">
                        <div className="flex flex-col">
                            <span className={`font-bold text-2xl ${isScrolled ? 'text-blue-600' : 'text-white'}`}>Luka<span className="text-blue-400">AI</span></span>
                            <span className={`text-xs -mt-1 ${isScrolled ? 'text-gray-500' : 'text-blue-100'}`}>Financial Companion</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {/* Manual links instead of mapping */}
                        <Link
                            href="/"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-blue-100/80 ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-800'}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/loan-guide"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-blue-100/80 ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-800'}`}
                        >
                            Guidance
                        </Link>
                        <Link
                            href="/check-eligibility"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-blue-100/80 ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-800'}`}
                        >
                            Eligibility
                        </Link>
                        <Link
                            href="/financial-literacy"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-blue-100/80 ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-800'}`}
                        >
                            Education
                        </Link>
                        <Link
                            href="/about"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-blue-100/80 ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-800'}`}
                        >
                            About
                        </Link>
                        <Link
                            href="/loan-chat"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-blue-100/80 ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-800'}`}
                        >
                            Loan-ChatBot
                        </Link>

                        <div className="ml-4 flex items-center space-x-3">
                            <Link
                                href="/user/login"
                                className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${isScrolled
                                    ? 'border-blue-500 text-blue-600 hover:bg-blue-50'
                                    : 'border-white/30 text-white hover:bg-white/10'
                                    }`}
                            >
                                Login
                            </Link>
                            <Link
                                href="/user/signup"
                                className="px-5 py-2 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-300/50"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="lg:hidden text-blue-600 focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={isScrolled ? "currentColor" : "white"}>
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
                        className="lg:hidden mt-4 bg-white rounded-xl shadow-xl p-4"
                    >
                        {/* Manual links for mobile as well */}
                        <Link
                            href="/"
                            className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/loan-guide"
                            className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Guidance
                        </Link>
                        <Link
                            href="/check-eligibility"
                            className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Eligibility
                        </Link>
                        <Link
                            href="/financial-education"
                            className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Education
                        </Link>
                        <Link
                            href="/about-us"
                            className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            About
                        </Link>

                        <div className="mt-4 flex flex-col space-y-2 pt-4 border-t border-gray-100">
                            <Link
                                href="/user/login"
                                className="px-4 py-3 rounded-lg text-center text-blue-600 border border-blue-200 hover:bg-blue-50 transition-all"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/user/signup"
                                className="px-4 py-3 rounded-lg text-center bg-blue-600 text-white hover:bg-blue-700 transition-all"
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