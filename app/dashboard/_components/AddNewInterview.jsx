'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import { chatSession } from '@/utils/genAiModel'
import { LoaderCircle } from 'lucide-react'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { db } from '@/utils/db'


const AddNewInterview = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const handleDialogClose = () => setOpenDialog(false);
    const [jobPosition, setJobPosition] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [jobExperience, setJobExperience] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [jsonResponse, setJsonResponse] = useState([]); 
    const {user} = useUser();

    const cleanJsonString = (str) => {
        try {
            // Remove markdown formatting
            let cleaned = str.replace(/```json\n?|\n?```/g, '').trim();
            
            // Find the first '[' and last ']'
            const start = cleaned.indexOf('[');
            const end = cleaned.lastIndexOf(']') + 1;
            
            if (start !== -1 && end !== -1) {
                cleaned = cleaned.slice(start, end);
                
                // Replace problematic characters and escape quotes properly
                cleaned = cleaned
                    .replace(/[\u0000-\u0019]+/g, "") // Remove control characters
                    .replace(/\\n/g, " ") // Replace newlines with spaces
                    .replace(/\\"/g, '"') // Fix escaped quotes
                    .replace(/"/g, '"') // Normalize quotes
                    .replace(/`/g, "'") // Replace backticks with single quotes
                    .replace(/\\(?!["\\/bfnrt])/g, ""); // Remove invalid escapes
                
                // Test if it's valid JSON
                JSON.parse(cleaned);
                return cleaned;
            }
            throw new Error("No valid JSON array found");
        } catch (error) {
            console.error("JSON cleaning error:", error);
            console.log("Problematic string:", str);
            throw error;
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Escape special characters in the input
            const safeJobPosition = jobPosition.replace(/["\n\r]/g, ' ');
            const safeJobDesc = jobDesc.replace(/["\n\r]/g, ' ');
            const safeJobExperience = jobExperience.toString();

            const InputPrompt = `Generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with answers for this position. Return ONLY a JSON array with this exact format, no extra text:
[
  {
    "question": "Question text here",
    "answer": "Answer text here"
  }
]

Position details:
- Role: ${safeJobPosition}
- Description: ${safeJobDesc}
- Years of Experience: ${safeJobExperience}`;

            const result = await chatSession.sendMessage(InputPrompt);
            const responseText = result.response.text();
            
            // Log the raw response for debugging
            // console.log("Raw API response:", responseText);
            
            // Clean and parse the JSON
            const cleanedJson = cleanJsonString(responseText);
            // console.log("Cleaned JSON:", cleanedJson);
            
            const parsedJson = JSON.parse(cleanedJson);
            console.log("Successfully parsed JSON:", parsedJson);
            setJsonResponse(parsedJson);

            if(parsedJson){
                const resp =await db.insert(MockInterview)
                .values({
                    mockId:uuidv4(),
                    jsonMockRes:parsedJson,
                    jobPosition:jobPosition,
                    jobDesc:jobDesc,
                    jobExperience:jobExperience,
                    createdBy:user?.primaryEmailAddress?.emailAddress,
                    createdAt:moment().format('DD-MM-yyyy')
                }).returning({mockId:MockInterview.mockId});
    
                console.log("Inserted ID", resp);
            }else{
                console.log("ERROR")
            }
            


            // Handle successful parsing here (e.g., save to state or pass to parent)
            
            handleDialogClose(); // Close dialog on success

        } catch (error) {
            console.error('Error details:', error);
            setError('Failed to generate interview questions. Please try again. If the problem persists, try simplifying the job description.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className='p-10 border rounded-lg hover:scale-105 hover:shadow-md cursor-pointer transition-all bg-secondary'
                onClick={() => setOpenDialog(true)}
            >
                <h2 className='text-lg text-center'>
                    + Add New
                </h2>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>
                            Tell us About the Job You Want to Interview For
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the details below to start your interview preparation.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={onSubmit}>
                        <div>
                            <div className='mt-7 my-3'>
                                <label>Job Role/Job Position</label>
                                <Input 
                                    placeholder="Ex. Full-Stack Developer" 
                                    required
                                    value={jobPosition}
                                    onChange={(event) => setJobPosition(event.target.value)}
                                />
                            </div>
                            <div className='my-3'>
                                <label>Job Description/Tech Stack (In Short)</label>
                                <Textarea 
                                    placeholder="Ex. React, Angular, Node.js, MySQL..." 
                                    required
                                    value={jobDesc}
                                    onChange={(event) => setJobDesc(event.target.value)}
                                />
                            </div>
                            <div className='my-3'>
                                <label>Years of Experience</label>
                                <Input 
                                    placeholder="Ex. 5" 
                                    type="number" 
                                    max="20" 
                                    min="0" 
                                    required
                                    value={jobExperience}
                                    onChange={(event) => setJobExperience(event.target.value)}
                                />
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm mb-3 p-2 bg-red-50 rounded">
                                    {error}
                                </div>
                            )}
                            <div className='flex gap-5 justify-end mt-4'>
                                <Button type="button" variant='ghost' onClick={handleDialogClose}>
                                    Cancel
                                </Button>
                                <Button disabled={loading} type="submit">
                                    {loading ? (
                                        <>
                                            <LoaderCircle className='animate-spin mr-2' />
                                            <span>Generating Questions...</span>
                                        </>
                                    ) : "Start Interview"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewInterview