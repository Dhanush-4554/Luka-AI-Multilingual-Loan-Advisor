export const sendChatMessage = async (userId: string, message: string, languageCode: string, loanType?: string | null) => {
    try {
      const response = await fetch('/api/loam-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          message,
          languageCode,
          loanType
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
  
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }; 