import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { NextResponse } from "next/server";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { pull } from "langchain/hub";
import { PromptTemplate } from "@langchain/core/prompts";

export async function POST(req: Request) {
    
    const llm = new ChatOpenAI({
        model: "gpt-4o-mini",
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        temperature: 0
    });

    const promptTemplate = PromptTemplate.fromTemplate(
        ` 
        You are an assistant for generating advanced prompts. Use the following pieces of retrieved context to create the question. If you don't know the prompt, use the retrieved information and the user inputs to generate an appropriate prompt. If the user includes "I don't know," provide a suitable choice and mention it at the end by rewriting all the inputs.
        Prompt Goal: {promptGoal}
        Desired Output Format: {desired_output_format}
        Desired Tone/Style: {desired_tone_style}
        Role/Persona: {role_persona}
        Context/Background Information: {context_background_information}
        Constraints/Limitations: {constraints_limitations}
        Examples: {examples}
        Prompting Techniques: {prompting_techniques}
        `
    );

    const example_prompt = await promptTemplate.invoke({
        promptGoal: "(context goes here)",
        desired_output_format: "(format goes here)",
        desired_tone_style: "(tone goes here)",
        role_persona: "(persona goes here)",
        context_background_information: "(context goes here)",
        constraints_limitations: "(constraints goes here)",
        examples: "(examples goes here)",
        prompting_techniques: "(prompting techniques goes here)",
    });

    const example_messages = example_prompt;

    
    console.log(example_messages)


    return NextResponse.json({})

}