contains needed knowledge for generating good prompts

contains prompts engineering basics and frameworks

i used the learnprompting.org, and teh promptwarrior.com free resources for knowledge base creation


"use client";

import React, { useState } from "react";
import PromptForm from "./PromptForm";
import DisplayResult from "./DisplayResult";
import { Button } from "@/components/ui/button";

const PromptsGenerator = () => {
  const [formData, setFormData] = useState({
    goal: "",
    outputFormat: "I don't know",
    tone: "I don't know",
    role: "I don't know",
    context: "",
    constraints: "",
    examples: "",
    techniques: [] as string[],
  });

  const [result, setResult] = useState({
    title: "",
    prompt: "",
    details: "",
    techniques: [] as string[],
  });

  const generatePrompt = () => {
    console.log(formData);
    fetch("/api/ai-prompts-generator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setResult(data?.answer);
        setResult({
          title: data?.answer?.title,
          prompt: data?.answer?.prompt,
          details: data?.answer?.details,
          techniques: data?.answer?.techniques,
        });
      });
   
  };
  console.log(result)
  return (
    <div className="max-w-4xl mx-auto w-full">
      <PromptForm formData={formData} setformData={setFormData} />
      <Button
        className="my-4"
        disabled={!formData.goal}
        onClick={() => generatePrompt()}
      >
        Generate Prompt
      </Button>
      {result.prompt && <DisplayResult result={result} />}
    </div>
  );
};

export default PromptsGenerator;


import { Textarea } from "@/components/ui/textarea";
import React from "react";

type Props = {
  result: {
    title: string;
    prompt: string;
    details: string;
    techniques: string[];
  };
};

