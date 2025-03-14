import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const prompt = `Analyze this chat conversation and generate a structured response in JSON format. The response should include:
    1. A concise summary
    2. A flowchart structure of the conversation
    3. A block diagram of key concepts
    4. Relevant statistics and charts
    
    Return ONLY the JSON object with this structure:
    {
      "summary": "string",
      "flowChart": {
        "nodes": [{ "id": number, "type": "string", "label": "string" }],
        "edges": [{ "from": number, "to": number }]
      },
      "blockDiagram": {
        "sections": [{ "title": "string", "content": ["string"] }]
      },
      "graphs": [{
        "type": "string",
        "title": "string",
        "data": { "labels": ["string"], "values": [number] }
      }]
    }
    
    Here is the chat conversation: ${JSON.stringify(messages)}`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant that returns structured JSON data.' },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-3.5-turbo', // or 'gpt-4' if available
      temperature: 0.3 // Lower temperature for more consistent output
    });

    // Parse the JSON content from the response
    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error('No content received from OpenAI');
    }

    const visualization = JSON.parse(responseContent);
    return NextResponse.json({ visualization });
  } catch (error) {
    console.error('Error generating visualization:', error);
    return NextResponse.json(
      { error: 'Failed to generate visualization' },
      { status: 500 }
    );
  }
}