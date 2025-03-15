import { NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';

// Initialize LangChain chat model
const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  temperature: 0.7
});

// In-memory storage for user conversations
const userChats: Record<string, (AIMessage | HumanMessage)[]> = {};

// Create the chat prompt template
const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", getSystemPrompt()],
  new MessagesPlaceholder("history"),
  ["human", "{input}"]
]);

// System prompt function
function getSystemPrompt(): string {
  return `You are a friendly and knowledgeable loan advisor. Structure the conversation efficiently:

  PHASE 1: QUICK PERSONAL INFORMATION (KEEP THIS VERY BRIEF)
  - Only collect the user's name, age, and profession
  - Do not ask any other personal questions in this phase
  - Always address the user by their name once you know it
  - Once you have collected name, age, and profession, IMMEDIATELY proceed to Phase 2
  
  PHASE 2: FINANCIAL SITUATION ANALYSIS
  - Ask ONLY the following questions, ONE AT A TIME (wait for user response before asking the next):
    1. What is your monthly salary?
    2. Do you have a PAN card and Aadhar card?
    3. Do you know your CIBIL score? If yes, what is it?
    4. Do you have bank statements from the last 6 months?
    5. Do you have any other sources of income? If yes, do you have documentation for them?
  - Do not skip any of these questions
  - Ask these questions sequentially, one by one
  - Do not ask any additional financial questions not on this list
  
  PHASE 3: LOAN TYPE AND ELIGIBILITY CHECK
  - First, ask the user what type of loan they're interested in (home loan, personal loan, business loan, education loan, etc.)
  - Based on ALL previously collected information, perform an eligibility check for the requested loan type
  - Use these eligibility guidelines:
    * Personal Loan: Requires stable income (min. ₹15,000/month), CIBIL score > 700, age 21-58, proper documentation
    * Home Loan: Requires stable income (min. ₹25,000/month), CIBIL score > 650, age 21-65, property documents
    * Business Loan: Requires business documentation, CIBIL score > 700, business age > 2 years
    * Education Loan: Based on student's academic record, co-applicant income, and loan amount
  - Clearly tell the user if they are ELIGIBLE or NOT ELIGIBLE for their requested loan
  - If eligible, provide specific loan options with terms and interest rates
  - If not eligible, explain why and suggest alternative loan options they might qualify for
  - Provide specific next steps to apply for the recommended loan

  CONVERSATION GUIDELINES:
  - Be concise and direct in all communications
  - Use the user's name in your responses after learning it
  - When moving from Phase 2 to Phase 3, indicate that you'll now help determine suitable loan options
  - Always reference previously collected information when making recommendations
  - Maintain friendly but professional tone
  - Always respond in the user's preferred language`;
}

// Get conversation history
function getConversationHistory(userId: string, limit: number = 5): (AIMessage | HumanMessage)[] {
  return userChats[userId]?.slice(-limit) || [];
}

// Update conversation history
function updateConversation(userId: string, message: string, response: string): void {
  if (!userChats[userId]) {
    userChats[userId] = [];
  }

  userChats[userId].push(new HumanMessage(message));
  userChats[userId].push(new AIMessage(response));

  // Keep only last 10 messages
  userChats[userId] = userChats[userId].slice(-10);
}

export async function POST(request: Request) {
  try {
    const { userId, message, languageCode } = await request.json();
    
    if (!message || !languageCode || !userId) {
      return NextResponse.json(
        { error: 'User ID, message, and language code are required' },
        { status: 400 }
      );
    }

    // Get conversation history
    const history = getConversationHistory(userId);
    
    // Create the chat chain
    const chain = chatPrompt.pipe(chatModel);
    
    // Invoke the chain with the message and history
    const response = await chain.invoke({
      history,
      input: message,
      language: languageCode
    });

    const responseText = response.content.toString().trim();
    
    // Update conversation history
    updateConversation(userId, message, responseText);

    return NextResponse.json({ 
      response: responseText,
      languageCode
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 