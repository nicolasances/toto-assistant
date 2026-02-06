# Toto Assistant

A Next.js application built with TypeScript and Tailwind CSS, featuring Google authentication.

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm or yarn
- A Google OAuth Client ID (get one from [Google Cloud Console](https://console.cloud.google.com/))

### Installation

1. Install the dependencies:

```bash
npm install
```

2. Set up environment variables:

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_AUTH_API_ENDPOINT` - The authentication API endpoint
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
- `NEXT_PUBLIC_WHISPERING_API_ENDPOINT` - The Whisper audio transcription API endpoint

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- ✅ Google OAuth Authentication
- ✅ JWT Token Management
- ✅ Voice Recording with MediaRecorder API
- ✅ Audio Transcription via Whisper
- ✅ Speech Recognition (browser native)
- ✅ Audio Playback Controls
- ✅ Responsive Design
- ✅ Mobile-First Approach
- ✅ Slide-out Navigation Menu
- ✅ Context-based State Management

## Tech Stack

- **Framework**: Next.js 15.1.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (with Radix UI primitives)
- **Icons**: Lucide React
- **Authentication**: Google OAuth + JWT
- **State Management**: React Context API

## Project Structure

```├── AuthAPI.ts   # Authentication API client
│   └── WhisperAPI.ts # Audio transcription API client
├── app/              # Next.js app directory
│   ├── layout.tsx   # Root layout with providers
│   ├── page.tsx     # Home page with auth flow
│   ├── globals.css  # Global styles and CSS variables
│   └── fonts.css    # Font imports
├── components/       # React components
│   └── AppHeader.tsx # Header with navigation
├── context/          # React contexts
│   ├── HeaderContext.tsx # Header configuration
│   └── AudioContext.tsx  # Audio playback context
├── hooks/            # Custom React hooks
│   ├── useVoiceRecording.ts    # Voice recording hook
│   └── useSpeechRecognition.ts # Speech recognition hook
├── components/       # React components
│   └── AppHeader.tsx # Header with navigation
├── context/          # React contexts
│   └── HeaderContext.tsx # Header configuration
├── lib/              # Utility functions
│   └── utils.ts     # Tailwind merge utility
├── utils/            # Business logic utilities
│   └── AuthUtil.ts  # Authentication utilities
└── public/           # Static assets
```

## Authentication Flow

1. On app load, checks for stored user token in localStorage
2. If token exists, verifies it with the backend
3. If no token or expired, triggers Google Sign-In
4. Exchanges Google token for Toto token
5. Stores user credentials in cookies and localStorage

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Styling

The app uses the same color scheme and styling as the Tome project:
- Primary background: `#00acc1` (cyan)
- Comfortaa font family
- Custom CSS variables for theming
- Responsive layout with centered content and side panels

## Audio Features Usage

### Voice Recording

```tsx
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { WhisperAPI } from '@/api/WhisperAPI';

function MyComponent() {
  const { isRecording, startRecording, stopRecording } = useVoiceRecording({
    onRecordingComplete: async (audioBlob) => {
      // Send to Whisper for transcription
      const whisper = new WhisperAPI();
      const result = await whisper.transcribeAudio(audioBlob, 'toto', 'sync');
      console.log('Transcribed text:', result.text);
    }
  });

  return (
    <button onClick={isRecording ? stopRecording : startRecording}>
      {isRecording ? 'Stop Recording' : 'Start Recording'}
    </button>
  );
}
```

### Speech Recognition

```tsx
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

function MyComponent() {
  const { isListening, startListening } = useSpeechRecognition({
    onTranscript: (text) => {
      console.log('Recognized speech:', text);
    },
    timeoutMs: 10000
  });

  return (
    <button onClick={startListening} disabled={isListening}>
      {isListening ? 'Listening...' : 'Start Speech Recognition'}
    </button>
  );
}
```

### Audio Playback

```tsx
import { useAudio } from '@/context/AudioContext';

function MyComponent() {
  const { play, stop, isSpeaking } = useAudio();

  const playAudio = () => {
    play('https://example.com/audio.mp3', () => {
      console.log('Audio finished playing');
    });
  };

  return (
    <button onClick={isSpeaking ? stop : playAudio}>
      {isSpeaking ? 'Stop' : 'Play Audio'}
    </button>
  );
}
```
