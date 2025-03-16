"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

interface FlowChartProps {
  title?: string;
  description?: string;
  className?: string;
  loanType?: string | null;
}

interface CardData {
  id: number;
  title: string;
  content: string;
  icon: string;
  gradient: string;
  details?: string;
  requirements?: string;
}

const FlowChart: React.FC<FlowChartProps> = ({ 
  title = "Process Flow", 
  description = "Visual representation of the process flow",
  className = "",
  loanType = null
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
    { y: 200 },    // Application Submission
    { y: 550 },    // Evaluation of Applicant
    { y: 900 },    // Property & Legal Evaluation
    { y: 1250 },   // Process Start
    { y: 1600 },   // Legal Check
    { y: 1950 },   // Committee Sanction
    { y: 2300 },   // Collection & Report
    { y: 2650 },   // Loan Release
  ];

  // Updated paths for vertical connecting lines
  const paths = [
    `M${lineX} 200 L${lineX} 550`,   // Application Submission to Evaluation
    `M${lineX} 550 L${lineX} 900`,   // Evaluation to Property
    `M${lineX} 900 L${lineX} 1250`,  // Property to Process Start
    `M${lineX} 1250 L${lineX} 1600`, // Process Start to Legal Check
    `M${lineX} 1600 L${lineX} 1950`, // Legal Check to Committee
    `M${lineX} 1950 L${lineX} 2300`, // Committee to Collection
    `M${lineX} 2300 L${lineX} 2650`, // Collection to Loan Release
  ];

  // Define loan-specific data
  const getLoanSpecificData = () => {
    // Default/general loan process
    const defaultData = [
      { 
        id: 1, 
        title: "Application Submission", 
        content: "Application form is filled and submitted with required details",
        details: "The first step involves completing the loan application form with personal, financial, and employment information.",
        requirements: "Valid ID proof, contact details, and basic financial information are needed at this stage.",
        icon: "📝",
        gradient: "from-blue-500 to-indigo-600"
      },
      { 
        id: 2, 
        title: "Evaluation of Applicant", 
        content: "Check ITR, Bank Statements and verify provided details",
        details: "The bank evaluates your creditworthiness by analyzing your income, credit history, and existing financial obligations.",
        requirements: "Income tax returns, bank statements for the last 6 months, and credit score report.",
        icon: "🔍",
        gradient: "from-indigo-500 to-purple-600"
      },
      { 
        id: 3, 
        title: "Property & Legal Evaluation", 
        content: "Evaluate property and perform legal checks",
        details: "For secured loans, the collateral property is assessed for its market value and legal status.",
        requirements: "Property documents, legal title verification, and valuation report.",
        icon: "🏠",
        gradient: "from-purple-500 to-pink-600"
      },
      { 
        id: 4, 
        title: "Process Start", 
        content: "Document verification and physical authority grants",
        details: "All submitted documents are thoroughly verified for authenticity and completeness.",
        requirements: "Original documents for verification and additional information if requested.",
        icon: "🔄",
        gradient: "from-pink-500 to-red-600"
      },
      { 
        id: 5, 
        title: "Legal Check", 
        content: "Ensure compliance with legal norms and verify certificates",
        details: "Legal experts verify that all aspects of the loan comply with regulatory requirements.",
        requirements: "Legal clearance certificates and compliance documents.",
        icon: "⚖️",
        gradient: "from-red-500 to-orange-600"
      },
      { 
        id: 6, 
        title: "Committee Sanction", 
        content: "Review, sanction and collect original documents",
        details: "The loan approval committee reviews the application and makes the final decision on loan approval.",
        requirements: "All original documents must be submitted at this stage.",
        icon: "✅",
        gradient: "from-orange-500 to-yellow-600"
      },
      { 
        id: 7, 
        title: "Collection & Report", 
        content: "Prepare reports based on document verification",
        details: "Final reports are prepared summarizing all aspects of the loan application and approval process.",
        requirements: "Signing of loan agreement and acceptance of terms and conditions.",
        icon: "📊",
        gradient: "from-yellow-500 to-green-600"
      },
      { 
        id: 8, 
        title: "Loan Release", 
        content: "Final verification and loan disbursement to applicant",
        details: "After all verifications are complete, the loan amount is disbursed to your account or as per the loan agreement.",
        requirements: "Signed loan agreement, post-dated checks (if applicable), and ECS mandate.",
        icon: "💰",
        gradient: "from-green-500 to-teal-600"
      }
    ];

    // Home loan specific process
    const homeLoanData = [
      { 
        id: 1, 
        title: "Home Loan Application", 
        content: "Submit application with property details and personal information",
        details: "Complete the home loan application with your personal details, employment information, and property specifics.",
        requirements: "Identity proof, address proof, income proof, and property details document.",
        icon: "🏠",
        gradient: "from-blue-500 to-indigo-600"
      },
      { 
        id: 2, 
        title: "Income Assessment", 
        content: "Evaluation of income, credit score, and repayment capacity",
        details: "The lender evaluates your income stability, credit history, and ability to repay the loan amount.",
        requirements: "Salary slips, Form 16, ITR for last 2 years, and bank statements for 6 months.",
        icon: "💼",
        gradient: "from-indigo-500 to-purple-600"
      },
      { 
        id: 3, 
        title: "Property Valuation", 
        content: "Technical and legal assessment of the property",
        details: "The property is evaluated to determine its market value, construction quality, and compliance with local regulations.",
        requirements: "Property documents, approved building plan, and NOC from relevant authorities.",
        icon: "📏",
        gradient: "from-purple-500 to-pink-600"
      },
      { 
        id: 4, 
        title: "Title Verification", 
        content: "Legal verification of property ownership and documents",
        details: "Legal experts verify the property title to ensure it's clear of disputes and encumbrances.",
        requirements: "Original property deed, chain of title documents, and encumbrance certificate.",
        icon: "📜",
        gradient: "from-pink-500 to-red-600"
      },
      { 
        id: 5, 
        title: "Loan Approval", 
        content: "Final approval of loan amount and terms",
        details: "Based on all assessments, the lender approves the loan amount, interest rate, and repayment tenure.",
        requirements: "Acceptance of loan offer letter and terms and conditions.",
        icon: "✅",
        gradient: "from-red-500 to-orange-600"
      },
      { 
        id: 6, 
        title: "Documentation", 
        content: "Signing of loan agreement and mortgage documents",
        details: "All legal documents including the loan agreement and mortgage deed are signed by all parties.",
        requirements: "Presence of all applicants, co-applicants, and guarantors (if any) for document signing.",
        icon: "📝",
        gradient: "from-orange-500 to-yellow-600"
      },
      { 
        id: 7, 
        title: "Property Registration", 
        content: "Registration of property and mortgage with authorities",
        details: "The property and mortgage are registered with the local registration authority to create a legal record.",
        requirements: "Registration fees, stamp duty payment, and presence for registration process.",
        icon: "🏛️",
        gradient: "from-yellow-500 to-green-600"
      },
      { 
        id: 8, 
        title: "Disbursement", 
        content: "Release of loan amount to seller or builder",
        details: "The loan amount is disbursed directly to the seller, builder, or as per the agreement in case of construction.",
        requirements: "Completion of all pending requirements and submission of post-dated checks or ECS mandate.",
        icon: "💰",
        gradient: "from-green-500 to-teal-600"
      }
    ];

    // Personal loan specific process
    const personalLoanData = [
      { 
        id: 1, 
        title: "Personal Loan Application", 
        content: "Submit application with personal and financial details",
        details: "Complete the personal loan application form with your contact information, employment details, and financial background.",
        requirements: "Valid ID proof, address proof, and contact information are required at this stage.",
        icon: "📝",
        gradient: "from-blue-500 to-indigo-600"
      },
      { 
        id: 2, 
        title: "Credit Check", 
        content: "Verification of credit score and history",
        details: "The lender evaluates your credit history, including your credit score and past repayment behavior.",
        requirements: "Credit bureau authorization form and consent for credit history check.",
        icon: "📊",
        gradient: "from-indigo-500 to-purple-600"
      },
      { 
        id: 3, 
        title: "Income Verification", 
        content: "Assessment of income and employment stability",
        details: "Your income sources and employment stability are verified to ensure you can repay the loan.",
        requirements: "Recent salary slips, bank statements for the last 3-6 months, and employment verification letter.",
        icon: "💼",
        gradient: "from-purple-500 to-pink-600"
      },
      { 
        id: 4, 
        title: "Debt-to-Income Analysis", 
        content: "Evaluation of existing debts and repayment capacity",
        details: "The lender calculates your debt-to-income ratio to assess your ability to take on additional debt.",
        requirements: "Details of existing loans, credit card statements, and other financial obligations.",
        icon: "⚖️",
        gradient: "from-pink-500 to-red-600"
      },
      { 
        id: 5, 
        title: "Loan Approval", 
        content: "Decision on loan amount and interest rate",
        details: "Based on your credit profile and income assessment, the lender approves the loan amount and sets the interest rate.",
        requirements: "Acceptance of the loan offer terms and conditions.",
        icon: "✅",
        gradient: "from-red-500 to-orange-600"
      },
      { 
        id: 6, 
        title: "Documentation", 
        content: "Signing of loan agreement and terms",
        details: "All legal documents including the loan agreement are signed to formalize the arrangement.",
        requirements: "Signed loan agreement, ECS mandate form, and post-dated checks (if applicable).",
        icon: "📄",
        gradient: "from-orange-500 to-yellow-600"
      },
      { 
        id: 7, 
        title: "Verification Call", 
        content: "Final verification call to confirm details",
        details: "A representative calls to verify your identity and confirm your understanding of the loan terms.",
        requirements: "Availability for the verification call and ability to answer security questions.",
        icon: "📞",
        gradient: "from-yellow-500 to-green-600"
      },
      { 
        id: 8, 
        title: "Disbursement", 
        content: "Transfer of loan amount to personal account",
        details: "After all verifications are complete, the loan amount is transferred directly to your bank account.",
        requirements: "Active bank account details and completed KYC verification.",
        icon: "💰",
        gradient: "from-green-500 to-teal-600"
      }
    ];

    // Business loan specific process
    const businessLoanData = [
      { 
        id: 1, 
        title: "Business Loan Application", 
        content: "Submit application with business details and financial statements",
        details: "Complete the business loan application with company information, business model, and financial requirements.",
        requirements: "Business registration documents, company profile, and loan purpose statement.",
        icon: "🏢",
        gradient: "from-blue-500 to-indigo-600"
      },
      { 
        id: 2, 
        title: "Business Assessment", 
        content: "Evaluation of business model, revenue, and stability",
        details: "The lender evaluates your business model, revenue streams, and overall business stability.",
        requirements: "Business plan, profit projections, and market analysis documents.",
        icon: "📈",
        gradient: "from-indigo-500 to-purple-600"
      },
      { 
        id: 3, 
        title: "Financial Analysis", 
        content: "Review of balance sheets, profit & loss, and cash flow",
        details: "A detailed analysis of your business financial statements to assess financial health and repayment capacity.",
        requirements: "Last 2-3 years of balance sheets, P&L statements, cash flow statements, and tax returns.",
        icon: "💹",
        gradient: "from-purple-500 to-pink-600"
      },
      { 
        id: 4, 
        title: "Market Evaluation", 
        content: "Assessment of industry trends and business potential",
        details: "The lender evaluates your industry's current trends, market position, and future growth potential.",
        requirements: "Industry analysis reports, competitor information, and market share data.",
        icon: "🔍",
        gradient: "from-pink-500 to-red-600"
      },
      { 
        id: 5, 
        title: "Collateral Assessment", 
        content: "Evaluation of business assets or personal guarantees",
        details: "Assessment of the collateral offered or personal guarantees provided to secure the loan.",
        requirements: "Asset valuation reports, property documents, or personal guarantee documentation.",
        icon: "🔐",
        gradient: "from-red-500 to-orange-600"
      },
      { 
        id: 6, 
        title: "Loan Approval", 
        content: "Decision on loan amount, terms, and conditions",
        details: "Based on all assessments, the lender approves the loan amount and sets the terms and conditions.",
        requirements: "Acceptance of loan offer and terms sheet.",
        icon: "✅",
        gradient: "from-orange-500 to-yellow-600"
      },
      { 
        id: 7, 
        title: "Documentation", 
        content: "Signing of loan agreement and business guarantees",
        details: "All legal documents including loan agreements, collateral agreements, and guarantees are signed.",
        requirements: "Presence of all business partners/directors for document signing and company seal.",
        icon: "📑",
        gradient: "from-yellow-500 to-green-600"
      },
      { 
        id: 8, 
        title: "Disbursement", 
        content: "Transfer of loan amount to business account",
        details: "After all verifications are complete, the loan amount is transferred to your business account.",
        requirements: "Business bank account details and completion of all pending requirements.",
        icon: "💰",
        gradient: "from-green-500 to-teal-600"
      }
    ];

    // Education loan specific process
    const educationLoanData = [
      { 
        id: 1, 
        title: "Education Loan Application", 
        content: "Submit application with course and institution details",
        details: "Complete the education loan application with details about the course, institution, and estimated expenses.",
        requirements: "Student ID, course brochure, and institution details.",
        icon: "🎓",
        gradient: "from-blue-500 to-indigo-600"
      },
      { 
        id: 2, 
        title: "Course Verification", 
        content: "Verification of course eligibility and institution accreditation",
        details: "The lender verifies that the course and institution are eligible for education loan financing.",
        requirements: "Institution accreditation certificates and course recognition documents.",
        icon: "📚",
        gradient: "from-indigo-500 to-purple-600"
      },
      { 
        id: 3, 
        title: "Admission Confirmation", 
        content: "Verification of admission letter and course acceptance",
        details: "Confirmation that you have been accepted into the course for which the loan is being requested.",
        requirements: "Official admission letter, course acceptance confirmation, and fee structure.",
        icon: "✉️",
        gradient: "from-purple-500 to-pink-600"
      },
      { 
        id: 4, 
        title: "Co-applicant Assessment", 
        content: "Evaluation of parent/guardian financial stability",
        details: "Assessment of the co-applicant's (usually parent or guardian) financial stability and repayment capacity.",
        requirements: "Co-applicant's income proof, credit history, and relationship proof with the student.",
        icon: "👨‍👩‍👧",
        gradient: "from-pink-500 to-red-600"
      },
      { 
        id: 5, 
        title: "Cost Estimation", 
        content: "Calculation of tuition, living expenses, and other costs",
        details: "Detailed calculation of all costs including tuition fees, accommodation, books, equipment, and living expenses.",
        requirements: "Fee structure from institution, accommodation costs proof, and estimated living expenses breakdown.",
        icon: "🧮",
        gradient: "from-red-500 to-orange-600"
      },
      { 
        id: 6, 
        title: "Loan Approval", 
        content: "Decision on loan amount and repayment schedule",
        details: "Based on all assessments, the lender approves the loan amount and sets the repayment schedule.",
        requirements: "Acceptance of loan offer and repayment terms.",
        icon: "✅",
        gradient: "from-orange-500 to-yellow-600"
      },
      { 
        id: 7, 
        title: "Documentation", 
        content: "Signing of loan agreement and guarantor documents",
        details: "All legal documents including the loan agreement and guarantor commitments are signed.",
        requirements: "Presence of student and co-applicant/guarantor for document signing.",
        icon: "📄",
        gradient: "from-yellow-500 to-green-600"
      },
      { 
        id: 8, 
        title: "Disbursement", 
        content: "Direct payment to institution and/or student account",
        details: "The loan amount is typically disbursed directly to the institution for tuition fees, with living expenses sent to the student's account.",
        requirements: "Institution's bank details, student's bank account, and disbursement schedule acceptance.",
        icon: "💰",
        gradient: "from-green-500 to-teal-600"
      }
    ];

    // Car loan specific process
    const carLoanData = [
      { 
        id: 1, 
        title: "Car Loan Application", 
        content: "Submit application with vehicle details and personal information",
        details: "Complete the car loan application with your personal information and details about the vehicle you wish to purchase.",
        requirements: "Valid ID proof, address proof, and vehicle quotation from dealer.",
        icon: "🚗",
        gradient: "from-blue-500 to-indigo-600"
      },
      { 
        id: 2, 
        title: "Income Verification", 
        content: "Assessment of income and repayment capacity",
        details: "The lender evaluates your income sources and stability to ensure you can afford the car loan repayments.",
        requirements: "Salary slips for the last 3 months, bank statements, and income tax returns.",
        icon: "💼",
        gradient: "from-indigo-500 to-purple-600"
      },
      { 
        id: 3, 
        title: "Vehicle Valuation", 
        content: "Verification of vehicle cost and market value",
        details: "The lender verifies the vehicle's cost, market value, and resale potential as it serves as collateral.",
        requirements: "Vehicle proforma invoice, model specifications, and dealer certification.",
        icon: "🔍",
        gradient: "from-purple-500 to-pink-600"
      },
      { 
        id: 4, 
        title: "Credit Check", 
        content: "Evaluation of credit score and history",
        details: "Your credit history and score are evaluated to assess your creditworthiness and loan eligibility.",
        requirements: "Credit bureau authorization and consent for credit history check.",
        icon: "📊",
        gradient: "from-pink-500 to-red-600"
      },
      { 
        id: 5, 
        title: "Loan Approval", 
        content: "Decision on loan amount, interest rate, and tenure",
        details: "Based on all assessments, the lender approves the loan amount, interest rate, and repayment period.",
        requirements: "Acceptance of loan offer terms and down payment confirmation.",
        icon: "✅",
        gradient: "from-red-500 to-orange-600"
      },
      { 
        id: 6, 
        title: "Documentation", 
        content: "Signing of loan agreement and hypothecation",
        details: "All legal documents including the loan agreement and hypothecation deed are signed.",
        requirements: "Signed loan agreement, ECS mandate, and down payment receipt.",
        icon: "📝",
        gradient: "from-orange-500 to-yellow-600"
      },
      { 
        id: 7, 
        title: "Insurance Verification", 
        content: "Confirmation of comprehensive vehicle insurance",
        details: "Verification that the vehicle has comprehensive insurance coverage with the lender as co-beneficiary.",
        requirements: "Comprehensive insurance policy with bank clause and receipt of premium payment.",
        icon: "🛡️",
        gradient: "from-yellow-500 to-green-600"
      },
      { 
        id: 8, 
        title: "Disbursement", 
        content: "Payment to dealer and vehicle registration",
        details: "The loan amount is disbursed directly to the dealer, and the vehicle is registered with hypothecation to the lender.",
        requirements: "Dealer's bank details, delivery order, and registration application with hypothecation.",
        icon: "💰",
        gradient: "from-green-500 to-teal-600"
      }
    ];

    // Return the appropriate data based on loan type
    switch(loanType) {
      case 'home':
        return homeLoanData;
      case 'personal':
        return personalLoanData;
      case 'business':
        return businessLoanData;
      case 'education':
        return educationLoanData;
      case 'car':
        return carLoanData;
      default:
        return defaultData;
    }
  };

  // Define fallback data based on loan type
  const fallbackData: CardData[] = getLoanSpecificData();

  // Fetch data from OpenAI
  useEffect(() => {
    const fetchDataFromOpenAI = async () => {
      setIsLoading(true);
      setApiError(null);
      
      try {
        console.log('Fetching rephrased content from OpenAI...', loanType ? `for ${loanType} loan` : '');
        
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
            type: 'loan_process',
            loanType: loanType || 'general',
            includeDetails: true // Request additional details
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
        
        // Process the response data
        let processedData: CardData[] = [];
        
        // Try multiple fallback patterns for the response format
        if (data.rephrased && Array.isArray(data.rephrased) && data.rephrased.length > 0) {
          console.log('Using rephrased data from OpenAI (standard format)');
          processedData = data.rephrased as CardData[];
        } else if (Array.isArray(data) && data.length > 0) {
          console.log('Using rephrased data from OpenAI (direct array)');
          processedData = data as CardData[];
        } else if (typeof data === 'object' && Object.keys(data).length > 0) {
          // Try to find any array in the response
          const firstArrayKey = Object.keys(data).find(key => Array.isArray(data[key]) && data[key].length > 0);
          if (firstArrayKey) {
            console.log(`Using rephrased data from OpenAI (found in key: ${firstArrayKey})`);
            processedData = data[firstArrayKey] as CardData[];
          } else {
            throw new Error('Invalid response format: No valid array found in response');
          }
        } else {
          throw new Error('Invalid response format: Expected array of card data');
        }
        
        // Ensure all cards have details and requirements fields
        const enhancedData = processedData.map((card: any, index: number) => {
          // Create a new object with the correct type
          const enhancedCard: CardData = {
            id: card.id,
            title: card.title,
            content: card.content,
            icon: card.icon,
            gradient: card.gradient,
            details: card.details || fallbackData[index]?.details,
            requirements: card.requirements || fallbackData[index]?.requirements
          };
          return enhancedCard;
        });
        
        setCardData(enhancedData);
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
  }, [loanType]); // Add loanType as a dependency

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
      
      // Check if the position exists before accessing its y property
      if (positions[lastCardIndex] && typeof positions[lastCardIndex].y === 'number') {
        // Calculate the scroll position to center the card in the viewport
        const cardPosition = positions[lastCardIndex].y;
        const containerHeight = containerRef.current.clientHeight;
        const scrollTarget = cardPosition - (containerHeight / 3); // Show more context above the card
        
        // Scroll to the calculated position with a smooth animation
        containerRef.current.scrollTo({
          top: Math.max(0, scrollTarget),
          behavior: 'smooth'
        });
      }
    }
  }, [visibleCards]);

  // Generate the path data for the continuous flow line
  const generatePathData = () => {
    if (visibleCards.length === 0) return '';
    
    const lineX = 100; // X position of the vertical line
    let pathData = `M${lineX} ${positions[visibleCards[0]]?.y || 0}`;
    
    for (let i = 1; i < visibleCards.length; i++) {
      const index = visibleCards[i];
      if (index > 0 && positions[index]) { // Check if positions[index] exists
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
    
    // Show first card immediately
    setTimeout(() => {
      setVisibleCards([0]);
    }, 500);
    
    // Then add remaining cards with a delay
    let currentIndex = 1;
    const interval = setInterval(() => {
      if (currentIndex < cardData.length) {
        setVisibleCards(prev => [...prev, currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        // Scroll to the bottom after all cards are shown
        setTimeout(() => {
          scrollToBottom();
        }, 1000);
      }
    }, 2500); // 2.5 seconds between cards

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
        top: positions[positions.length - 1].y + 300,
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
    <div className={`relative bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl overflow-hidden ${className}`}>
      
      {/* Title and Description */}
      <div className="p-6 pb-3 border-b border-blue-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">{title}</h2>
        </div>
        <p className="text-gray-600 ml-4">{description}</p>
        {apiError && (
          <div className="mt-2 p-2 bg-red-50 text-red-600 text-sm rounded-md">
            Error: {apiError}
          </div>
        )}
      </div>
      
      {/* Scroll Controls */}
      <div className="flex justify-between px-6 py-3 items-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center">
          <div className="h-1.5 w-40 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${scrollProgress * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium text-gray-500 ml-2">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={scrollToTop}
            className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 rounded-md text-sm flex items-center gap-1 transition-colors shadow-sm border border-blue-100"
          >
            <span>↑</span> Top
          </button>
          <button 
            onClick={scrollToBottom}
            className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 rounded-md text-sm flex items-center gap-1 transition-colors shadow-sm border border-blue-100"
          >
            <span>↓</span> Bottom
          </button>
        </div>
      </div>
      
      {/* Flowchart Container */}
      <div ref={containerRef} className="relative w-full h-[800px] overflow-auto pb-20">
        <div className="min-h-[3000px] relative" style={{ height: `${Math.max(3000, positions[positions.length - 1]?.y + 500 || 3000)}px` }}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="relative">
                <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                <div className="w-16 h-16 border-l-4 border-r-4 border-transparent border-t-4 border-purple-500 rounded-full animate-spin absolute top-0 left-0" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
            </div>
          ) : (
            <>
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-4000"></div>
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-indigo-50 rounded-full mix-blend-multiply opacity-30 animate-blob"></div>
                <div className="absolute top-2/3 right-1/3 w-60 h-60 bg-purple-50 rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-2000"></div>
              </div>

              {/* Main Vertical Line */}
              <div 
                className="absolute top-0 bottom-0 w-[6px] bg-gradient-to-b from-blue-400 via-indigo-500 to-purple-500 transform -translate-x-1/2 opacity-30 rounded-full"
                style={{ left: `${lineX}px` }}
              ></div>

              {/* Continuous Flow Line */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <motion.path
                  d={generatePathData()}
                  stroke="url(#gradientLine)"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                  filter="drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))"
                />
                <defs>
                  <linearGradient id="gradientLine" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#D946EF" />
                  </linearGradient>
                  <linearGradient id="horizontalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
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
                      strokeWidth="4"
                      strokeDasharray="8 8"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1}}
                      transition={{ 
                        duration: 4.0, 
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
                      strokeWidth="4"
                      strokeDasharray="6 6"
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
                      className={`absolute bg-white rounded-xl shadow-lg p-5 w-80 h-auto flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border ${index === visibleCards.length - 1 ? 'border-blue-300 ring-4 ring-blue-100' : 'border-gray-100'}`}
                      style={{
                        left: cardX,
                        top: positions[index].y,
                        transform: "translateY(-50%)", // Center vertically
                        background: "linear-gradient(to bottom right, white, #f9faff)"
                      }}
                      initial={{ scale: 0.8, opacity: 0, x: -30 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ 
                        duration: 0.6,
                        scale: { type: "spring", stiffness: 300, damping: 20 }
                      }}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${card.gradient} flex items-center justify-center text-white text-xl shadow-md`}>
                          {card.icon}
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                          <TypeAnimation
                            sequence={[card.title]}
                            wrapper="span"
                            speed={50}
                            repeat={0}
                            cursor={false}
                          />
                        </h4>
                      </div>
                      
                      <div className="text-gray-600 text-sm flex-grow space-y-3">
                        <TypeAnimation
                          sequence={['', 500, card.content]}
                          wrapper="p"
                          speed={90}
                          repeat={0}
                          cursor={false}
                          className="font-medium"
                        />
                        
                        {/* Additional details section */}
                        {card.details && (
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <h5 className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Additional Details:</h5>
                            <TypeAnimation
                              sequence={['', 1000, card.details]}
                              wrapper="p"
                              speed={90}
                              repeat={0}
                              cursor={false}
                              className="text-xs text-gray-600 leading-relaxed"
                            />
                          </div>
                        )}
                        
                        {/* Requirements section if available */}
                        {card.requirements && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <h5 className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Requirements:</h5>
                            <TypeAnimation
                              sequence={['', 1500, card.requirements]}
                              wrapper="p"
                              speed={90}
                              repeat={0}
                              cursor={false}
                              className="text-xs text-gray-600 leading-relaxed"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Step indicator */}
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {index + 1}
                      </div>
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
          animation: blob 15s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default FlowChart;