const DisplayResult = (props: Props) => {
  return (
    <div className="p-4 mb-20 mt-10 flex flex-col gap-4 border-gray-500 border rounded-lg">
      <div>
        <h3 className="text-xl font-semibold mb-2">{props.result.title}</h3>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Generated Prompt:</h3>
        <Textarea readOnly value={props.result.prompt} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Details:</h3>
        <p>{props.result.details}</p>
      </div>

      <div>
        {" "}
        <h3 className="text-lg font-semibold mt-4">Used Techniques:</h3>
        <ul className="list-disc pl-4">
          {props.result.techniques.map((technique, index) => (
            <li key={index}>{technique}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DisplayResult;


import { OpenAIEmbeddings } from "@langchain/openai";
import { NextResponse } from "next/server";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import path from "path";


export async function POST() {

    const filePath = path.join(process.cwd(), "public", "uploads", "knowledge_base.json");

    const loader = new JSONLoader(filePath);

    const docs = await loader.load();

    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-ada-002",
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const pinecone = new PineconeClient(
        { apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY || "", }
    );

    const pineconeIndex = pinecone.Index(process.env.NEXT_PUBLIC_PINECONE_INDEX!, process.env.NEXT_PUBLIC_HOST_PINECONE_URL!);

    const vectorStore = new PineconeStore(embeddings, {
        pineconeIndex,
        maxConcurrency: 5,
    });

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const allSplits = await splitter.splitDocuments(docs);
    
    await vectorStore.addDocuments(allSplits);


    return NextResponse.json({})

}



import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

type Props = {
  formData: {
    goal: string;
    outputFormat: string;
    tone: string;
    role: string;
    context: string;
    constraints: string;
    examples: string;
    techniques: string[];
  };
  setformData: React.Dispatch<
    React.SetStateAction<{
      goal: string;
      outputFormat: string;
      tone: string;
      role: string;
      context: string;
      constraints: string;
      examples: string;
      techniques: string[];
    }>
  >;
};

const outputFormats = [
  "I don't know",
  "Paragraph",
  "List",
  "Table",
  "JSON",
  "XML",
  "Code",
  "Email",
  "Bullet Points",
];
const tones = [
  "I don't know",
  "Formal",
  "Informal",
  "Persuasive",
  "Technical",
  "Creative",
  "Humorous",
  "Professional",
  "Academic",
  "Conversational",
];
const roles = [
  "I don't know",
  "Marketing expert",
  "Historian",
  "Chef",
  "Data analyst",
  "Software developer",
  "Teacher",
  "Lawyer",
  "Doctor",
  "Customer Service Representative",
];
const promptingTechniques = [
  "Instruction Prompting",
  "Role Prompting",
  "Zero-Shot Prompting",
  "One-Shot Prompting",
  "Few-Shot Prompting",
  "Combining Techniques",
  "Delimiters",
];

const PromptForm = ({ formData, setformData }: Props) => {
  const handleChange = (field: string, value: string | string[] | boolean) => {
    setformData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <label className="block font-medium">Prompt Goal/Task (Required)</label>
      <Input
        placeholder="Describe what the AI should do..."
        value={formData.goal}
        onChange={(e) => handleChange("goal", e.target.value)}
        required
      />

      <label className="block font-medium">
        Desired Output Format (Optional)
      </label>
      <Select onValueChange={(value) => handleChange("outputFormat", value)}>
        <SelectTrigger>
          <SelectValue placeholder={formData.outputFormat} />
        </SelectTrigger>
        <SelectContent>
          {outputFormats.map((format) => (
            <SelectItem key={format} value={format}>
              {format}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label className="block font-medium">Desired Tone/Style (Optional)</label>
      <Select onValueChange={(value) => handleChange("tone", value)}>
        <SelectTrigger>
          <SelectValue placeholder={formData.tone} />
        </SelectTrigger>
        <SelectContent>
          {tones.map((tone) => (
            <SelectItem key={tone} value={tone}>
              {tone}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label className="block font-medium">Role/Persona (Optional)</label>
      <Select onValueChange={(value) => handleChange("role", value)}>
        <SelectTrigger>
          <SelectValue placeholder={formData.role} />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label className="block font-medium">
        Context/Background Information (Optional)
      </label>
      <Textarea
        placeholder="Provide any relevant context..."
        value={formData.context}
        onChange={(e) => handleChange("context", e.target.value)}
      />

      <label className="block font-medium">
        Constraints/Limitations (Optional)
      </label>
      <Textarea
        placeholder="Specify constraints like word count, required keywords, etc."
        value={formData.constraints}
        onChange={(e) => handleChange("constraints", e.target.value)}
      />

      <label className="block font-medium">
        Examples (Few-Shot) (Optional)
      </label>
      <Textarea
        placeholder="Provide example outputs..."
        value={formData.examples}
        onChange={(e) => handleChange("examples", e.target.value)}
      />

      <label className="block font-medium">
        Prompting Techniques (Optional)
      </label>
      <div className="space-y-2">
        {promptingTechniques.map((technique) => (
          <div key={technique} className="flex items-center space-x-2">
            <Checkbox
              checked={formData.techniques.includes(technique)}
              onCheckedChange={(checked) =>
                handleChange(
                  "techniques",
                  checked
                    ? [...formData.techniques, technique]
                    : formData.techniques.filter((t) => t !== technique)
                )
              }
            />
            <label className="text-sm">{technique}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptForm;


import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { NextResponse } from "next/server";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { pull } from "langchain/hub";
import { PromptTemplate } from "@langchain/core/prompts";
import { Annotation } from "@langchain/langgraph";

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


import React from "react";
import PromptsGenerator from "./_components/PromptsGenerator";

const page = () => {
  return (
    <div className="max-w-2xl flex flex-col gap-5 items-center justify-center justify-self-center">
      <h2 className="text-xl font-semibold text-center">
        PromptCraft - Master the Art of Writing Prompts
      </h2>
      <p className="text-center text-neutral-600">
        Generate unique writing prompts, learn proven frameworks, and craft your
        own compelling ideas.
      </p>
      <PromptsGenerator />
    </div>
  );
};

export default page;
