import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const prompt = `Analyze this loan advisor chat conversation and extract only the most essential information:
    
    1. BASIC INFO: Extract the user's name, age, and profession
    2. FINANCIAL INFO: Extract the following financial details:
       - Monthly salary
       - Whether they have PAN and Aadhar cards
       - CIBIL score
       - Whether they have bank statements
       - Other sources of income and documentation
    3. LOAN AND ELIGIBILITY: 
       - The type of loan the user is interested in
       - Whether they were deemed eligible or not
       - The specific recommendations provided
    
    Return ONLY the JSON object with this structure:
    {
      "summary": "Very concise summary of the conversation",
      "keyPoints": ["Important facts worth remembering"],
      "basicInfo": {
        "name": "User's name (if provided)",
        "age": "User's age (if provided)",
        "profession": "User's profession (if provided)"
      },
      "financialInfo": {
        "monthlySalary": "User's monthly salary (if provided)",
        "hasIdCards": "Whether user has PAN and Aadhar cards (if provided)",
        "cibilScore": "User's CIBIL score (if provided)",
        "hasBankStatements": "Whether user has bank statements (if provided)",
        "otherIncomeSources": "User's other income sources (if provided)"
      },
      "loanEligibility": {
        "loanTypeRequested": "Type of loan requested by user",
        "isEligible": "Yes/No/Partially",
        "eligibilityReason": "Reason for eligibility determination",
        "suggestedAlternatives": "Alternatives suggested if not eligible"
      },
      "recommendations": ["Specific loan options with terms and rates"]
    }
    
    Here is the chat conversation: ${JSON.stringify(messages)}`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant that analyzes loan advisor conversations and returns concise structured JSON data with focus on eligibility criteria.' },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.3
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error('No content received from OpenAI');
    }

    const summary = JSON.parse(responseContent);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
} 