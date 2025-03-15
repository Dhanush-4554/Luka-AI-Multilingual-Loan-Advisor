// Loan guidance utility functions
import OpenAI from 'openai';

// Define loan steps based on the flowchart
const LOAN_STEPS = {
  home: [
    {
      title: "Application Submission",
      content: "For a home loan, you'll need to submit an application form with your personal details, employment information, income details, and property information."
    },
    {
      title: "Evaluation of Applicant",
      content: "We'll evaluate your application by checking your credit score, income tax returns, bank statements, and employment history to assess your repayment capacity."
    },
    {
      title: "Property & Legal Evaluation",
      content: "Our team will evaluate the property you wish to purchase, checking its market value, legal status, and ensuring all property documents are in order."
    },
    {
      title: "Process Start",
      content: "Once initial evaluations are complete, we'll start the formal processing of your application, including document verification and physical inspections."
    },
    {
      title: "Legal Check",
      content: "Our legal team will conduct a thorough check of all property documents to ensure compliance with legal norms and verify all certificates."
    },
    {
      title: "Committee Sanction",
      content: "Your application will be reviewed by our loan committee who will make the final decision on sanctioning your loan and determine the loan amount and terms."
    },
    {
      title: "Collection & Report",
      content: "We'll collect all original documents like property agreements and prepare a comprehensive verification report."
    },
    {
      title: "Loan Release",
      content: "Once everything is verified and approved, the loan amount will be disbursed to your account or directly to the property seller as per your instructions."
    }
  ],
  personal: [
    {
      title: "Application Submission",
      content: "For a personal loan, you'll need to submit an application with your personal details, employment information, and income details."
    },
    {
      title: "Evaluation of Applicant",
      content: "We'll evaluate your application by checking your credit score, income tax returns, bank statements, and employment stability."
    },
    {
      title: "Document Verification",
      content: "Our team will verify all the documents you've submitted, including ID proofs, address proofs, and income documents."
    },
    {
      title: "Process Start",
      content: "Once initial evaluations are complete, we'll start the formal processing of your application."
    },
    {
      title: "Credit Assessment",
      content: "We'll conduct a detailed assessment of your credit history, existing loans, and repayment capacity."
    },
    {
      title: "Committee Sanction",
      content: "Your application will be reviewed by our loan committee who will make the final decision on sanctioning your loan."
    },
    {
      title: "Terms Finalization",
      content: "We'll finalize the loan terms including interest rate, tenure, and EMI amount based on your profile."
    },
    {
      title: "Loan Release",
      content: "Once approved, the loan amount will be disbursed directly to your bank account, usually within 24-48 hours."
    }
  ],
  business: [
    {
      title: "Application Submission",
      content: "For a business loan, you'll need to submit an application with your business details, financial statements, and business plan."
    },
    {
      title: "Business Evaluation",
      content: "We'll evaluate your business by analyzing financial statements, cash flow, business model, and market position."
    },
    {
      title: "Document Verification",
      content: "Our team will verify all business documents, including registration certificates, tax returns, and financial statements."
    },
    {
      title: "Process Start",
      content: "Once initial evaluations are complete, we'll start the formal processing of your application, which may include a site visit to your business."
    },
    {
      title: "Business Viability Check",
      content: "We'll assess the viability and sustainability of your business model and growth projections."
    },
    {
      title: "Committee Sanction",
      content: "Your application will be reviewed by our business loan committee who will make the final decision on sanctioning your loan."
    },
    {
      title: "Collateral Assessment",
      content: "If applicable, we'll assess the value of any collateral offered to secure the loan."
    },
    {
      title: "Loan Release",
      content: "Once approved, the loan amount will be disbursed to your business account according to the agreed terms."
    }
  ],
  education: [
    {
      title: "Application Submission",
      content: "For an education loan, you'll need to submit an application with your academic details, admission letter, and course information."
    },
    {
      title: "Student & Co-applicant Evaluation",
      content: "We'll evaluate both the student's academic record and the co-applicant's (usually parent/guardian) financial stability."
    },
    {
      title: "Institution Verification",
      content: "Our team will verify the educational institution and course details to ensure they meet our eligibility criteria."
    },
    {
      title: "Process Start",
      content: "Once initial evaluations are complete, we'll start the formal processing of your application."
    },
    {
      title: "Cost Assessment",
      content: "We'll assess the total cost of education including tuition fees, living expenses, and other related costs."
    },
    {
      title: "Committee Sanction",
      content: "Your application will be reviewed by our education loan committee who will make the final decision on sanctioning your loan."
    },
    {
      title: "Terms Finalization",
      content: "We'll finalize the loan terms including interest rate, repayment schedule, and moratorium period."
    },
    {
      title: "Loan Release",
      content: "Once approved, the loan amount will be disbursed directly to the educational institution in installments as per the fee schedule."
    }
  ],
  vehicle: [
    {
      title: "Application Submission",
      content: "For a vehicle loan, you'll need to submit an application with your personal details, vehicle details, and income information."
    },
    {
      title: "Applicant Evaluation",
      content: "We'll evaluate your application by checking your credit score, income stability, and repayment capacity."
    },
    {
      title: "Vehicle Verification",
      content: "Our team will verify the vehicle details, including make, model, price, and dealer information."
    },
    {
      title: "Process Start",
      content: "Once initial evaluations are complete, we'll start the formal processing of your application."
    },
    {
      title: "Loan-to-Value Assessment",
      content: "We'll determine the loan amount based on the vehicle value and our loan-to-value policy."
    },
    {
      title: "Committee Sanction",
      content: "Your application will be reviewed by our vehicle loan committee who will make the final decision on sanctioning your loan."
    },
    {
      title: "Insurance Verification",
      content: "We'll ensure that comprehensive insurance is arranged for the vehicle as per our loan requirements."
    },
    {
      title: "Loan Release",
      content: "Once approved, the loan amount will be disbursed directly to the vehicle dealer, and you'll need to complete the registration process."
    }
  ]
};

