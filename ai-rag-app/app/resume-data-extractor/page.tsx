import { ResumeExtractor } from "@/components/ResumeExtractor";
import React from "react";

const page = () => {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <h1 className="text-2xl">📚 Resume Data Extractor 🚀</h1>
          <p>
            Extract and display key details from uploaded resumes (e.g., name,
            email, work experience) in a structured format like JSON.
          </p>
          <p> Upload your resume to extract your informations</p>
          <ResumeExtractor />
        </main>
      </div>
    );
};

export default page;
