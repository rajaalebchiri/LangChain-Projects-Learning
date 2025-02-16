"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const MaterialsGenerator = () => {
  const [request, setRequest] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");

  const sendRequest = async () => {
    try {
      const response = fetch("/api/retrieve-response", {
        method: "POST",
        body: JSON.stringify({
          message: request,
          type: type,
        }),
      });
      console.log(response);
    } catch (error) {
      console.log(error);
      setError("something wrong");
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center sm:items-start w-full">
      {error && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>OOps Error !!!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="w-full">
        <Label>🔍 What do you want to learn today?</Label>
        <Input
          onChange={(e) => setRequest(e.target.value)}
          value={request}
          placeholder="📚 Example: Quantum Mechanics basics or History of AI"
        />
      </div>
      <div className="w-full">
        <Label>Select Type of Materials</Label>
        <Select onValueChange={setType} value={type}>
          <SelectTrigger>
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select</SelectLabel>
              <SelectItem value="articles">Articles</SelectItem>
              <SelectItem value="videos">Videos</SelectItem>
              <SelectItem value="books/pdfs">Books/PDFS</SelectItem>
              <SelectItem value="research papers">Research Papers</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={() => sendRequest()}>Try AI Study Buddy Today!</Button>
    </div>
  );
};

export default MaterialsGenerator;
