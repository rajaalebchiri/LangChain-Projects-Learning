import React from "react";
import AIResumeMatcher from "./_components/AIResumeMatcher";

const AIResumePage = () => {
  return (
    <div className="max-w-2xl flex flex-col gap-5 items-center justify-center justify-self-center">
      <h2 className="text-xl font-semibold text-center">AI Resume Matcher</h2>
      <p className="text-center text-neutral-600">
        A tool that helps job seekers match their resumes to job descriptions
        using semantic search.
      </p>
      <AIResumeMatcher />
    </div>
  );
};

export default AIResumePage;
