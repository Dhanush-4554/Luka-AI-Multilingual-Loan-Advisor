export const generateTTS = async (languageCode: string, text: string) => {
  try {
    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': '05ca5a88-9265-4e62-a25a-507687a900d3',
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