"use client"
import React, { useState, useEffect } from 'react'
import ChatInterface from '../LoanChat/ChatInterface'
import FlowChart from '../FlowChart/FlowChart'
import LoanChatInterface from './LoanChatInterface'
// import LoanGuidanceAgent from '../LoanGuidanceAgent/LoanGuidanceAgent'
import { X, FileText, MessageCircle, BarChart, ChevronRight, Download, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const LoanAppGuide = () => {
  const [showDocuments, setShowDocuments] = useState(false);
  const [showSampleForm, setShowSampleForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'guidance'>('guidance');
  const [selectedLoanType, setSelectedLoanType] = useState<string | null>(null);
  const [showFlowChart, setShowFlowChart] = useState(false);

  // Available loan types for reference
  const loanTypes = [
    { id: 'personal', name: 'Personal Loan', description: 'For personal expenses, debt consolidation, or emergencies' },
    { id: 'home', name: 'Home Loan', description: 'For purchasing, constructing, or renovating a house' },
    { id: 'car', name: 'Car Loan', description: 'For purchasing a new or used vehicle' },
    { id: 'education', name: 'Education Loan', description: 'For higher education expenses in India or abroad' },
    { id: 'business', name: 'Business Loan', description: 'For business expansion, working capital, or equipment purchase' }
  ];

  // Function to handle loan type detection from chat
  const handleLoanTypeDetection = (loanType: string) => {
    setSelectedLoanType(loanType);
    setShowFlowChart(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-2 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Loan Application Guide</h1>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => setShowSampleForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FileText size={18} />
            <span className="font-medium">Sample Application</span>
          </button>
          
          <button 
            onClick={() => setShowDocuments(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FileText size={18} />
            <span className="font-medium">Required Documents</span>
          </button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        {/* Left Column - Chat Interface with Tabs */}
        <div className="lg:w-1/2 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-shrink-0">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Loan Assistant</h2>
              
              {/* Tabs */}
              <div className="flex rounded-lg bg-blue-700/30 p-1">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-4 py-1.5 text-sm rounded-md transition-all duration-300 ${
                    activeTab === 'chat' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-blue-100 hover:bg-blue-800/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BarChart size={16} />
                    <span className="font-medium">Chat Assistant</span>
                  </div>
                </button>
              </div>
            </div>
            <p className="text-sm text-blue-100 mt-2 opacity-90">
              {activeTab === 'guidance' 
                ? 'Step-by-step guidance through the loan application process' 
                : 'Ask any questions about your loan application'}
            </p>
          </div>
          
          {/* Voice-based Loan Chat Interface */}
          <div className="flex-1 overflow-auto">
            <LoanChatInterface 
              onLoanTypeSelected={handleLoanTypeDetection}
              loanType={selectedLoanType}
            />
          </div>
        </div>

        {/* Right Column - Flow Chart (Full Width) */}
        <div className="lg:w-1/2 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Application Process</h2>
            </div>
            <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-600 rounded-full text-xs font-medium">Flow Chart</span>
          </div>
          <div className="flex-1 overflow-auto">
            {showFlowChart ? (
              <FlowChart loanType={selectedLoanType} />
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-white to-blue-50">
                <div className="text-center p-8 max-w-md">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <MessageCircle className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">Tell Us About Your Loan</h3>
                  <p className="text-gray-600">Please speak to our assistant about what type of loan you're interested in to see a detailed application process flow chart.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sample Application Form PDF Viewer */}
      <AnimatePresence>
        {showSampleForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
            >
              <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                  <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    {selectedLoanType ? `${selectedLoanType.charAt(0).toUpperCase() + selectedLoanType.slice(1)} Loan Application Sample` : 'Sample Loan Application Form'}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <a 
                    href="/sample-application.pdf" 
                    download
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition-colors"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </a>
                  <button 
                    onClick={() => setShowSampleForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* PDF Viewer */}
                <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
                  <div className="w-full h-[70vh] bg-white rounded-lg shadow-md overflow-hidden">
                    {/* PDF Embed - Note: This assumes you have a sample PDF at this path */}
                    <iframe 
                      src="/sample-application.pdf#toolbar=0" 
                      className="w-full h-full"
                      title="Sample Loan Application Form"
                    >
                      Your browser does not support PDFs. Please download the PDF to view it.
                    </iframe>
                  </div>
                  
                  <div className="mt-4 flex justify-between w-full">
                    <div className="text-sm text-gray-600">
                      <p>This is a sample application form for reference purposes only.</p>
                    </div>
                    <div className="flex gap-3">
                      <a 
                        href="/sample-application.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-white text-blue-600 rounded-md text-sm hover:bg-blue-50 transition-colors border border-blue-100"
                      >
                        <ExternalLink size={16} />
                        <span>Open in New Tab</span>
                      </a>
                      <a 
                        href="/sample-application.pdf" 
                        download
                        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md text-sm hover:shadow-md transition-all"
                      >
                        <Download size={16} />
                        <span>Download PDF</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Popup */}
      <AnimatePresence>
        {showDocuments && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              className="bg-white rounded-xl shadow-2xl max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
            >
              <div className="flex items-center justify-between p-5 border-b">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                  <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Required Documents</h2>
                </div>
                <button 
                  onClick={() => setShowDocuments(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mt-0.5 shadow-md">1</div>
                    <div>
                      <h3 className="font-bold text-gray-800">Identity Proof</h3>
                      <p className="text-sm text-gray-600 mt-1">Aadhaar Card, PAN Card, Voter ID, Passport</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mt-0.5 shadow-md">2</div>
                    <div>
                      <h3 className="font-bold text-gray-800">Income Proof</h3>
                      <p className="text-sm text-gray-600 mt-1">Salary slips (3 months), Form 16, Income Tax Returns (2 years)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mt-0.5 shadow-md">3</div>
                    <div>
                      <h3 className="font-bold text-gray-800">Address Proof</h3>
                      <p className="text-sm text-gray-600 mt-1">Utility bills (electricity, water), Rental agreement, Property documents</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mt-0.5 shadow-md">4</div>
                    <div>
                      <h3 className="font-bold text-gray-800">Bank Statements</h3>
                      <p className="text-sm text-gray-600 mt-1">Last 6 months' bank statements with transaction details</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mt-0.5 shadow-md">5</div>
                    <div>
                      <h3 className="font-bold text-gray-800">Photographs</h3>
                      <p className="text-sm text-gray-600 mt-1">Recent passport-sized photographs (2-4 copies)</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-7 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg text-sm text-blue-700 border border-blue-100">
                  <p className="font-bold mb-1">Important Note:</p>
                  <p>All documents should be self-attested and originals may be required for verification.</p>
                </div>
                
                <button 
                  onClick={() => setShowDocuments(false)}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
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