"use client";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

const AIResumeMatcher = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [jobDesc, setJobDesc] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<number>(0);
  const handleFileUpload = async (files: File[]) => {
    setFiles(files);
  };

  const nextStep = () => {
    if (step === 0) {
      setStep(1);
    } else {
      console.log(jobDesc);
      sendRequest();
    }
  };

  const sendRequest = async () => {
    if (files.length === 0) {
      console.log("No files selected");
      return;
    }


    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));
    formData.append("jobDesc", jobDesc);

    try {
      setLoading(true);
      const response = await fetch("/api/ai-resume-matcher", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      {" "}
      {step === 0 && (
        <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
          <FileUpload onChange={handleFileUpload} />
        </div>
      )}
      {step === 1 && (
        <div>
          <Label className="font-semibold" htmlFor="job-desc">
            Job Description
          </Label>
          <p className="text-sm text-muted-foreground">
            Paste a job description
          </p>
          <Textarea
            onChange={(e) => setJobDesc(e.target.value)}
            value={jobDesc}
            className="min-h-40"
            placeholder="Type your message here."
            id="job-desc"
          />
        </div>
      )}
      <div className="justify-self-center justify-center itens-center my-3">
        {" "}
        {files && files.length > 0 && (
          <Button disabled={loading} onClick={nextStep}>
            {loading ? "Loading..." : step === 0 ? "Next" : "Submit"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AIResumeMatcher;
