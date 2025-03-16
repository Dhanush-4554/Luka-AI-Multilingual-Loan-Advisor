import { ChatOpenAI } from '@langchain/openai';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';

// Define the loan eligibility criteria document
const LOAN_ELIGIBILITY_CRITERIA = `
LOAN ELIGIBILITY REQUIREMENTS

1. Personal Loan
   Minimum Requirements:
   - Age: 21-58 years
   - Income: ₹15,000/month (salaried), ₹25,000/month (self-employed)
   - Credit Score: 700+
   - Employment: 1 year continuous employment
   - Bank Account: 6 months active transactions
   
   Preferred Criteria:
   - Income: ₹30,000+/month
   - Credit Score: 750+
   - Employment: 2+ years in current job
   - No existing personal loans

2. Home Loan
   Minimum Requirements:
   - Age: 21-65 years
   - Income: ₹25,000/month
   - Credit Score: 650+
   - Employment: 2 years continuous employment
   - Property: Clear title and valuation
   
   Preferred Criteria:
   - Income: ₹50,000+/month
   - Credit Score: 700+
   - Employment: 3+ years stability
   - Down payment: 20%+ of property value

3. Business Loan
   Minimum Requirements:
   - Business Age: 2 years
   - Annual Turnover: ₹10 lakhs
   - Credit Score: 700+
   - Profit: Last 2 years profitable
   - GST Registration: Required
   
   Preferred Criteria:
   - Business Age: 3+ years
   - Annual Turnover: ₹25 lakhs+
   - Credit Score: 750+
   - Collateral: Available

4. Education Loan
   Minimum Requirements:
   - Student Age: 18-35 years
   - Course: Recognized institution
   - Academic Record: 60% in last qualification
   - Co-applicant: Required
   - Admission Letter: Confirmed admission
   
   Preferred Criteria:
   - Academic Record: 75%+ in last qualification
   - Co-applicant Income: 3x loan EMI
   - Collateral: Available for loans above ₹7.5 lakhs

DISQUALIFYING FACTORS:
1. Default history in last 3 years
2. Active bankruptcy proceedings
3. Legal disputes on collateral property
4. Multiple loan rejections in last 6 months
5. Irregular income patterns

DOCUMENTATION FOR VERIFICATION:
1. Income Proof
2. Bank Statements
3. Credit Report
4. Identity Documents
5. Address Proof
`;

class LoanEligibilityAgent {
  private llm: ChatOpenAI;

  constructor() {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4",
      temperature: 0.7,
    });
  }

  async checkEligibility(
    userProfile: {
      loanType: string;
      age?: number;
      income?: number;
      creditScore?: number;
      employment?: {
        status: string;
        duration: number;
      };
      existingLoans?: {
        type: string;
        amount: number;
      }[];
      businessDetails?: {
        age: number;
        turnover: number;
        profit: boolean;
      };
      academicDetails?: {
        lastQualification: string;
        marks: number;
        admissionStatus: string;
      };
    },
    additionalContext?: string
  ) {
    // Construct query based on user profile
    const query = `Check eligibility for ${userProfile.loanType} with:
      Age: ${userProfile.age}
      Income: ${userProfile.income}
      Credit Score: ${userProfile.creditScore}
      ${userProfile.employment ? `Employment: ${userProfile.employment.status} (${userProfile.employment.duration} years)` : ''}
      ${userProfile.businessDetails ? `Business: ${userProfile.businessDetails.age} years old, ${userProfile.businessDetails.turnover} turnover` : ''}
      ${userProfile.academicDetails ? `Academic: ${userProfile.academicDetails.marks}% in ${userProfile.academicDetails.lastQualification}` : ''}
    `;

    // Create eligibility check prompt
    const prompt = PromptTemplate.fromTemplate(`
      You are an expert loan eligibility assessor. Analyze the following application against our criteria:

      ELIGIBILITY CRITERIA:
      ${LOAN_ELIGIBILITY_CRITERIA}

      APPLICANT PROFILE:
      {query}

      Additional Context:
      {additionalContext}

      Provide a detailed eligibility assessment that includes:
      1. Overall Eligibility Status (Eligible/Not Eligible/Conditionally Eligible)
      2. Matching Criteria (what requirements are met)
      3. Gaps (what requirements are not met)
      4. Recommendations for improving eligibility
      5. Required documentation list

      Assessment:
    `);

    // Create the chain
    const chain = RunnableSequence.from([
      prompt,
      this.llm,
      new StringOutputParser()
    ]);

    // Execute the chain
    const response = await chain.invoke({
      query,
      additionalContext: additionalContext || 'No additional context provided'
    });

    // Parse the response to extract structured information
    return {
      response,
      structuredAssessment: this.parseAssessment(response)
    };
  }

  private parseAssessment(response: string) {
    // Extract structured information from the response
    const assessment = {
      status: '',
      matchingCriteria: [] as string[],
      gaps: [] as string[],
      recommendations: [] as string[],
      requiredDocuments: [] as string[]
    };

    const lines = response.split('\n');
    let currentSection = '';

    for (const line of lines) {
      if (line.toLowerCase().includes('status:')) {
        assessment.status = line.split(':')[1].trim();
      } else if (line.toLowerCase().includes('matching criteria:')) {
        currentSection = 'matching';
      } else if (line.toLowerCase().includes('gaps:')) {
        currentSection = 'gaps';
      } else if (line.toLowerCase().includes('recommendations:')) {
        currentSection = 'recommendations';
      } else if (line.toLowerCase().includes('required documentation:')) {
        currentSection = 'documents';
      } else if (line.trim().startsWith('-')) {
        const item = line.trim().substring(1).trim();
        switch (currentSection) {
          case 'matching':
            assessment.matchingCriteria.push(item);
            break;
          case 'gaps':
            assessment.gaps.push(item);
            break;
          case 'recommendations':
            assessment.recommendations.push(item);
            break;
          case 'documents':
            assessment.requiredDocuments.push(item);
            break;
        }
      }
    }

    return assessment;
  }
}

export default LoanEligibilityAgent; 