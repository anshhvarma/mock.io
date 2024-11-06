'use client'

import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';
import Webcam from 'react-webcam'

function Interview() {
    const params = useParams();
    const [interviewData, setInterviewData] = useState();
    const [webCamEnable, setWebCamEnable] = useState(false);
    const [interviewId, setInterviewId] = useState(null);

    // Fetch params once available
    useEffect(() => {
        async function fetchParams() {
            const { interviewId } = await params;
            setInterviewId(interviewId);
        }

        fetchParams();
    }, [params]);

    // Fetch interview details based on interviewId
    useEffect(() => {
        if (interviewId) {
            GetInterviewDetails();
        }
    }, [interviewId]);

    // Function to get interview details by mockId/interviewId
    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, interviewId));

        console.log(result);
        setInterviewData(result[0]);
    };
    

    return (
        <div className='my-10'>
            <h2 className='font-bold text-2xl'>
                Let's Get Started
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <div className='flex flex-col my-5 gap-5 '>
                    <div className='flex flex-col p-5 rounded-lg border gap-5'>
                        <h2>
                            <strong>Job Role/Job Position:</strong>
                            {interviewData?.jobPosition || 'N/A'}
                        </h2>
                        <h2>
                            <strong>Job Description/Tech Stack:</strong>
                            {interviewData?.jobDesc || 'N/A'}
                        </h2>
                        <h2>
                            <strong>Years of Experience:</strong>
                            {interviewData?.jobExperience || 'N/A'}
                        </h2>
                    </div>
                    <div className='p-5 border rounded-lg bg-yellow-100 '>
                        <h2 className='flex text-yellow-600 gap-2 items-center'>
                            <Lightbulb /><strong>Information</strong>
                        </h2>
                        <h2 className='mt-3'>
                            {process.env.NEXT_PUBLIC_INFORMATION}
                        </h2>
                        <h2 className='mt-2 '>
                            <strong>{process.env.NEXT_PUBLIC_INFORMATION1}</strong>
                        </h2>
                    </div>
                </div>
                <div>
                    {webCamEnable ? (
                        <Webcam
                            onUserMedia={() => setWebCamEnable(true)}
                            onUserMediaError={() => setWebCamEnable(false)}
                            mirrored={true}
                            style={{ height: 300, width: 300 }}
                        />
                    ) : (
                        <>
                            <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
                            <Button className='w-full' onClick={() => setWebCamEnable(true)}>
                                Enable Web Cam and Microphone
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <div className='flex justify-end items-end mr-56 mb-9'>
                <Link href={`/dashboard/interview/${interviewId}/start`}>
                    <Button disabled={!interviewId}>
                        Start Interview
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default Interview;
