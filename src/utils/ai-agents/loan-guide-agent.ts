import { ChatOpenAI } from '@langchain/openai';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';

// Define the loan application guidelines document
const LOAN_GUIDELINES = `
LOAN APPLICATION PROCESS GUIDELINES

1. Initial Application Phase
   - Complete personal information form
   - Choose loan type and amount
   - Specify loan tenure
   - Declare purpose of loan

2. Documentation Requirements
   - Identity proof (Aadhar, PAN, Passport)
   - Address proof (Utility bills, Rental agreement)
   - Income proof (Salary slips, Bank statements)
   - Employment verification
   - Asset documents (if applicable)

3. Verification Process
   - KYC verification
   - Document authenticity check
   - Credit score assessment
   - Income verification
   - Property valuation (for secured loans)

4. Risk Assessment
   - Debt-to-income ratio calculation
   - Credit history evaluation
   - Employment stability check
   - Asset quality assessment
   - Repayment capacity analysis

5. Loan Processing
   - Application review
   - Terms and conditions explanation
   - Interest rate determination
   - EMI calculation
   - Repayment schedule preparation

6. Approval and Disbursement
   - Final approval process
   - Loan agreement signing
   - Insurance requirements
   - Disbursement timeline
   - Post-disbursement documentation

IMPORTANT RULES:
1. All documents must be self-attested
2. Original documents required for verification
3. False information leads to automatic rejection
4. Processing time: 7-14 working days
5. Minimum credit score requirements vary by loan type
`;

class LoanGuideAgent {
  private llm: ChatOpenAI;

  constructor() {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4",
      temperature: 0.7,
    });
  }

  async processQuery(
    query: string,
    conversationHistory: string[],
    userProfile?: {
      loanType?: string;
      stage?: string;
      previousQueries?: string[];
    }
  ) {
    // Create a prompt that includes guidelines, conversation history, and user context
    const prompt = PromptTemplate.fromTemplate(`
      You are an expert loan application guide. Use the following information to provide accurate and helpful guidance:

      LOAN GUIDELINES:
      ${LOAN_GUIDELINES}

      CONVERSATION HISTORY:
      {history}

      USER PROFILE:
      Loan Type: {loanType}
      Application Stage: {stage}

      USER QUERY:
      {query}

      Provide a detailed response that:
      1. Directly addresses the user's query
      2. References relevant guidelines
      3. Maintains context from previous conversation
      4. Suggests next steps if applicable
      5. Highlights any important rules or requirements

      Response:
    `);

    // Create the chain
    const chain = RunnableSequence.from([
      prompt,
      this.llm,
      new StringOutputParser()
    ]);

    // Execute the chain
    const response = await chain.invoke({
      history: conversationHistory.join('\n'),
      query,
      loanType: userProfile?.loanType || 'Not specified',
      stage: userProfile?.stage || 'Initial inquiry'
    });

    return {
      response,
      suggestedNextSteps: this.extractNextSteps(response)
    };
  }

  private extractNextSteps(response: string): string[] {
    // Extract suggested next steps from the response
    const nextSteps: string[] = [];
    const lines = response.split('\n');
    let isNextStepsSection = false;

    for (const line of lines) {
      if (line.toLowerCase().includes('next steps')) {
        isNextStepsSection = true;
        continue;
      }
      if (isNextStepsSection && line.trim().startsWith('-')) {
        nextSteps.push(line.trim().substring(1).trim());
      }
    }

    return nextSteps;
  }
}

export default LoanGuideAgent; 