// Additional details for each step when user needs more information
const ADDITIONAL_DETAILS = {
  home: [
    "For the application, you'll need ID proof (Aadhaar, PAN), address proof, income proof (salary slips, Form 16), bank statements for the last 6 months, and property documents if available.",
    "During evaluation, we look at your credit score (ideally 750+), debt-to-income ratio (should be below 50%), employment stability (minimum 2 years preferred), and income tax returns for the last 2-3 years.",
    "Property evaluation includes checking the property's market value, legal status, construction approvals, and ensuring it's free from any encumbrances or legal disputes.",
    "The processing includes document verification, physical verification of your residence and workplace, and property inspection by our engineers.",
    "Legal checks involve title verification, encumbrance certificate verification, and checking for any pending legal issues related to the property.",
    "The committee considers factors like loan amount, property value, your repayment capacity, and credit history before sanctioning the loan.",
    "Original documents required include sale deed, previous chain of title documents, property tax receipts, and approved building plan.",
    "Loan disbursement can be in full or in installments depending on the construction stage of the property. You'll need to sign the loan agreement and provide post-dated checks for EMI payments."
  ],
  personal: [
    "For the application, you'll need ID proof (Aadhaar, PAN), address proof, latest salary slips, and bank statements for the last 3-6 months.",
    "During evaluation, we look at your credit score (ideally 700+), debt-to-income ratio (should be below 50%), and employment stability.",
    "We'll verify your identity documents, address proofs, income documents, and may contact your employer for employment verification.",
    "The processing includes background checks and a detailed analysis of your financial health and repayment capacity.",
    "Credit assessment involves checking your credit history, existing loans, credit card usage patterns, and overall financial discipline.",
    "The committee considers factors like loan amount, your repayment capacity, credit history, and relationship with the bank before sanctioning the loan.",
    "Terms will include interest rate (typically 10-18% for personal loans), tenure (1-5 years), processing fees, and prepayment conditions.",
    "After approval, you'll need to sign the loan agreement, provide security post-dated checks, and the amount will be credited to your account."
  ],
  business: [
    "For the application, you'll need business registration documents, GST registration, business PAN, financial statements for the last 2-3 years, and a detailed business plan.",
    "We evaluate your business performance, revenue growth, profit margins, market position, and future projections.",
    "We'll verify your business registration, tax compliance, financial statements, and may conduct industry analysis to understand your business context.",
    "The processing includes site visits to your business premises, meetings with key management, and detailed financial analysis.",
    "We assess your business model sustainability, competitive advantages, market conditions, and growth potential to ensure long-term viability.",
    "The committee considers factors like loan amount, business performance, collateral offered, industry outlook, and your business track record.",
    "If you're offering collateral, we'll assess its market value, liquidity, and legal status to determine the secured portion of the loan.",
    "After approval, you'll need to sign the loan agreement, complete security documentation if applicable, and the amount will be credited to your business account."
  ],
  education: [
    "For the application, you'll need the admission letter from the institution, course details, fee structure, student's academic records, and co-applicant's financial documents.",
    "We evaluate the student's academic performance and the co-applicant's income stability, credit history, and repayment capacity.",
    "We verify the recognition/accreditation of the institution, course duration, fee structure, and placement records.",
    "The processing includes verification of all submitted documents and assessment of the education loan eligibility.",
    "We calculate the total cost including tuition fees, hostel fees, books, equipment, travel expenses, and other related costs to determine the loan amount.",
    "The committee considers factors like course prospects, institution reputation, loan amount, and co-applicant's financial stability.",
    "Terms will include interest rate (typically lower for education loans), moratorium period (usually course duration plus 6-12 months), and repayment tenure.",
    "The loan amount is usually disbursed directly to the institution in installments as per the fee schedule, with living expenses portion credited to the student's account."
  ],
  vehicle: [
    "For the application, you'll need ID proof, address proof, income documents, vehicle quotation from the dealer, and details of the vehicle you wish to purchase.",
    "We evaluate your income stability, credit score, existing loans, and overall repayment capacity.",
    "We verify the vehicle details, market value, dealer credentials, and ensure the vehicle meets our financing criteria.",
    "The processing includes document verification and assessment of the loan-to-value ratio based on the vehicle type.",
    "Typically, we finance up to 80-90% of the on-road price for new vehicles and 70-80% for used vehicles, depending on the vehicle age and condition.",
    "The committee considers factors like vehicle type, loan amount, your repayment capacity, and credit history before sanctioning the loan.",
    "Comprehensive insurance is mandatory for the entire loan tenure, with the bank as the financier/co-beneficiary in the policy.",
    "After approval, the loan amount is disbursed to the dealer, and you'll need to register the vehicle with the bank as the financier in the RC book."
  ]
};

