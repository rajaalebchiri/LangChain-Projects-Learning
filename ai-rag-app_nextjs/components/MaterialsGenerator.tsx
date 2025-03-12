"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SparklesIcon, Terminal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { Badge } from "./ui/badge";

interface StudyMaterial {
  title: string;
  url: string;
  type: "article" | "video" | "book" | "course" | "pdf";
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface KeyConcept {
  concept: string;
  description: string;
}

interface SourceCitation {
  title: string;
  author?: string;
  year?: number;
  url?: string;
  type: "academic" | "website" | "book" | "journal";
}

interface RoadmapData {
  key_summary: string;
  study_materials: StudyMaterial[];
  key_concepts: KeyConcept[];
  sources_citations: SourceCitation[];
}

function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

const MaterialsGenerator = () => {
  const [request, setRequest] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const [roadmap, setRoadmap] = useState<RoadmapData>();
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    try {
      setLoading(true);
      fetch("/api/retrieve-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: request,
          type: type,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setRoadmap(data || {});
          setLoading(false);
        });
      
    } catch (error) {
      console.log(error);
      setError("something wrong");
    }
  };
console.log(loading)
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
            <SelectValue placeholder="Select a type *" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select</SelectLabel>
              <SelectItem value="no-preference">No Preference</SelectItem>
              <SelectItem value="articles">Articles</SelectItem>
              <SelectItem value="videos">Videos</SelectItem>
              <SelectItem value="books/pdfs">Books/PDFS</SelectItem>
              <SelectItem value="research-papers">Research Papers</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={() => sendRequest()}>Try AI Study Buddy Today!</Button>
      <p>{loading}</p>
      <div>
        {loading && <SkeletonDemo/>}
        {roadmap && (
          <div>
            <Separator className="my-4" />
            <h3 className="text-2xl flex gap-3">
              <span>Your Learning Roadmap is Ready</span>{" "}
              <SparklesIcon className="place-self-center text-yellow-500" />
            </h3>
            <p>{roadmap?.key_summary || ""}</p>
            <Separator className="my-2" />
            <div className="">
              <p className="text-xl">Study Materials</p>
              {roadmap?.study_materials.map((material, index) => (
                <div className="flex gap-3 my-2" key={index}>
                  <Link
                    className="text-blue-700 font-semibold"
                    href={material.url}
                  >
                    {material.title}
                  </Link>
                  <Badge>{material.difficulty}</Badge>
                  <Badge variant="outline">{material.type}</Badge>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="">
              <p className="text-xl mb-4">Concepts</p>
              {roadmap?.key_concepts.map((concept, index) => (
                <div className="" key={index}>
                  <p className="font-semibold">{concept.concept}</p>
                  <p className="mb-2">{concept.description}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="">
              <p className="text-xl mb-4">Citations</p>
              {roadmap?.sources_citations.map((citation, index) => (
                <div className="flex gap-3 my-2" key={index}>
                  <Link
                    className="text-blue-700 font-semibold"
                    href={citation.url || ""}
                  >
                    {citation.title}
                  </Link>
                  <p>{citation.author}</p>
                  <p>{citation.type}</p>
                  <p>{citation.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsGenerator;
