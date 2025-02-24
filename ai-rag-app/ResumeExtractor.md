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




import { Resume } from "@/lib/resumeParsing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const ResumeDisplay = ({ extractedData }: { extractedData: Resume }) => {
  console.log(extractedData);
  return (
    <div className="p-6 space-y-4">
      {/* Personal Information Section */}
      <Card className="bg-white shadow-md rounded-md">
        <CardHeader>
          <CardTitle className="div-xl font-semibold">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <CardDescription>
              <strong>Name:</strong> {extractedData.fullName}
            </CardDescription>
            <CardDescription>
              <strong>Email:</strong> {extractedData.email}
            </CardDescription>
            {extractedData.phone && (
              <CardDescription>
                <strong>Phone:</strong> {extractedData.phone}
              </CardDescription>
            )}
            {extractedData.linkedIn && (
              <div>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href={extractedData.linkedIn}
                  target="_blank"
                  className="div-blue-500"
                >
                  {extractedData.linkedIn}
                </a>
              </div>
            )}
            {extractedData.portfolio && (
              <div>
                <strong>Portfolio:</strong>{" "}
                <a
                  href={extractedData.portfolio}
                  target="_blank"
                  className="div-blue-500"
                >
                  {extractedData.portfolio}
                </a>
              </div>
            )}
            <div>
              <strong>Job CardTitle:</strong> {extractedData.jobTitle}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <Card className="bg-white shadow-md rounded-md">
        <CardHeader>
          <CardTitle className="div-xl font-semibold">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div>{extractedData.summary}</div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      {
        <Card className="bg-white shadow-md rounded-md">
          <CardHeader>
            <CardTitle className="div-xl font-semibold">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{extractedData.skills}</p>
          </CardContent>
        </Card>
      }

      {/* Experience Section */}
      <Card className="bg-white shadow-md rounded-md">
        <CardHeader>
          <CardTitle className="div-xl font-semibold">Experience</CardTitle>
        </CardHeader>
        <CardContent>
          {extractedData.experience.map((job, index) => (
            <div key={index} className="space-y-2">
              <div>
                <strong>
                  {job.jobTitle} at {job.companyName}
                </strong>
              </div>
              <div>
                <em>
                  {job.startDate} - {job.endDate || "Present"}
                </em>
              </div>
              {job.responsibilities && (
                <ul className="list-disc pl-5 space-y-1">
                  {job.responsibilities.map((responsibility, idx) => (
                    <li key={idx}>
                      <div>{responsibility}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card className="bg-white shadow-md rounded-md">
        <CardHeader>
          <CardTitle className="div-xl font-semibold">Education</CardTitle>
        </CardHeader>
        <CardContent>
          {extractedData.education.map((edu, index) => (
            <div key={index} className="space-y-2">
              <div>
                <strong>{edu.degree}</strong> from {edu.institution}
              </div>
              {edu.yearsAttended && (
                <div>
                  <em>{edu.yearsAttended}</em>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Certifications Section */}
      {extractedData.certifications &&
        extractedData.certifications.length > 0 && (
          <Card className="bg-white shadow-md rounded-md">
            <CardHeader>
              <CardTitle className="div-xl font-semibold">
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {extractedData.certifications.map((cert, index) => (
                <div key={index} className="space-y-2">
                  <div>
                    <strong>{cert.name}</strong>
                    {cert.organization && ` by ${cert.organization}`}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

      {/* Projects Section */}
      {extractedData.projects && extractedData.projects.length > 0 && (
        <Card className="bg-white shadow-md rounded-md">
          <CardHeader>
            <CardTitle className="div-xl font-semibold">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {extractedData.projects.map((project, index) => (
              <div key={index} className="space-y-2">
                <div>
                  <strong>{project.title}</strong>
                </div>
                {project.description && <div>{project.description}</div>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Additional Sections: Awards, Languages, etc. */}
      {extractedData.awards && extractedData.awards.length > 0 && (
        <Card className="bg-white shadow-md rounded-md">
          <CardHeader>
            <CardTitle className="div-xl font-semibold">Awards</CardTitle>
          </CardHeader>
          <CardContent>
            {extractedData.awards.map((award, index) => (
              <div key={index} className="space-y-2">
                <div>
                  <strong>{award.title}</strong>
                  {award.issuer && ` by ${award.issuer}`}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResumeDisplay;




"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import * as pdfjsLib from "pdfjs-dist";
import { Resume } from "@/lib/resumeParsing";
import ResumeDisplay from "./ResumeDisplay";



// Set the worker source (must be done before calling `getDocument`)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
export function ResumeExtractor() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [informations, setInformations] = useState<Resume>();

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
  };

  const sendRequest = async () => {
    if (files.length === 0) {
      console.log("No files selected");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      setLoading(true);
      const response = await fetch("/api/resume-structured-data", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setInformations(data.result);
      console.log(data);
    } catch (error) {
      console.log("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
      <div className="flex justify-center mt-4">
        <button
          onClick={sendRequest}
          disabled={loading}
          className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
        >
          {loading ? "Uploading..." : "Start Extracting"}
        </button>
      </div>
      {informations && (
        <div>
          <h2 className="text-xl">Extracted Inforamtions</h2>
          <ResumeDisplay extractedData={informations} />
        </div>
      )}
    </div>
  );
}