// Questions to ask at each step to ensure understanding
const UNDERSTANDING_QUESTIONS = [
  "Do you understand what documents you need to submit for the application? Do you have any questions about the application process?",
  "Do you understand how we'll evaluate your application? Is there anything about the evaluation process you'd like me to explain further?",
  "Do you understand what we'll be checking during the property/document evaluation? Do you have any concerns about this step?",
  "Do you understand what happens when we start processing your application? Is there anything about this process you'd like me to clarify?",
  "Do you understand what we'll be checking during the legal/credit assessment? Do you have any questions about this step?",
  "Do you understand how the committee makes decisions on loan sanctions? Is there anything about this process you'd like me to explain?",
  "Do you understand what original documents you'll need to provide? Do you have any questions about the collection process?",
  "Do you understand how the loan will be disbursed? Do you have any final questions about the loan release process?"
];

// Language codes for OpenAI translation
const LANGUAGE_CODES: Record<string, string> = {
  'en-IN': 'English',
  'hi-IN': 'Hindi',
  'ta-IN': 'Tamil',
  'te-IN': 'Telugu',
  'kn-IN': 'Kannada',
  'ml-IN': 'Malayalam',
  'mr-IN': 'Marathi',
  'gu-IN': 'Gujarati'
};

/**
 * Generate guidance for a specific loan type and step
 * @param loanType The type of loan (home, personal, business, education, vehicle)
 * @param step The current step in the process (1-8)
 * @param userMessage The user's message for context
 * @param language The language code
 * @returns Guidance text for the current step
 */
