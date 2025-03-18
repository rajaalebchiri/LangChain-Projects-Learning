import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { NextResponse } from "next/server";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { PromptTemplate } from "@langchain/core/prompts";

export async function POST(req: Request) {

    const data = await req.json()


    const llm = new ChatOpenAI({
        model: "gpt-4o-mini",
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        temperature: 0
    });

    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-ada-002",
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const promptTemplate = PromptTemplate.fromTemplate(
        ` 
         You are an expert prompt engineer. Generate a highly detailed, structured, and optimized AI prompt using the retrieved information.

        Prompt Goal: {promptGoal}
        Desired Output Format: {desired_output_format}
        Desired Tone/Style: {desired_tone_style}
        Role/Persona: {role_persona}
        Context/Background Information: {context_background_information}
        Constraints/Limitations: {constraints_limitations}
        Examples: {examples}
        Prompting Techniques: {prompting_techniques}
        Knowledge to consider: {context}

        Your response must include detailed prompt instructions, a few examples, and a breakdown of why this prompt is effective.

        Return a structured JSON object:
        {{
            "title": "Brief title summarizing the prompt",
            "prompt": "Highly detailed and structured AI prompt",
            "details": "Explanation of how the prompt works",
            "techniques": ["List of advanced prompting techniques used"]
        }}
        `
    );

    const queryPromptTemplate = PromptTemplate.fromTemplate(`
        Given the following inputs, generate a concise and relevant search query for retrieving useful documents.

        Prompt Goal: {promptGoal}
        Desired Output Format: {desired_output_format}
        Desired Tone/Style: {desired_tone_style}
        Role/Persona: {role_persona}
        Context/Background Information: {context_background_information}
        Constraints/Limitations: {constraints_limitations}
        Examples: {examples}
        Prompting Techniques: {prompting_techniques}

        Search Query:
    `);

    // 🔹 Generate Search Query
    const generatedQuery = await queryPromptTemplate.invoke({
        promptGoal: data.goal || "General AI Assistance",
        desired_output_format: data.outputFormat || "Plain text",
        desired_tone_style: data.tone || "Neutral",
        role_persona: data.role || "AI Assistant",
        context_background_information: data.context || "No specific context.",
        constraints_limitations: data.constraints || "None",
        examples: data.examples || "No examples provided.",
        prompting_techniques: data.techniques || "Standard techniques.",
    });

    const pinecone = new PineconeClient({ apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY || "", });

    const pineconeIndex = pinecone.Index(process.env.NEXT_PUBLIC_PINECONE_INDEX!);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
        maxConcurrency: 5,
    });

    const retrievedDocs = await vectorStore.similaritySearch(generatedQuery.toString(), 6);

    const docsContent = retrievedDocs.map((doc) => doc.pageContent).join("\n");
 
    const messages = await promptTemplate.invoke({
        promptGoal: data.goal || "General AI Assistance",
        desired_output_format: data.outputFormat || "Plain text",
        desired_tone_style: data.tone || "Neutral",
        role_persona: data.role || "AI Assistant",
        context_background_information: data.context || "No specific context.",
        constraints_limitations: data.constraints || "None",
        examples: data.examples || "No examples provided.",
        prompting_techniques: data.techniques || "Standard techniques.",
        context: docsContent,
    });

    const answer = await llm.invoke(messages);

    console.log("Raw AI Response:", answer.content);

    console.log("Retrieved Documents:", retrievedDocs);


    // Remove possible backticks and JSON language specifier
    const cleanedContent = answer.content.replace(/```json|```/g, "").trim();

    // Parse the cleaned JSON string
    const parsedAnswer = JSON.parse(cleanedContent);

    return NextResponse.json({ success: true, answer: parsedAnswer });

}