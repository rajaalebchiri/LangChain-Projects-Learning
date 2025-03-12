import PDFParser from "pdf2json";
import { z } from "zod";

export function parsePdf(tempFilePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const pdfParser = new (PDFParser as any)(null, 1);
        pdfParser.on('pdfParser_dataError', (errData: unknown) => reject(errData.parserError));
        pdfParser.on('pdfParser_dataReady', () => {
            const text = (pdfParser as any).getRawTextContent();
            resolve(text);
        });
        pdfParser.loadPDF(tempFilePath);
    });
}

export const ResumeSchema = z.object({
    summary: z.string().describe("Summary should be at least 10 characters long"),
    fullName: z.string().describe("Full name is required"),
    email: z.string().describe("email from resume"),
    phone: z.string().optional(), // Optional since not all resumes have it
    linkedIn: z.string().describe("LinkedIn URL").optional(),
    portfolio: z.string().describe("portfolio URL").optional(),
    jobTitle: z.string().describe("Job title is required"),
    experience: z.array(
        z.object({
            companyName: z.string().describe("Company name is required"),
            jobTitle: z.string().describe("Job title is required"),
            startDate: z.string().describe("Start date is required"), // Expecting a year or full date
            endDate: z.string().optional(), // Can be "Present" or a year
            responsibilities: z.array(z.string()).optional(), // Multiple responsibilities per job
        })
    ),
    skills: z.array(z.string().describe("technical skills from resume")),
    education: z.array(
        z.object({
            degree: z.string().describe("Degree name is required"),
            institution: z.string().describe("Institution name is required"),
            yearsAttended: z.string().optional(),
        })
    ),
    certifications: z.array(
        z.object({
            name: z.string().describe("Certification name is required"),
            organization: z.string().optional(),
        })
    ).optional(),
    languages: z.array(z.string()).optional(),
    projects: z.array(
        z.object({
            title: z.string().describe("Project title is required"),
            description: z.string().optional(),
        })
    ).optional(),
    publications: z.array(
        z.object({
            title: z.string().describe("Publication title is required"),
            publisher: z.string().optional(),
        })
    ).optional(),
    awards: z.array(
        z.object({
            title: z.string().describe("Award title is required"),
            issuer: z.string().optional(),
        })
    ).optional(),
    hobbies: z.array(z.string()).optional(),
    github: z.string().describe("GitHub URL").optional(),
    dribbble: z.string().describe("Dribbble URL").optional(),
    behance: z.string().describe("Behance URL").optional(),
});

export type Resume = z.infer<typeof ResumeSchema>;