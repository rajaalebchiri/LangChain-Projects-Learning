import MaterialsGenerator from "@/components/MaterialsGenerator";
import React from "react";

const AIStudyBuddy = () => {
  return (
    <main>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <h1 className="text-2xl">
            📚 AI Study Buddy – Learn Smarter, Not Harder! 🚀
          </h1>
          <p>
            Struggling to find the best study materials? AI Study Buddy
            retrieves, summarizes, and simplifies learning for you.
          </p>
          <p>
            {" "}
            Enter a topic, and let AI find and summarize the best study
            materials for you.{" "}
          </p>
          <MaterialsGenerator />
        </main>
      </div>
    </main>
  );
};

export default AIStudyBuddy;
