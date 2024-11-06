'use client'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import React, { useEffect, useState } from 'react'
import { Camera, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'

function RecordAnswerSection() {
    const [userAnswer, setUserAnswer] = useState('');

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        results.map((result) => (
            setUserAnswer(prevAns => prevAns + result?.transcript)
        ));
    }, [results]);

    return (
        <div className='flex flex-col items-center'>
            <div className='flex flex-col bg-slate-200 items-center rounded-lg p-5 my-20 h-[345px]'>
                <Camera width={300} height={300} className='absolute pt-13' />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10,
                    }}
                />
            </div>
            <Button
                variant="outline"
                onClick={isRecording ? stopSpeechToText : startSpeechToText}
            >
                {isRecording ? (
                    <h2 className='text-red-600 flex gap-2'>
                        <Mic /> Stop Recording
                    </h2>
                ) : (
                    'Record Answer'
                )}
            </Button>

            <Button onClick={() => console.log(userAnswer)}>
                Show User Answers
            </Button>
        </div>
    )
}

export default RecordAnswerSection;
