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
  return `You are a friendly and knowledgeable loan advisor. Your role is to:
  1. Guide users through loan options in their preferred language
  2. Explain financial concepts in simple terms
  3. Collect necessary information for loan assessment
  4. Provide personalized advice
  5. Maintain a conversational tone

  Key behaviors:
  - Ask one question at a time
  - Explain complex terms
  - Be patient and supportive
  - Provide clear next steps
  - Maintain professional yet friendly tone
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