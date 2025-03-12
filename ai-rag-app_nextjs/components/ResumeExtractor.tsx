"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import * as pdfjsLib from "pdfjs-dist";
import { Resume } from "@/lib/resumeParsing";
import ResumeDisplay from "./ResumeDisplay";



// Set the worker source (must be done before calling `getDocument`)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
export function ResumeExtractor() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [informations, setInformations] = useState<Resume>();

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
  };

  const sendRequest = async () => {
    if (files.length === 0) {
      console.log("No files selected");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      setLoading(true);
      const response = await fetch("/api/resume-structured-data", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setInformations(data.result);
      console.log(data);
    } catch (error) {
      console.log("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
      <div className="flex justify-center mt-4">
        <button
          onClick={sendRequest}
          disabled={loading}
          className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
        >
          {loading ? "Uploading..." : "Start Extracting"}
        </button>
      </div>
      {informations && (
        <div>
          <h2 className="text-xl">Extracted Inforamtions</h2>
          <ResumeDisplay extractedData={informations} />
        </div>
      )}
    </div>
  );
}
