import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const INDIAN_LANGUAGES = ['hi-IN', 'kn-IN', 'ta-IN', 'te-IN', 'ml-IN', 'bn-IN', 'mr-IN', 'gu-IN', 'pa-IN', 'or-IN'];

export async function POST(request: Request) {
  try {
    const { step, response, language } = await request.json();
    
    if (!step || !response || !language) {
      return NextResponse.json(
        { error: 'Step, response, and language are required' },
        { status: 400 }
      );
    }

    const isIndianLanguage = INDIAN_LANGUAGES.includes(language);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `Analyze if the user has understood the step. The user may respond in Indian languages. 
          Return "yes" if they understood, "no" if they didn't. Consider common Indian language phrases that indicate understanding.`
        },
        { 
          role: "user", 
          content: `Step: ${step}\nUser Response: ${response}\n\nHas the user understood the step? Consider that the response might be in an Indian language.`
        }
      ],
    });

    let understanding = completion.choices[0].message.content?.toLowerCase().trim();
    
    // Additional check for common Indian language phrases
    if (isIndianLanguage) {
      const indianPhrases = [
        'ಹೌದು', 'ಹೂಂ', 'ಅರ್ಥವಾಯಿತು', 'ಸರಿ', 'ಸರಿಯಾಗಿದೆ', // Kannada
        'हाँ', 'हां', 'समझ गया', 'ठीक है', // Hindi
        'ஆம்', 'புரிந்தது', 'சரி', // Tamil
        'అవును', 'అర్థమైంది', 'సరే', // Telugu
        'അതെ', 'മനസ്സിലായി', 'ശരി', // Malayalam
        'হ্যাঁ', 'বুঝেছি', 'ঠিক আছে', // Bengali
        'होय', 'समजलं', 'ठीक आहे', // Marathi
        'હા', 'સમજાઈ ગયું', 'ઠીક છે', // Gujarati
        'ਹਾਂ', 'ਸਮਝ ਗਿਆ', 'ਠੀਕ ਹੈ', // Punjabi
        'ହଁ', 'ବୁଝିଲି', 'ଠିକ୍ ଅଛି' // Odia
      ];

      if (indianPhrases.some(phrase => response.includes(phrase))) {
        understanding = 'yes';
      }
    }

    return NextResponse.json({ understanding });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to check understanding' },
      { status: 500 }
    );
  }
} 