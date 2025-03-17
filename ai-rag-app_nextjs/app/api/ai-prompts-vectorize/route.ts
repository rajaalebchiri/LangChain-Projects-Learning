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