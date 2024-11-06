'use client'

import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import QuestionsSection from './_component/QuestionsSection'
import RecordAnswerSection from './_component/RecordAnswerSection'

function InterviewPage() {
    const params = useParams()
    const [interviewData, setInterviewData] = useState(null)
    const [interviewId, setInterviewId] = useState(null)
    const [parsedQuestions, setParsedQuestions] = useState([])
    const [hasLogged, setHasLogged] = useState(false)

    useEffect(() => {
        async function fetchParams() {
            const { interviewId } = await params
            setInterviewId(interviewId)
        }
        fetchParams()
    }, [params])

    const parseInterviewData = (jsonStr) => {
        try {
            let cleaned = jsonStr.replace(/```json\n?|\n?```/g, '').trim()
            cleaned = cleaned
                .replace(/[\u0000-\u0019]+/g, '')
                .replace(/\\n/g, ' ')
                .replace(/\\"/g, '"')
                .replace(/`/g, "'")
                .replace(/\\(?!["\\/bfnrt])/g, '')
            
            let parsedData = []
            try {
                if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
                    parsedData = JSON.parse(cleaned)
                } else {
                    const regex = /\{[^{}]*\}/g;
                    let match;
                    while ((match = regex.exec(cleaned)) !== null) {
                        try {
                            const obj = JSON.parse(match[0])
                            if (obj.question && obj.answer) {
                                parsedData.push(obj)
                            }
                        } catch (e) {
                            console.log("Failed to parse object:", match[0])
                        }
                    }
                }
            } catch (e) {
                console.error("Parsing error:", e)
            }
    
            return parsedData
        } catch (error) {
            console.error('Error parsing interview data:', error)
            return []
        }
    }

    const GetInterviewDetails = async () => {
        try {
            const result = await db.select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, interviewId))
            console.log(result[0].jsonMockRes)

            if (result && result[0]) {
                const jsonMockResponse = result[0].jsonMockRes
                const parsedData = parseInterviewData(jsonMockResponse)
                setParsedQuestions(parsedData)
                setInterviewData(result[0])
            }
        } catch (error) {
            console.error("Error fetching interview details:", error)
            setParsedQuestions([])
            setInterviewData(null)
        }
    }

    useEffect(() => {
        if (interviewId) {
            GetInterviewDetails()
        }
    }, [interviewId])

    // New useEffect for logging questions only once when they're available
    useEffect(() => {
        if (parsedQuestions.length > 0 && !hasLogged) {
            console.log('Interview Questions:');
            parsedQuestions.forEach((qa, index) => {
                console.log(`Q${index + 1}:`, qa.question);
            });
            setHasLogged(true);  // Prevent further logging
        }
    }, [parsedQuestions, hasLogged]);

    if (!interviewData) {
        return <div className="p-4">Loading interview data...</div>
    }

    return (
       <div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                    <QuestionsSection parsedQuestions={parsedQuestions}/>
                    <RecordAnswerSection />
                </div>
       </div>
    )
}

export default InterviewPage
