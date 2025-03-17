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
        //setResult(data);
      });
    setResult({
      prompt: formData.context,
      details: formData.goal,
      techniques: formData.techniques,
    });
  };
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
