# Learn LangChain By Building Projects (Working on it)

Code for building ToolLLM with LangGraph.js

Building LLM APP with js and openai

projects are under ai-rag-app

---

## langchain concepts

- Chat Model
LangChain provides a consistent interface for working with chat models from different providers while offering additional features for monitoring, debugging, and optimizing the performance of applications that use LLMs.

- Tool calling 
it enables the ai to interact with external services, APIs, and databases. it also extracts sturctured information from unstructured data and perform various other tasks.

- Structured output
it returns the response in a stuctured format, such as JSON to match a given schema

- Multimodality
work with multiple types of data: text, images, audio, and video


---

## AI-Powered Personalized Learning Assistant

Building AI RAG Application with LangChain & Next.js

Helps students & professionals retrieve relevant learning materials

👉 Use Case: A student inputs a topic, and the AI retrieves and summarizes the most relevant study materials from online sources, books, or PDFs.

* **User Input:**
    * Topic input: `User Input` -> `AI Processing`
    * Material type selection: `User Selection` -> `AI Filtering`
* **AI Processing:**
    * Uses LangChain and OpenAI (gpt-4o-mini) to:
        * Summarize the topic.
        * Generate a list of relevant study materials.
        * Identify key concepts.
        * Provide source citations.
* **Output:**
    * `AI Response (JSON)` -> `Roadmap Display`
    * Displays:
        * Summary
        * Study materials (title, URL, difficulty, type).
        * Key concepts (concept, description).
        * Source citations (title, author, year, URL, type).
* **Components:**
    * `MaterialsGenerator` (React component)
    * `/api/retrieve-response` (Next.js API route)
    * `LearningMaterialSchema` (Zod schema)

<div align="center">
  <img src="demo/demo.png" width="800" alt="Workflow Diagram"/>
</div>

<div align="center">
  <img src="demo/demo2.png" width="800" alt="Workflow Diagram"/>
</div>

---

## Resume Extractor Feature

This feature extracts structured data from uploaded resume PDFs.

* **File Upload:**
    * `User Uploads PDF` -> `FormData`
* **PDF Processing:**
    * `FormData` -> `/api/resume-structured-data` (Next.js API)
    * API:
        * Saves PDF temporarily.
        * Parses PDF text using `pdfjs-dist`.
        * `Parsed Text` -> `LangChain/OpenAI (gpt-4o-mini)`
        * Uses `ChatPromptTemplate` and `JsonOutputParser` to extract structured data based on a defined schema.
        * `AI Response (JSON)` -> `Structured Data`
* **Data Display:**
    * `Structured Data` -> `ResumeDisplay` (React component)
    * Displays extracted information in a structured card format:
        * Personal information (name, email, etc.).
        * Summary.
        * Skills.
        * Experience.
        * Education.
        * Certifications, projects, awards, etc.
* **Components:**
    * `ResumeExtractor` (React component, file upload and request).
    * `ResumeDisplay` (React component, data visualization).
    * `/api/resume-structured-data` (Next.js API route, PDF parsing and AI processing).
    * `Resume` (TypeScript interface).
    * `FileUpload` (UI component). 


<div align="center">
  <img src="demo/resume_demo.png" width="800" alt="Workflow Diagram"/>
</div>

<div align="center">
  <img src="demo/resume_demo_2.png" width="800" alt="Workflow Diagram"/>
</div>

<div align="center">
  <img src="demo/resume_demo_3.png" width="800" alt="Workflow Diagram"/>
</div>