import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";

import { z } from "zod";

// Define the response structure schema
const LearningMaterialSchema = z.object({
    key_summary: z.string().describe("A concise explanation of the topic in 2-3 sentences"),
    study_materials: z.array(z.object({
        title: z.string(),
        url: z.string().url(),
        type: z.string(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"])
    })).describe("Curated learning resources"),
    key_concepts: z.array(z.object({
        concept: z.string(),
        description: z.string()
    })).describe("Essential concepts to understand"),
    sources_citations: z.array(z.object({
        title: z.string(),
        author: z.string().optional(),
        year: z.number().optional(),
        url: z.string().url().optional(),
        type: z.string()
    })).describe("Academic and professional references")
});


const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    apiKey: ""
});

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    const { message, type } = await req.json();

    const structuredLlm = model.withStructuredOutput(LearningMaterialSchema, { method: "json_mode", });


    // Request the OpenAI API for the response based on the prompt
    const response = await structuredLlm.invoke("create a roadmap for the following topic: " + message + "use the following material type" + type + " respond in JSON with `key_summary`, `study_materials`, `key_concepts` and `sources_citations` keys Ensure all URLs and citations are properly formatted.");

    return NextResponse.json(response)

}