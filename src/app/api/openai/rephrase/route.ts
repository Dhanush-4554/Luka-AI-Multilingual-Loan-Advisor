import { NextResponse } from 'next/server';
import OpenAI from 'openai';

interface CardData {
  id: number;
  title: string;
  content: string;
  icon: string;
  gradient: string;
  details?: string;
  requirements?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key-for-development',
});

export async function POST(request: Request) {
  try {
    const { cardData, type, loanType, includeDetails = false } = await request.json();
    
    if (!cardData || !Array.isArray(cardData)) {
      return NextResponse.json(
        { error: 'Card data array is required' },
        { status: 400 }
      );
    }

    // For development mode or if no API key is available
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-dummy-key-for-development') {
      console.log('Using development mode with dummy data');
      const rephrasedData = cardData.map((card: CardData) => ({
        ...card,
        title: `${card.title} (Rephrased)`,
        content: `${card.content} - dynamically updated`
      }));
      
      return NextResponse.json({ rephrased: rephrasedData });
    }

    // Create a system prompt based on the type of content
    let systemPrompt = "You are a helpful assistant that rephrases content to make it more engaging and varied. you can change title and content both.";
    
    if (type === 'loan_process') {
      systemPrompt = "You are a financial content specialist who creates engaging, clear, and professional descriptions for loan application processes. Your rephrasing should be concise yet informative, using financial terminology appropriately.";
      
      if (loanType && loanType !== 'general') {
        systemPrompt += ` Focus specifically on the ${loanType} loan process, highlighting the unique aspects and requirements of this loan type.`;
      }
    }

    let userPrompt = `Please rephrase the following loan application process steps to make them more engaging, clear, and varied. Use synonyms for titles and create fresh descriptions. Keep the same icons and gradients.`;
    
    if (includeDetails) {
      userPrompt += ` For each step, also provide additional details and specific requirements in separate fields.`;
    }
    
    userPrompt += `\n\nCard Data:\n${JSON.stringify(cardData, null, 2)}\n\nReturn the result as a JSON array with the same structure as the input, but with rephrased 'title' and 'content' properties.`;
    
    if (includeDetails) {
      userPrompt += ` Also include 'details' and 'requirements' fields for each card.`;
    }
    
    userPrompt += ` Maintain the same 'id', 'icon', and 'gradient' values. Do not include any explanations, just the JSON array.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: systemPrompt 
        },
        { 
          role: "user", 
          content: userPrompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0].message.content;
    
    if (!responseContent) {
      throw new Error('Empty response from OpenAI');
    }
    
    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(responseContent);
      
      // Check if the response has the expected format
      if (parsedResponse.rephrased && Array.isArray(parsedResponse.rephrased)) {
        return NextResponse.json(parsedResponse);
      } else if (Array.isArray(parsedResponse)) {
        // If the response is already an array, wrap it
        return NextResponse.json({
          rephrased: parsedResponse
        });
      } else {
        // Find any array in the response
        const arrayKey = Object.keys(parsedResponse).find(key => 
          Array.isArray(parsedResponse[key]) && 
          parsedResponse[key].length > 0 &&
          parsedResponse[key][0].id !== undefined
        );
        
        if (arrayKey) {
          return NextResponse.json({
            rephrased: parsedResponse[arrayKey]
          });
        }
        
        // Last resort: try to convert the response to match our format
        const adaptedData = cardData.map((original: CardData, index: number) => {
          const matchingKey = Object.keys(parsedResponse).find(key => 
            key.toLowerCase().includes(original.title.toLowerCase()) ||
            String(index + 1) === key
          );
          
          if (matchingKey) {
            return {
              ...original,
              title: typeof parsedResponse[matchingKey].title === 'string' ? 
                parsedResponse[matchingKey].title : original.title,
              content: typeof parsedResponse[matchingKey].content === 'string' ? 
                parsedResponse[matchingKey].content : original.content,
              details: typeof parsedResponse[matchingKey].details === 'string' ? 
                parsedResponse[matchingKey].details : original.details,
              requirements: typeof parsedResponse[matchingKey].requirements === 'string' ? 
                parsedResponse[matchingKey].requirements : original.requirements
            };
          }
          return original;
        });
        
        return NextResponse.json({
          rephrased: adaptedData,
          warning: 'Response format required adaptation'
        });
      }
    } catch (parseError: unknown) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error(`Failed to parse OpenAI response: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    try {
      // Extract cardData from the request for fallback
      const { cardData } = await request.clone().json();
      
      if (cardData && Array.isArray(cardData)) {
        // Return modified data with error info
        const rephrasedData = cardData.map((card: CardData) => ({
          ...card,
          title: `${card.title}`,
          content: `${card.content}`,
          // details and requirements will be passed through from the original
        }));
        
        return NextResponse.json({
          rephrased: rephrasedData,
          error: error instanceof Error ? error.message : 'Failed to process request'
        });
      }
    } catch (jsonError) {
      console.error('Error parsing request in error handler:', jsonError);
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}