import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const prompt = `Analyze this chat conversation and generate:
    1. A concise summary
    2. Key points to remember (single or two words)
    3. The flow of the conversation
    
    Return ONLY the JSON object with this structure:
    {
      "summary": "string",
      "keyPoints": ["string"],
      "flow": ["string"]
    }
    
    Here is the chat conversation: ${JSON.stringify(messages)}`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant that returns structured JSON data.' },
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