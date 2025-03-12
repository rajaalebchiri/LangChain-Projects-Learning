import { parsePdf } from '@/lib/resumeParsing';
import { promises as fs } from 'fs'; // To save the file temporarily
import { v4 as uuidv4 } from 'uuid'; // To gen
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from "langchain/vectorstores/memory";


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

        const jobDescSplit = await textSplitter.splitText(job);


        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-large",
            apiKey: ""
        });

        const vectorStoreResume = new MemoryVectorStore(embeddings);

        await vectorStoreResume.addDocuments(
            allSplits
        );

        const vectorStoreJob = new MemoryVectorStore(embeddings);

        await vectorStoreJob.addVectors

        // Extracting key skills & responsibilities from the job description


        // Expanding the query to include synonyms, related terms, and variations
        // Using an LLM - based reranking approach to refine the final matches


    } else {
        console.log('No files found.');
    }
}