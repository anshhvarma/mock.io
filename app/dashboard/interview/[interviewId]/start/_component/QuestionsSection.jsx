import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Lightbulb, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function QuestionsSection({ parsedQuestions }) {
    const textToSpeech=(text)=>{
        if('speechSynthesis' in window){
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech)
        }else{
            alert('Sorry, your browser does not support')
        }
    }
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) =>
            prevIndex < parsedQuestions.length - 1 ? prevIndex + 1 : 0
        );
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className='border rounded-lg p-5'>
                <h1 className="text-2xl font-bold mb-6">Mock Interview Review</h1>
                {parsedQuestions.length > 0 ? (
                    <div>
                        <Card key={currentQuestionIndex} className="bg-white shadow-sm">
                            <CardHeader className="border-b">
                                <CardTitle className="flex justify-between text-lg font-semibold text-gray-800">
                                    Question {currentQuestionIndex + 1}
                                    <Volume2 className='cursor-pointer' onClick={()=>textToSpeech(parsedQuestions[currentQuestionIndex].question)}/>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-gray-700">Question:</h3>
                                        <p className="mt-1 text-gray-600">{parsedQuestions[currentQuestionIndex].question}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="mt-4 text-right">
                            <Button
                                variant='outline'
                                onClick={handleNextQuestion}
                                className="px-4 py-2  text-black rounded-md"
                            >
                                Next Question
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">No interview questions found.</p>
                    </div>
                )}
            </div>
            <div className='border rounded-lg p-5 bg-slate-100 my-10'>
                <h2 className='flex gap-2 items-center text-primary'>
                    <Lightbulb />
                    <strong>Note:</strong>
                </h2>
                <h2 className='text-sm text-primary my-2'>
                    {process.env.NEXT_PUBLIC_INFORMATION}
                    <br />
                    {process.env.NEXT_PUBLIC_INFORMATION1}
                </h2>
            </div>
        </div>
    );
}

export default QuestionsSection;
