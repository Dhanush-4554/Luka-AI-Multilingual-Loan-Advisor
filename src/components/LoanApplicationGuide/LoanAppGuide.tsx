"use client"
import React, { useState } from 'react'
import ChatInterface from '../LoanChat/ChatInterface'
import FlowChart from '../FlowChart/FlowChart'
import LoanChatInterface from './LoanChatInterface'
import LoanGuidanceAgent from '../LoanGuidanceAgent/LoanGuidanceAgent'
import { X, FileText, MessageCircle, BarChart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const LoanAppGuide = () => {
  const [showDocuments, setShowDocuments] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'guidance'>('guidance');

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Loan Application Guide</h1>
        
        {/* Document Button */}
        <button 
          onClick={() => setShowDocuments(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          <FileText size={18} />
          <span>Required Documents</span>
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        {/* Left Column - Chat Interface with Tabs */}
        <div className="lg:w-1/2 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col">
          <div className="p-3 bg-blue-600 text-white flex-shrink-0">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Loan Assistant</h2>
              
              {/* Tabs */}
              <div className="flex rounded-lg bg-blue-700 p-1">
                
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    activeTab === 'chat' 
                      ? 'bg-white text-blue-600' 
                      : 'text-blue-100 hover:bg-blue-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <BarChart size={14} />
                    <span>Chat Assistant</span>
                  </div>
                </button>
              </div>
            </div>
            <p className="text-xs text-blue-100 mt-1">
              {activeTab === 'guidance' 
                ? 'Step-by-step guidance through the loan application process' 
                : 'Ask any questions about your loan application'}
            </p>
          </div>
          <div className="flex-1 overflow-auto">
             
              <LoanChatInterface />
      
          </div>
        </div>

        {/* Right Column - Flow Chart (Full Width) */}
        <div className="lg:w-1/2 bg-white rounded-xl shadow-lg p-4 border border-gray-100 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-800">Application Process</h2>
            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">Flow Chart</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg flex-1 overflow-hidden">
            <FlowChart />
          </div>
        </div>
      </div>

      {/* Document Popup */}
      <AnimatePresence>
        {showDocuments && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <FileText className="text-blue-600" size={20} />
                  <h2 className="text-lg font-semibold text-gray-800">Required Documents</h2>
                </div>
                <button 
                  onClick={() => setShowDocuments(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-5">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white mt-0.5">1</div>
                    <div>
                      <h3 className="font-medium text-gray-800">Identity Proof</h3>
                      <p className="text-sm text-gray-600">Aadhaar Card, PAN Card, Voter ID, Passport</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white mt-0.5">2</div>
                    <div>
                      <h3 className="font-medium text-gray-800">Income Proof</h3>
                      <p className="text-sm text-gray-600">Salary slips (3 months), Form 16, Income Tax Returns (2 years)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white mt-0.5">3</div>
                    <div>
                      <h3 className="font-medium text-gray-800">Address Proof</h3>
                      <p className="text-sm text-gray-600">Utility bills (electricity, water), Rental agreement, Property documents</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white mt-0.5">4</div>
                    <div>
                      <h3 className="font-medium text-gray-800">Bank Statements</h3>
                      <p className="text-sm text-gray-600">Last 6 months' bank statements with transaction details</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white mt-0.5">5</div>
                    <div>
                      <h3 className="font-medium text-gray-800">Photographs</h3>
                      <p className="text-sm text-gray-600">Recent passport-sized photographs (2-4 copies)</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  <p className="font-medium">Important Note:</p>
                  <p>All documents should be self-attested and originals may be required for verification.</p>
                </div>
                
                <button 
                  onClick={() => setShowDocuments(false)}
                  className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LoanAppGuide