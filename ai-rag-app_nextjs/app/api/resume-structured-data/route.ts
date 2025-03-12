import { NextResponse } from "next/server";
import { promises as fs } from 'fs'; // To save the file temporarily
import { v4 as uuidv4 } from 'uuid'; // To generate a unique filename
import { ChatOpenAI } from "@langchain/openai";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { parsePdf, Resume } from "@/lib/resumeParsing";



export async function POST(req: Request) {
    const formData: FormData = await req.formData();
    const uploadedFiles = formData.getAll('file');

    let fileName = '';
    let parsedText = '';

    if (uploadedFiles && uploadedFiles.length > 0) {
        const uploadedFile = uploadedFiles[0];

        // Check if uploadedFile is of type File
        if (uploadedFile instanceof File) {
            // Generate a unique filename
            fileName = uuidv4();
            const tempFilePath = `/tmp/${fileName}.pdf`;
            const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

            await fs.writeFile(tempFilePath, fileBuffer);

            // Wait for PDF parsing to complete and get the parsed text
            parsedText = await parsePdf(tempFilePath);
        } else {
            console.log('Uploaded file is not in the expected format.');
        }
    } else {
        console.log('No files found.');
    }



    const model = new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0,
        apiKey: ""
    });


    const resumeSchemaJson = {
        summary: "Summary should be at least 10 characters long",
        fullName: "Full name is required",
        email: "email from resume",
        phone: "Optional since not all resumes have it",
        linkedIn: "LinkedIn URL (optional)",
        portfolio: "portfolio URL (optional)",
        jobTitle: "Job title is required",
        experience: [
            {
                companyName: "Company name is required",
                jobTitle: "Job title is required",
                startDate: "Start date is required",
                endDate: "Optional, can be 'Present' or a year",
                responsibilities: "Multiple responsibilities per job (optional)"
            }
        ],
        skills: "technical skills from resume",
        education: [
            {
                degree: "Degree name is required",
                institution: "Institution name is required",
                yearsAttended: "Optional"
            }
        ],
        certifications: [
            {
                name: "Certification name is required",
                organization: "Optional"
            }
        ],
        languages: "Optional",
        projects: [
            {
                title: "Project title is required",
                description: "Optional"
            }
        ],
        publications: [
            {
                title: "Publication title is required",
                publisher: "Optional"
            }
        ],
        awards: [
            {
                title: "Award title is required",
                issuer: "Optional"
            }
        ],
        hobbies: "Optional",
        github: "GitHub URL (optional)",
        dribbble: "Dribbble URL (optional)",
        behance: "Behance URL (optional)"
    };


    const formatInstructions = `Respond only in valid JSON. The JSON object you return should match the following schema:
${JSON.stringify(resumeSchemaJson, null, 2)}

Where you should extract all the information from the resume, and don't escape anything. Consider all text in the resume.`;


    const parser = new JsonOutputParser<Resume>();

    const prompt = await ChatPromptTemplate.fromMessages([
        ["system", "Answer the user query. Wrap the output in `json` tags. \n{format_instructions}"],
        ["human", "{query}"],
    ]).partial({
        format_instructions: formatInstructions,
    });


    const query = "Extract all the information from the following resume: " + parsedText;


    const chain = prompt.pipe(model).pipe(parser);
    const resp = await chain.invoke({ query });


    return NextResponse.json({ result: resp });
}