export async function generateLoanGuidance(
  loanType: string,
  step: number,
  userMessage: string,
  language: string
): Promise<string> {
  try {
    // Adjust step to be 0-indexed for array access
    const stepIndex = step - 1;
    
    // Get the loan steps for the specified loan type
    const loanSteps = LOAN_STEPS[loanType as keyof typeof LOAN_STEPS];
    
    if (!loanSteps || stepIndex < 0 || stepIndex >= loanSteps.length) {
      return "I'm sorry, I don't have information for this step. Let's continue with the application process.";
    }
    
    // Get the current step information
    const currentStep = loanSteps[stepIndex];
    
    // Check if this is the last step
    const isLastStep = stepIndex === loanSteps.length - 1;
    
    // Get additional details if the user needs more information
    const needsMoreDetails = userMessage.toLowerCase().includes("more") || 
                            userMessage.toLowerCase().includes("detail") ||
                            userMessage.toLowerCase().includes("explain") ||
                            userMessage.toLowerCase().includes("what") ||
                            userMessage.toLowerCase().includes("how");
    
    let baseResponse = "";
    
    if (needsMoreDetails) {
      const additionalDetails = ADDITIONAL_DETAILS[loanType as keyof typeof ADDITIONAL_DETAILS][stepIndex];
      baseResponse = `${currentStep.title}: ${currentStep.content}\n\nHere are more details: ${additionalDetails}`;
    } else {
      baseResponse = `${currentStep.title}: ${currentStep.content}`;
    }
    
    // Add understanding question if not the last step
    if (!isLastStep) {
      baseResponse += `\n\n${UNDERSTANDING_QUESTIONS[stepIndex]}`;
    } else {
      baseResponse += "\n\nCongratulations! You've completed all the steps of the loan application process. Is there anything else you'd like to know about your loan?";
    }
    
    // If language is English, return the base response
    if (language === 'en-IN') {
      return baseResponse;
    }
    
    // For other languages, use OpenAI to translate
    return await translateWithOpenAI(baseResponse, language);
  } catch (error) {
    console.error('Error generating loan guidance:', error);
    return "I'm sorry, I encountered an error while generating guidance. Let's continue with the application process.";
  }
}

/**
 * Translate text using OpenAI
 * @param text Text to translate
 * @param languageCode Target language code
 * @returns Translated text
 */
async function translateWithOpenAI(text: string, languageCode: string): Promise<string> {
  try {
    // Get language name from code
    const languageName = LANGUAGE_CODES[languageCode] || 'English';
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
    
    // Create completion with translation request
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that translates text to ${languageName}. Translate the following text to ${languageName}, maintaining the same formatting and structure. Only respond with the translated text, nothing else.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });
    
    // Return the translated text
    return response.choices[0]?.message?.content || text;
  } catch (error) {
    console.error('Error translating with OpenAI:', error);
    return text; // Fallback to original text if translation fails
  }
}

/**
 * Detect loan type from user message using OpenAI
 * @param message User message
 * @param language Language code
 * @returns Detected loan type or null
 */
export async function detectLoanTypeWithAI(message: string, language: string): Promise<string | null> {
  try {
    // If message is not in English, translate it first
    let processedMessage = message;
    if (language !== 'en-IN') {
      const languageName = LANGUAGE_CODES[language] || 'English';
      
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || '',
      });
      
      const translationResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that translates text from ${languageName} to English. Translate the following text to English, maintaining the same meaning. Only respond with the translated text, nothing else.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      });
      
      processedMessage = translationResponse.choices[0]?.message?.content || message;
    }
    
    // Detect loan type using OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that categorizes loan inquiries. Analyze the user message and determine which type of loan they are interested in. 
          The options are: home, personal, business, education, vehicle.
          Only respond with one of these loan types as a single word, or "unknown" if you cannot determine the loan type.`
        },
        {
          role: 'user',
          content: processedMessage
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    });
    
    const detectedType = response.choices[0]?.message?.content?.toLowerCase().trim();
    
    if (detectedType === 'home' || 
        detectedType === 'personal' || 
        detectedType === 'business' || 
        detectedType === 'education' || 
        detectedType === 'vehicle') {
      return detectedType;
    }
    
    return null;
  } catch (error) {
    console.error('Error detecting loan type with AI:', error);
    return null;
  }
}

/**
 * Check if user understood based on their response using OpenAI
 * @param message User message
 * @param language Language code
 * @returns Boolean indicating if user understood
 */
export async function checkUnderstandingWithAI(message: string, language: string): Promise<boolean> {
  try {
    // If message is not in English, translate it first
    let processedMessage = message;
    if (language !== 'en-IN') {
      const languageName = LANGUAGE_CODES[language] || 'English';
      
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || '',
      });
      
      const translationResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that translates text from ${languageName} to English. Translate the following text to English, maintaining the same meaning. Only respond with the translated text, nothing else.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      });
      
      processedMessage = translationResponse.choices[0]?.message?.content || message;
    }
    
    // Check understanding using OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that analyzes user responses to determine if they understood an explanation. 
          Analyze the user message and determine if they indicate understanding or if they need more explanation.
          Only respond with "yes" if they understood or "no" if they need more explanation.`
        },
        {
          role: 'user',
          content: processedMessage
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    });
    
    const understood = response.choices[0]?.message?.content?.toLowerCase().trim();
    return understood === 'yes';
  } catch (error) {
    console.error('Error checking understanding with AI:', error);
    return true; // Default to true if there's an error
  }
} 