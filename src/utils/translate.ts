// utils/translate.ts

/**
 * Languages supported by the Sarvam AI Translation API
 */
export type LanguageCode =
    | 'en-IN' // English
    | 'hi-IN' // Hindi
    | 'bn-IN' // Bengali
    | 'gu-IN' // Gujarati
    | 'kn-IN' // Kannada
    | 'ml-IN' // Malayalam
    | 'mr-IN' // Marathi
    | 'od-IN' // Odia
    | 'pa-IN' // Punjabi
    | 'ta-IN' // Tamil
    | 'te-IN'; // Telugu

/**
 * Gender of the speaker, only supported for code-mixed translation
 */
export type SpeakerGender = 'Male' | 'Female';

/**
 * Translation modes/styles
 */
export type TranslationMode = 'formal' | 'modern-colloquial' | 'classic-colloquial' | 'code-mixed';

/**
 * Output script options for transliteration
 */
export type OutputScript = 'roman' | 'fully-native' | 'spoken-form-in-native' | null;

/**
 * Numeral format options
 */
export type NumeralsFormat = 'international' | 'native';

/**
 * Translation request options
 */
export interface TranslateOptions {
    input: string;
    sourceLanguageCode: LanguageCode;
    targetLanguageCode: LanguageCode;
    speakerGender?: SpeakerGender;
    mode?: TranslationMode;
    enablePreprocessing?: boolean;
    outputScript?: OutputScript;
    numeralsFormat?: NumeralsFormat;
    model?: string; // Will be deprecated soon
}

/**
 * Translation response
 */
export interface TranslateResponse {
    request_id: string | null;
    translated_text: string;
}

/**
 * Translates text from one language to another using the Sarvam AI Translation API
 * @param options Translation options
 * @param apiKey Your Sarvam AI API subscription key
 * @returns Promise with translation result
 */
export async function translateText(
    options: TranslateOptions,
    apiKey: string
): Promise<TranslateResponse> {
    try {
        const {
            input,
            sourceLanguageCode,
            targetLanguageCode,
            speakerGender,
            mode,
            enablePreprocessing,
            outputScript,
            numeralsFormat,
            model
        } = options;

        // Validate input text length
        if (input.length > 1000) {
            throw new Error('Input text exceeds maximum length of 1000 characters');
        }

        // Prepare request body
        const requestBody: Record<string, any> = {
            input,
            source_language_code: sourceLanguageCode,
            target_language_code: targetLanguageCode,
        };

        // Add optional parameters if provided
        if (speakerGender) requestBody.speaker_gender = speakerGender;
        if (mode) requestBody.mode = mode;
        if (enablePreprocessing !== undefined) requestBody.enable_preprocessing = enablePreprocessing;
        if (outputScript !== undefined) requestBody.output_script = outputScript;
        if (numeralsFormat) requestBody.numerals_format = numeralsFormat;
        if (model) requestBody.model = model; // Note: Will be deprecated soon

        const response = await fetch('https://api.sarvam.ai/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-subscription-key': '47b5a700-2f9e-4e1d-afe0-c46ed9cda77e',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data as TranslateResponse;
    } catch (error) {
        console.error('Error in translateText:', error);
        throw error;
    }
}

/**
 * Helper function to get language name from code
 * @param code Language code
 * @returns Language name
 */
export function getLanguageName(code: LanguageCode): string {
    const languages: Record<LanguageCode, string> = {
        'en-IN': 'English',
        'hi-IN': 'Hindi',
        'bn-IN': 'Bengali',
        'gu-IN': 'Gujarati',
        'kn-IN': 'Kannada',
        'ml-IN': 'Malayalam',
        'mr-IN': 'Marathi',
        'od-IN': 'Odia',
        'pa-IN': 'Punjabi',
        'ta-IN': 'Tamil',
        'te-IN': 'Telugu'
    };

    return languages[code] || code;
}