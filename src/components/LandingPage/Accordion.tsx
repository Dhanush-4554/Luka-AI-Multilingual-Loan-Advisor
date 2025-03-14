import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionProps {
    faq: {
        question: string;
        answer: string;
        icon: string;
        color: string;
    };
    index: number;
}

const Accordion: React.FC<AccordionProps> = ({ faq, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div 
            className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group ${isOpen ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
            whileHover={{ 
                y: -5,
                transition: { duration: 0.3 }
            }}
        >
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
                initial={false}
                animate={{ backgroundColor: isOpen ? 'rgba(239, 246, 255, 0.6)' : 'rgba(255, 255, 255, 1)' }}
            >
                <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${faq.color} flex items-center justify-center text-white shadow-md mr-4 flex-shrink-0`}>
                        <motion.i 
                            className={`fas fa-${faq.icon} text-lg`}
                            animate={{ rotate: isOpen ? 360 : 0 }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 pr-8">{faq.question}</h3>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-blue-500 flex-shrink-0"
                >
                    <i className="fas fa-chevron-down text-xl"></i>
                </motion.div>
            </motion.button>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 border-t border-gray-100">
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Accordion;