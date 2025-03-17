export const generateTTS = async (languageCode: string, text: string) => {
  try {
    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': '47b5a700-2f9e-4e1d-afe0-c46ed9cda77e',
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: languageCode,
        speaker: 'meera',
        pace: 1.0,
        loudness: 1.0,
      }),
    });

    const data = await response.json();
    if (data.audios && data.audios.length > 0) {
      const audio = new Audio(`data:audio/wav;base64,${data.audios[0]}`);
      audio.play();
    }
  } catch (error) {
    console.error('Error generating TTS:', error);
    throw error;
  }
}; 