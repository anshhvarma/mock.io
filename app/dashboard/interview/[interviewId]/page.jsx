'use client'

import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { WebcamIcon } from 'lucide-react'
import React, { use, useState } from 'react'
import { useEffect } from 'react'
import Webcam from 'react-webcam'

function Interview({params}) {

    const [interviewData, setInterviewData] = useState();
    const [webCamEnable, setwebCamEnable] = useState(false);
    const { interviewId } = use(params);

    useEffect(() => {
        console.log(interviewId)
        GetInterviewDetails();
    }, [interviewId])

    //used to get interview details by mockid/interview id
    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, interviewId))

        console.log(result)
        setInterviewData(result[0])
    }

// console.log(interviewData?.[0]?.jobPosition)

    return (
        <div className='my-10 flex justify-center items-center flex-col'>
            <h2 className='font-bold text-2xl'>
                Let's Get Started
            </h2>
            <div>
                <>
                </>
                {webCamEnable ? <Webcam
                    onUserMedia={() => setwebCamEnable(true)}
                    onUserMediaError={() => setwebCamEnable(false)}
                    mirrored={true}
                    style={{
                        height: 300,
                        width: 300
                    }}
                /> :
                    <>
                        <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
                        <Button onClick={() => setwebCamEnable(true)}>
                            Enable Web Cam and Microphone
                        </Button>
                    </>
                }
            </div>

            <div>
                <h2>
                    <strong>
                        Job Role/Job Position
                    </strong>
                </h2>
            </div>
        </div>
    )
}

export default Interview