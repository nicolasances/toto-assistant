'use client'

import { useState } from 'react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useAudio } from '@/context/AudioContext';
import { WhisperAPI } from '@/api/WhisperAPI';

export default function AudioDemo() {
    const [transcribedText, setTranscribedText] = useState<string>('');
    const [recognizedText, setRecognizedText] = useState<string>('');
    const [isTranscribing, setIsTranscribing] = useState(false);

    const { isRecording, startRecording, stopRecording } = useVoiceRecording({
        onRecordingComplete: async (audioBlob) => {
            console.log('Recording complete, transcribing...');
            setIsTranscribing(true);
            try {
                const whisper = new WhisperAPI();
                const result = await whisper.transcribeAudio(audioBlob, 'toto', 'sync');
                setTranscribedText(result.text || 'No text transcribed');
            } catch (error) {
                console.error('Transcription error:', error);
                setTranscribedText('Error transcribing audio');
            } finally {
                setIsTranscribing(false);
            }
        }
    });

    const { isListening, startListening } = useSpeechRecognition({
        onTranscript: (text) => {
            setRecognizedText(text);
        },
        timeoutMs: 10000,
        onError: (error) => {
            console.error('Speech recognition error:', error);
        }
    });

    const { isSpeaking } = useAudio();

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold">Voice Recording & Whisper Transcription</h2>
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isTranscribing}
                    className={`p-4 rounded-lg font-semibold transition ${
                        isRecording 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-cyan-700 hover:bg-cyan-800'
                    } ${isTranscribing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isTranscribing ? '⏳ Transcribing...' : isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
                </button>
                {transcribedText && (
                    <div className="p-4 bg-cyan-700 rounded-lg">
                        <p className="font-semibold mb-2">Transcribed Text:</p>
                        <p>{transcribedText}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold">Speech Recognition (Browser Native)</h2>
                <button
                    onClick={startListening}
                    disabled={isListening}
                    className={`p-4 rounded-lg font-semibold transition ${
                        isListening 
                            ? 'bg-yellow-500 hover:bg-yellow-600' 
                            : 'bg-cyan-700 hover:bg-cyan-800'
                    } ${isListening ? 'opacity-75' : ''}`}
                >
                    {isListening ? '👂 Listening...' : '🗣️ Start Speech Recognition'}
                </button>
                {recognizedText && (
                    <div className="p-4 bg-cyan-700 rounded-lg">
                        <p className="font-semibold mb-2">Recognized Text:</p>
                        <p>{recognizedText}</p>
                    </div>
                )}
            </div>

            <div className="p-4 bg-cyan-900 rounded-lg text-sm">
                <p className="font-semibold mb-2">ℹ️ Info:</p>
                <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Voice Recording</strong>: Records audio and sends it to Whisper API for transcription</li>
                    <li><strong>Speech Recognition</strong>: Uses browser's native speech recognition (works best in Chrome)</li>
                    <li><strong>Audio Context</strong>: Available globally via useAudio() hook for playback</li>
                </ul>
            </div>
        </div>
    );
}
