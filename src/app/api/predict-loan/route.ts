import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { responses } = await request.json();
    
    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: 'Responses are required' },
        { status: 400 }
      );
    }

    // Format responses for OpenAI
    const conversation = responses.map((r, i) => 
      `Question ${i+1}: ${r.question}\nAnswer: ${r.answer}`
    ).join('\n\n');

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a financial advisor. Based on the user's responses, determine the most suitable loan type. Return only the loan type name in lowercase without any additional text. Possible loan types: personal, home, car, education, business."
        },
        { 
          role: "user", 
          content: `User responses:\n${conversation}\n\nBased on these responses, what type of loan is most suitable?`
        }
      ],
    });

    const loanType = completion.choices[0].message.content?.toLowerCase().trim();

    return NextResponse.json({ loanType });

  } catch (error) {
    console.error('Loan prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to predict loan type' },
      { status: 500 }
    );
  }
} 