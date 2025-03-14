// utils/stt.ts
export async function transcribeAudio(
    audioBlob: Blob,
    languageCode: string,
    withTimestamps: boolean = false,
    withDiarization: boolean = false,
    numSpeakers?: number
  ) {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob);
      formData.append('model', 'saarika:v2');
      formData.append('language_code', languageCode);
      formData.append('with_timestamps', withTimestamps.toString());
      
      if (withDiarization) {
        formData.append('with_diarization', 'true');
        if (numSpeakers) {
          formData.append('num_speakers', numSpeakers.toString());
        }
      }
  
      const response = await fetch('https://api.sarvam.ai/speech-to-text', {
        method: 'POST',
        headers: {
          'api-subscription-key': '05ca5a88-9265-4e62-a25a-507687a900d3',
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in transcribeAudio:', error);
      throw error;
    }
  }