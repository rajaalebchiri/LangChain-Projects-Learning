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
