# Luka AI: One Stop Solution for Smart Loan Assistance

## Team: 4D Devs (S29)
**Track:** Multilingual conversational loan advisor (Sarvam AI)

### Team Members
| Name | Role |
|------|------|
| Dhanush B | Core Architecture and AI Agents Development |
| Dhanush Prabhu | Integration of UI with AI Agents + Langchain implementation |
| Bhvaith S D | Implementation of UI and a smooth UX |
| Manoj S | R&D, management, planning, verification of features and testing + PPT |

## Project Overview
Luka AI is a multilingual conversational AI assistant designed to help users understand loan eligibility, guide them through the loan application process, and provide basic financial literacy tips. The assistant supports both voice and text interactions across multiple languages.

### Vision
"Making loans simple and accessible for everyone through conversations that truly understand you."

## Features

### 1. Multilingual Voice and Text Support
- Natural conversation in 10+ languages with regional financial terminology
- Support for both voice and text inputs
- Cultural nuances built-in for better user experience

### 2. Intelligent Eligibility Assessment
- Prequalification with minimal personal information
- Transparent scoring factors with improvement roadmap
- Side-by-side eligible loan options from multiple banks

### 3. Virtual Loan Application Process
- Dynamic step-by-step real loan application guidance
- Interactive visuals including flowcharts
- Summary report generation for future reference

### 4. Financial Empowerment Hub
- Jargon-free financial education
- Interactive calculators for real impact visualization
- Personalized AI financial advisory

### 5. Interactive Visualizers
- Tax bracket visualization
- SIP calculator
- Emergency fund planning
- Budget allocation tools

## Technical Architecture

### Tech Stack

#### Frontend Technologies
- Next.js + TypeScript
- Tailwind CSS
- Framer Motion (for animations)
- React Icons

#### Backend Technologies
- Flask
- Next.js API Routes
- Firestore DB

#### ML Technologies
- LangChain
- TTS: Sarvam AI
- LLM: OpenAI

### Key Components

#### 1. Chat Interface
- Real-time voice and text communication
- Automatic voice activity detection
- Dynamic recording duration based on response length
- Multilingual support with Sarvam AI TTS

#### 2. Flow Chart Visualization
- Interactive loan application process visualization
- Dynamic card animations
- Auto-scrolling to latest steps
- Progress tracking

#### 3. Financial Literacy Integration
- Personalized financial tips
- Interactive calculators
- Visual data representation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Firebase account
- OpenAI API key
- Sarvam AI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/luka-ai.git
cd luka-ai
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

4. Set up environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
OPENAI_API_KEY=your_openai_api_key
SARVAM_AI_API_KEY=your_sarvam_ai_api_key
```

5. Run the development server
```bash
npm run dev
```

## Project Structure
```
luka-ai/
├── src/
│   ├── components/
│   │   ├── FlowChart/
│   │   ├── LoanChat/
│   │   ├── LoanApplicationGuide/
│   │   └── LandingPage/
│   ├── utils/
│   │   ├── loanChat.ts
│   │   ├── tts.ts
│   │   └── stt.ts
│   └── pages/
├── public/
│   ├── images/
│   └── LukaAI.mp4
└── backend/
    ├── app.py
    └── requirements.txt
```

## Key Features Implementation

### Voice Activity Detection
The system uses Web Audio API for real-time voice activity detection:
```typescript
scriptProcessorRef.current!.onaudioprocess = (event) => {
  const inputData = event.inputBuffer.getChannelData(0);
  let volume = 0;
  for (let i = 0; i < inputData.length; i++) {
    volume += Math.abs(inputData[i]);
  }
  volume /= inputData.length;

  if (volume > 0.02) {
    if (!isRecording && mediaRecorderRef.current!.state !== 'recording') {
      mediaRecorderRef.current!.start();
      setIsRecording(true);
    }
  } else if (isRecording && mediaRecorderRef.current!.state === 'recording') {
    mediaRecorderRef.current!.stop();
    setIsRecording(false);
  }
};
```

### Dynamic Recording Duration
Recording duration is calculated based on response length:
```typescript
const calculateRecordingDuration = (response: string) => {
  const wordCount = response.split(' ').length;
  const baseDuration = 5000; // 5 seconds minimum
  const perWordDuration = 200; // 200ms per word
  const maxDuration = 30000; // 30 seconds maximum
  
  const calculatedDuration = baseDuration + (wordCount * perWordDuration);
  return Math.min(calculatedDuration, maxDuration);
};
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Sarvam AI for TTS capabilities
- OpenAI for LLM integration
- Firebase for backend services
- All team members for their contributions
