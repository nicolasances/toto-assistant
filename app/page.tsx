'use client'

import { useEffect, useState } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { getStoredUserToken, googleSignIn } from '@/utils/AuthUtil';
import { AuthAPI } from '@/api/AuthAPI';
import RoundButton from '@/components/RoundButton';
import { MediaRecorderEvent, useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useAudio } from '@/context/AudioContext';
import { on } from 'events';
import { WhisperAPI } from '@/api/WhisperAPI';

export default function Home() {

    const [loginNeeded, setLoginNeeded] = useState<boolean | null>(null)
    const { setConfig } = useHeader();
    const { play, stop, pause, replay, isSpeaking } = useAudio();
    const [transcription, setTranscription] = useState<string>('')

    const onRecordingComplete = async (audioBlob: Blob) => {
        console.log('Recording complete, transcribing...');

        // Create a URL and play using the audio context
        // const audioUrl = URL.createObjectURL(audioBlob);

        // play(audioUrl)
    }

    useEffect(() => { setConfig({ title: 'Toto Assistant', }); }, [setConfig]);

    /**
     * Verifies if the user is authenticated
     */
    const verifyAuthentication = async () => {

        // Get the user from local storage
        const user = getStoredUserToken()

        // Login is needed if the user is not in local storage
        if (!user) {

            console.log("No user or Id Token found. Login needed.");

            setLoginNeeded(true)

            return;

        }

        // The user is stored in local storage
        // Verify its token
        console.log("Verifying Id Token");
        const verificationResult = await new AuthAPI().verifyToken(user.idToken)

        // Check that the token hasn't expired
        if (verificationResult.name == "TokenExpiredError") {

            console.log("JWT Token Expired");

            // If the token has expired, you need to login
            setLoginNeeded(true);

            return;

        }

        setLoginNeeded(false);

        console.log("Token successfully verified.");

    }

    /**
     * Triggers the Google SignIn process
     */
    const triggerSignIn = async () => {

        if (loginNeeded === true) {

            const authenticatedUser = await googleSignIn()

            if (authenticatedUser) setLoginNeeded(false)
        }

    }

    useEffect(() => { verifyAuthentication() }, [])
    useEffect(() => { triggerSignIn() }, [loginNeeded])

    // Empty screen while Google SignIn is loading
    if (loginNeeded == null) return (<div></div>);
    if (loginNeeded === true) return (<div></div>);

    return (
        <div className="app-content">
            <div className="flex flex-col items-center justify-center flex-1">
                <div className='flex-1'></div>
                <VoiceRecordingButton onAudioRecorded={onRecordingComplete} onAudioTranscribed={setTranscription} />
                <div className='flex-1 overflow-auto min-h-0 pt-8 px-4 text-base'>
                    {transcription}
                </div>
            </div>
        </div>
    );
}

function VoiceRecordingButton({ onAudioRecorded, onAudioTranscribed }: { onAudioRecorded?: (audioBlob: Blob) => void, onAudioTranscribed?: (transcription: string) => void }) {

    const [status, setStatus] = useState<VoiceRecordingState>('ready')

    const onRecordingComplete = async (audioBlob: Blob) => {
        setStatus('ready');
        onAudioRecorded?.(audioBlob)

        const transcription = await transcribeAudio(audioBlob);

        onAudioTranscribed?.(transcription.text ?? 'No text was transcribed')

        // Could make it now better with the following prompt to an LLM: 
        // In the historical context of Italy in the mid 1400s, look at the following audio transcript and correct it to fit the context. DO NOT correct the content, but only the form, making sure that there are no weird words, out-of-context words. It's a transcription, so the model that does Speech to text did clearly not understand many words. Make sure to correct them given the context. Also format it nicely so that it's readable 
    }

    const onRecordingEvent = (event: MediaRecorderEvent) => {
        if (event == 'recordingStarted') setStatus('recordingStarted')
        console.log(`Received event: ${event}`);
    }

    const voiceRecording = useVoiceRecording({
        onRecordingComplete: onRecordingComplete,
        onEvent: onRecordingEvent
    })

    const transcribeAudio = async (audioBlob: Blob) => {

        // Call the API to transcribe the audio
        const result = await new WhisperAPI().transcribeAudio(audioBlob, 'toto');

        console.log(result);

        return result;

    }

    const toggleSpeechRecognition = async () => {

        if (!voiceRecording.isRecording) {
            setStatus('recordingRequested')
            await voiceRecording.startRecording();
        }
        else {
            setStatus('stoppingRecording')
            await voiceRecording.stopRecording();
        }

    }

    const color = (status: VoiceRecordingState) => {
        if (status == 'ready') return 'bg-lime-200';
        else if (status == 'recordingStarted') return 'bg-red-700';

        return '';
    }

    return (
        <RoundButton
            svgIconPath={{
                src: "/images/microphone.svg",
                alt: "Speak",
                color: color(status)
            }}
            breathe={status == 'recordingStarted'}
            disabled={status == 'recordingRequested' || status == 'stoppingRecording'}
            secondary={status != 'ready'}
            size='car'
            onClick={toggleSpeechRecognition}
        />
    )
}

type VoiceRecordingState = 'ready' | 'recordingRequested' | 'recordingStarted' | 'stoppingRecording' | 'recordingStopped' | 'error';