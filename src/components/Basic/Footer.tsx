"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
    return (
        <footer className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white pt-20 pb-10 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-800/20 to-transparent"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
            </div>
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16"
                >
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                        >
                            <div className="flex items-center mb-6">
                                <motion.div 
                                    className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center mr-3 shadow-lg"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <span className="text-white text-xl font-bold">L</span>
                                </motion.div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                    Luka AI
                                </h2>
                            </div>
                            
                            <p className="text-blue-100 mb-8 max-w-md text-lg leading-relaxed">
                            Making loans simple and accessible for everyone through conversations that truly understand you.
                        </p>
                            
                        <div className="flex space-x-4">
                                {[
                                    { name: 'twitter', icon: 'fab fa-twitter' },
                                    { name: 'facebook', icon: 'fab fa-facebook-f' },
                                    { name: 'instagram', icon: 'fab fa-instagram' },
                                    { name: 'linkedin', icon: 'fab fa-linkedin-in' }
                                ].map((social) => (
                                    <motion.a
                                        key={social.name}
                                        href={`https://${social.name}.com`}
                                        className="bg-gradient-to-r from-blue-600/50 to-indigo-600/50 hover:from-blue-500 hover:to-indigo-500 p-3 rounded-full flex items-center justify-center w-10 h-10 shadow-lg backdrop-blur-sm border border-white/10"
                                        whileHover={{ 
                                            scale: 1.15, 
                                            y: -5,
                                            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <i className={`${social.icon} text-white text-sm`}></i>
                                    </motion.a>
                            ))}
                        </div>
                        </motion.div>
                    </div>

                    {[
                        {
                            title: "Product",
                            items: ['Features', 'Pricing', 'Case Studies', 'Reviews', 'Updates']
                        },
                        {
                            title: "Company",
                            items: ['About Us', 'Careers', 'Press', 'News', 'Contact']
                        },
                        {
                            title: "Resources",
                            items: ['Blog', 'Newsletter', 'Events', 'Help Center', 'Tutorials']
                        }
                    ].map((column, columnIndex) => (
                        <motion.div
                            key={column.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 + columnIndex * 0.1 }}
                        >
                            <h3 className="font-bold text-xl mb-6 bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                                {column.title}
                            </h3>
                            <ul className="space-y-3">
                                {column.items.map((item, itemIndex) => (
                                    <motion.li 
                                        key={item}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.3 + columnIndex * 0.1 + itemIndex * 0.05 }}
                                    >
                                        <Link 
                                            href={`/${item.toLowerCase().replace(' ', '-')}`} 
                                            className="text-blue-100 hover:text-white transition-all flex items-center group"
                                        >
                                            <motion.span 
                                                className="w-0 h-0.5 bg-blue-400 mr-0 opacity-0 group-hover:w-2 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300"
                                            ></motion.span>
                                        {item}
                                    </Link>
                                    </motion.li>
                            ))}
                        </ul>
                        </motion.div>
                    ))}
                </motion.div>

                

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="pt-8 border-t border-blue-700/50 flex flex-col md:flex-row justify-between items-center"
                >
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="text-blue-200 text-sm"
                    >
                        © {new Date().getFullYear()} Luka AI by 4D Devs. All rights reserved.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="flex flex-wrap mt-4 md:mt-0 gap-x-8"
                    >
                        {['Privacy Policy', 'Terms of Service', 'Cookies'].map((item, i) => (
                            <motion.div
                                key={item}
                                whileHover={{ y: -2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <Link 
                                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                                    className="text-blue-200 hover:text-white transition-all text-sm"
                                >
                                        {item}
                                    </Link>
                            </motion.div>
                            ))}
                    </motion.div>
                </motion.div>
                </div>

            {/* Bottom wave decoration */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30"></div>
        </footer>
    );
};

export default Footer;