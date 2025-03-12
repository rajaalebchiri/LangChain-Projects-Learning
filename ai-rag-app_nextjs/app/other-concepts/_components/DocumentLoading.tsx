"use client";

import { FileUpload } from "@/components/ui/file-upload";
import React, { useState } from "react";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const DocumentLoading = () => {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = async (files: File[]) => {
    setFiles(files);
    console.log(files);
    const loader = new PDFLoader(files[0], {
      splitPages: false,
    });

      const docs = await loader.load();
      console.log(docs)
  };
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-blue-900">
        Document Loader & Explorer
      </h1>
      <p>
        A versatile document processing tool that allows users to upload and
        extract content from various file types, including CSV, PDF, Markdown,
        HTML, and entire directories. The system automatically detects the file
        format, processes the data using LangChain document loaders, and
        displays the extracted content in a structured format.
      </p>
      <div>
        <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
          <FileUpload onChange={handleFileUpload} />
        </div>
      </div>
      <hr />
      <h3 className="text-xl font-semibold text-blue-900">Concepts</h3>
      <ul>
        <li>CSV Loader</li>
        <li>Directory Loader</li>
        <li>PDF Loader</li>
        <li>Custom Loader</li>
        <li>Markdown Loader</li>
        <li>HTML Loader</li>
      </ul>
    </div>
  );
};

export default DocumentLoading;
