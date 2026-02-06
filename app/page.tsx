'use client'

import { useEffect, useState } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { getStoredUserToken, googleSignIn } from '@/utils/AuthUtil';
import { AuthAPI } from '@/api/AuthAPI';
import RoundButton from '@/components/RoundButton';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useAudio } from '@/context/AudioContext';

export default function Home() {

    const [loginNeeded, setLoginNeeded] = useState<boolean | null>(null)
    const { setConfig } = useHeader();
    const { play, stop, pause, replay, isSpeaking } = useAudio();

    const onRecordingComplete = async (audioBlob: Blob) => {
        console.log('Recording complete, transcribing...');

        // Create a URL and play using the audio context
        const audioUrl = URL.createObjectURL(audioBlob);

        play(audioUrl)
    }

    const voiceRecording = useVoiceRecording({ onRecordingComplete: onRecordingComplete })

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

    const toggleSpeechRecognition = async () => {

        if (!voiceRecording.isRecording) {
            await voiceRecording.startRecording();
        }
        else {
            await voiceRecording.stopRecording();
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
                <RoundButton svgIconPath={{ src: "/images/microphone.svg", alt: "Speak", color: voiceRecording.isRecording ? "bg-red-700" : "" }} size='car' onClick={toggleSpeechRecognition} secondary={voiceRecording.isRecording} />
            </div>
        </div>
    );
}
