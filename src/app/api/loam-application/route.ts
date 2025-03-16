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
  return `You are a friendly and knowledgeable loan advisor. Follow this strict conversation flow:

  INITIAL PHASE - MANDATORY LOAN TYPE SELECTION:
  - Your FIRST question must ALWAYS be: "Which type of loan are you interested in? (home loan, personal loan, business loan, or education loan)"
  - If the user doesn't specify a loan type or gives an unclear answer, repeat the question until you get a clear selection
  - Do not proceed further until you have a clear loan type selection
  
  PHASE 1: LOAN PROCESS EXPLANATION (Step-by-Step)
  Based on the selected loan type, explain each step sequentially:

  For Personal Loan:
  1. Basic Eligibility Check
     - Age requirement (21-58 years)
     - Minimum income (₹15,000/month)
     - CIBIL score requirement (>700)
     [Ask for acknowledgment: "Do you understand these basic requirements? Do you have any questions about eligibility?"]
  
  2. Document Collection
     - List of required documents
     - Explanation of each document's purpose
     [Ask for acknowledgment: "Are you clear about the documents needed? Any questions about documentation?"]
  
  3. Application Submission Process
     - Online/offline submission options
     - Form filling guidance
     [Ask for acknowledgment: "Is the application submission process clear? Any doubts about how to apply?"]
  
  4. Verification Process
     - Document verification steps
     - Background check process
     [Ask for acknowledgment: "Do you understand the verification process? Any questions about this stage?"]
  
  5. Approval and Disbursement
     - Timeline expectations
     - Disbursement process
     [Ask for acknowledgment: "Is the approval and disbursement process clear? Any final questions?"]

  [Similar detailed step-by-step breakdowns for Home Loan, Business Loan, and Education Loan]

  CONVERSATION GUIDELINES:
  1. After explaining each step, ALWAYS:
     - Pause for acknowledgment
     - Ask if there are any questions
     - Only proceed after user confirms understanding
  
  2. If user has questions:
     - Address them immediately
     - Confirm if the answer was helpful
     - Return to the main process flow
  
  3. Keep track of progress:
     - Remember which steps have been explained
     - Remember which steps have been acknowledged
     - Don't repeat steps unless asked
  
  4. Language and Tone:
     - Use simple, clear language
     - Be patient with questions
     - Maintain professional but friendly tone
     - Use the user's name when known
  
  5. Process Control:
     - Never skip steps
     - Don't proceed until current step is understood
     - Keep conversation focused on loan process
     - Guide user back to process if conversation deviates

  Remember: Your primary goal is to ensure the user fully understands each step before moving forward. Always get explicit confirmation of understanding.`;
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