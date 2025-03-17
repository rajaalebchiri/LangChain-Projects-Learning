import { promises as fs } from 'fs'; // To save the file temporarily
import { v4 as uuidv4 } from 'uuid'; // To gen
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    const formData: FormData = await req.formData();
    const uploadedFiles = formData.getAll('file');
    const job = formData.get('jobDesc')
    let fileName = '';

    if (uploadedFiles && uploadedFiles.length > 0) {
        const uploadedFile = uploadedFiles[0];

        // Check if uploadedFile is of type File
        // Generate a unique filename
        fileName = uuidv4();
        const tempFilePath = `/tmp/${fileName}.pdf`;
        const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

        await fs.writeFile(tempFilePath, fileBuffer);


        const loader = new PDFLoader(tempFilePath, {
            splitPages: false,
        });

        const documents = await loader.load();


        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const allSplits = await textSplitter.splitDocuments(documents);

        const jobDocuments = [
            new Document({
                pageContent:
                    job as string || "content",
                metadata: { source: "mammal-pets-doc" },
            })
        ]

        const jobDescSplit = await textSplitter.splitDocuments(jobDocuments);


        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-large",
            apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
        });


        const vectorStoreJob = new MemoryVectorStore(embeddings);

        await vectorStoreJob.addDocuments(jobDescSplit)


        let totalScore = 0;
        const matchResults = await Promise.all(
            allSplits.map(async (chunk) => {
                const embedding = await embeddings.embedQuery(chunk.pageContent);
                const results = await vectorStoreJob.similaritySearchVectorWithScore(embedding, 3);

                // Get best match score (1 means no similarity, lower is better)
                const bestScore = results.length > 0 ? results[0][1] : 1;
                const matchPercentage = (1 - bestScore) * 100;

                totalScore += matchPercentage; // Accumulate for average calculation

                return {
                    pageContent: chunk.pageContent.substring(0, 100) + "...",
                    rawScore: bestScore,
                    matchPercentage: matchPercentage.toFixed(2),
                };
            })
        );

        // Calculate the overall match score
        const overallScore = matchResults.length > 0
            ? totalScore / matchResults.length
            : 0;

        // Extract keywords from job description (simple approach)
        const extractedKeywords = extractKeywords(job);

        // Cleanup temp file
        await fs.unlink(tempFilePath);

        // Return formatted response
        return NextResponse.json({
            overallScore: overallScore.toFixed(2),
            keywords: extractedKeywords,
            scores: matchResults
        });



    } else {
        console.log('No files found.');
    }
}

function extractKeywords(text: string, minFrequency: number = 3): string[] {
    const words = text.toLowerCase().match(/\b[a-zA-Z]+\b/g) || [];

    const stopWords = new Set([
        "the", "and", "is", "in", "on", "for", "to", "of", "a", "with", "as", "at",
        "an", "by", "or", "that", "this", "it", "from", "be", "are", "was", "were",
        "you", "your", "we", "our", "they", "their", "he", "she", "his", "her",
        "not", "but", "if", "so", "then", "can", "will", "do", "does", "did", "has", "have",
        "more", "many", "some", "most", "much", "such", "like", "just", "even",
        "one", "two", "three", "every", "any", "all", "each", "which", "who", "whom",
        "there", "here", "out", "about", "up", "down", "over", "under", "again",
        "always", "never", "often", "sometimes", "soon", "late",
        "new", "old", "same", "other", "another",
        "good", "better", "best", "strong", "hard", "easy", "fast", "slow",
        "team", "group", "people", "company", "organization",
        "experience", "years", "months", "time", "work", "job", "role",
        "skills", "ability", "knowledge", "expertise",
        "join", "apply", "want", "looking", "seeking"
    ]);

    const keywordCounts: Record<string, number> = {};

    words.forEach(word => {
        if (!stopWords.has(word) && word.length > 2) {  // Ignore stopwords and very short words
            keywordCounts[word] = (keywordCounts[word] || 0) + 1;
        }
    });

    return Object.entries(keywordCounts)
        .filter(([_, count]) => count >= minFrequency) // Keep only repeated keywords
        .sort((a, b) => b[1] - a[1]) // Sort by highest frequency
        .map(([word]) => word);
}
