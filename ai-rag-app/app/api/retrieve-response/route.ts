import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

import { z } from "zod";

const learning_material = z.object({
    key_summary: z.string().describe("A short AI-generated explanation of the topic"),
    study_materials: z.string().describe("Links to relevant articles, PDFs, or books"),
    key_concepts: z.string().describe("Bullet points highlighting the main ideas"),
    sources_citations: z.string().describe("Verified references for deeper learning")
});

const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    apiKey: ""
});

const jokeQuery = "Tell me a joke.";
const formatInstructions =
    "Respond with a valid JSON object, containing two fields: 'setup' and 'punchline'.";


const prompt = new PromptTemplate({
    template: `You are a helpful assistant that suggest a learning materials and topics.

    Topic: {topic}
    Type of materials: {type_of_materials}

    Extract the director and main actors.  Return the output as a JSON object with keysrespond in JSON with key_summary, study_materials, key_concepts and sources_citations keys  and study materials and key conepts as arrays.
  `,
    inputVariables: ["topic", "type_of_materials"],
})

interface LearningPlan {
    key_summary: string;
    study_materials: string[];
    key_concepts: string[];
    sources_citations: string[];
}



const parser = new JsonOutputParser<LearningPlan>();

const chain = new LLMChain({ llm: llm, prompt: promptTemplate, outputParser: outputParser }); // Use the original prompt


const structuredLlm = model.withStructuredOutput(learning_material, { method: "json_mode", });



export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    const { message, type } = await req.json();

    console.log(message, type)

    // Request the OpenAI API for the response based on the prompt
    const response = await structuredLlm.invoke(message + " respond in JSON with `key_summary`, `study_materials`, `key_concepts` and `sources_citations` keys");

    console.log("response", response)

    return NextResponse.json(response)

}