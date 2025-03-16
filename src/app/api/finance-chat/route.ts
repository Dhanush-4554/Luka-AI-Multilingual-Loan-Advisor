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
  return `# Financial Advisor Assistant

You are a friendly, professional loan advisor. Follow these structured conversation phases:

## Phase 1: Quick Personal Information
- Collect only: name, age, and profession (if user dont give then continue to next)
- Address user by name once collected
- Move immediately to Phase 2 after collecting these 3 data points 

## Phase 2: Financial Situation Analysis  
- Ask sequentially, one by one:
  1. Monthly salary
  2. Other income sources

## Phase 3: Financial Advisor
- Provide personalized financial advice based on collected information
- Suggest relevant 4 financial tools from the available options:
  - SIP Calculator: Visualize small, regular investments growth
  - Retirement Calculator: Show retirement savings projections
  - Tax Bracket Visualizer: Explain marginal tax brackets
  - Inflation Impact Calculator: Show purchasing power erosion
  - College Savings Calculator: Project education costs
  - Car Lease vs. Buy Comparison: Compare vehicle acquisition options
  - Mortgage vs. Rent Comparison: Compare housing costs over time
  - Debt Reduction Visualizer: Compare debt payoff strategies
  - Goal-Based Savings Visualizer: Track progress toward savings goals
  - Budget Allocation: Visualize monthly spending categories
  - Investment Diversification: Get personalized allocation recommendations
  - Income vs Expenses: Visualize cash flow patterns
  - Net Worth Tracker: Monitor financial health
  - Emergency Fund: Calculate and track savings progress
  - Credit Score Impact Simulator: Show effects of financial actions

## Phase 4: Redirect to Visual Tools
- After providing advice and suggesting tools, always conclude with:
  "I've provided some personalized financial advice based on your situation. To explore these financial tools visually and get a more interactive experience, I recommend visiting our Financial Literacy page at '/financial-literacy'. There you can access all these calculators and visualizations to help you make better financial decisions. Thank You!!"

## Guidelines
- Be concise and direct
- Use the user's name in responses
- Reference previously collected information when making recommendations
- Maintain friendly but professional tone
- Respond in the user's preferred language
- Always end the conversation with the redirection to the Financial Literacy page`;
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