import { HoverEffect } from "./ui/card-hover-effect";

export function HomeCards() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
  {
    title: "Simple Langchain app: AI Study Buddy",
    description:
      "A technology company that builds economic infrastructure for the internet.",
    link: "/ai-study-buddy",
  },
  {
    title: "Return Structured Data: Resume Data Extractor",
    description:
      "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
    link: "/resume-data-extractor",
  },
  {
    title: "Code Generation and Execution",
    description: "Generate Code and execute it using external tool",
    link: "/code-generation-execution",
  },
  {
    title: "Other Concepts",
    description: "Testing Multiple Concepts with tiny features",
    link: "/other-concepts",
  },
  {
    title: "AI-Powered Resume Matcher",
    description:
      "A tool that helps job seekers match their resumes to job descriptions using semantic search.",
    link: "/ai-resume-matcher",
  },
  {
    title: "Generate unique writing prompts with PromptCraft",
    description:
      "Generate unique writing prompts, learn proven frameworks, and craft your own compelling ideas.",
    link: "/prompts-generator",
  },
];
