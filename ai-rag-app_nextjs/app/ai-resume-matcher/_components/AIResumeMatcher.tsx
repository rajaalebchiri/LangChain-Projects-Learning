"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

const AIResumeMatcher = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [jobDesc, setJobDesc] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [scores, setScores] = useState<
    { pageContent: string; matchPercentage: number }[]
  >([]);
  const [step, setStep] = useState<number>(0);
  const handleFileUpload = async (files: File[]) => {
    setFiles(files);
  };

  const nextStep = () => {
    if (step === 0) {
      setStep(1);
    } else {
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
      // Update state with the new data
      setScores(data.scores || []);
      setOverallScore(data.overallScore || 0);
      setKeywords(data.keywords || []);
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
        {/* Display Overall Score */}
        {overallScore !== null && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold">Overall Match Score</h2>
            <Progress value={overallScore} className="mt-2" />
            <p className="text-gray-700 mt-1">{overallScore}%</p>
          </div>
        )}
        {/* Display Extracted Keywords */}
        {keywords.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold">Important and repeated Keywords</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {keywords.map((word, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-3 py-1 rounded-md text-sm"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Display Individual Scores */}
        {scores.length > 0 && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-bold">Matching Details</h2>
            {scores.map((score, index) => (
              <Card key={index} className="border border-gray-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Match:{" "}
                    <span className="text-green-600">
                      {score.matchPercentage}%
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{score.pageContent}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIResumeMatcher;
