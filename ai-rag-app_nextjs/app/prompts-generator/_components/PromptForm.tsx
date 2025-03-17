import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

type Props = {
  formData: {
    goal: string;
    outputFormat: string;
    tone: string;
    role: string;
    context: string;
    constraints: string;
    examples: string;
    techniques: string[];
  };
  setformData: React.Dispatch<
    React.SetStateAction<{
      goal: string;
      outputFormat: string;
      tone: string;
      role: string;
      context: string;
      constraints: string;
      examples: string;
      techniques: string[];
    }>
  >;
};

const outputFormats = [
  "I don't know",
  "Paragraph",
  "List",
  "Table",
  "JSON",
  "XML",
  "Code",
  "Email",
  "Bullet Points",
];
const tones = [
  "I don't know",
  "Formal",
  "Informal",
  "Persuasive",
  "Technical",
  "Creative",
  "Humorous",
  "Professional",
  "Academic",
  "Conversational",
];
const roles = [
  "I don't know",
  "Marketing expert",
  "Historian",
  "Chef",
  "Data analyst",
  "Software developer",
  "Teacher",
  "Lawyer",
  "Doctor",
  "Customer Service Representative",
];
const promptingTechniques = [
  "Instruction Prompting",
  "Role Prompting",
  "Zero-Shot Prompting",
  "One-Shot Prompting",
  "Few-Shot Prompting",
  "Combining Techniques",
  "Delimiters",
];

const PromptForm = ({ formData, setformData }: Props) => {
  const handleChange = (field: string, value: string | string[] | boolean) => {
    setformData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <label className="block font-medium">Prompt Goal/Task (Required)</label>
      <Input
        placeholder="Describe what the AI should do..."
        value={formData.goal}
        onChange={(e) => handleChange("goal", e.target.value)}
        required
      />

      <label className="block font-medium">
        Desired Output Format (Optional)
      </label>
      <Select onValueChange={(value) => handleChange("outputFormat", value)}>
        <SelectTrigger>
          <SelectValue placeholder={formData.outputFormat} />
        </SelectTrigger>
        <SelectContent>
          {outputFormats.map((format) => (
            <SelectItem key={format} value={format}>
              {format}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label className="block font-medium">Desired Tone/Style (Optional)</label>
      <Select onValueChange={(value) => handleChange("tone", value)}>
        <SelectTrigger>
          <SelectValue placeholder={formData.tone} />
        </SelectTrigger>
        <SelectContent>
          {tones.map((tone) => (
            <SelectItem key={tone} value={tone}>
              {tone}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label className="block font-medium">Role/Persona (Optional)</label>
      <Select onValueChange={(value) => handleChange("role", value)}>
        <SelectTrigger>
          <SelectValue placeholder={formData.role} />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label className="block font-medium">
        Context/Background Information (Optional)
      </label>
      <Textarea
        placeholder="Provide any relevant context..."
        value={formData.context}
        onChange={(e) => handleChange("context", e.target.value)}
      />

      <label className="block font-medium">
        Constraints/Limitations (Optional)
      </label>
      <Textarea
        placeholder="Specify constraints like word count, required keywords, etc."
        value={formData.constraints}
        onChange={(e) => handleChange("constraints", e.target.value)}
      />

      <label className="block font-medium">
        Examples (Few-Shot) (Optional)
      </label>
      <Textarea
        placeholder="Provide example outputs..."
        value={formData.examples}
        onChange={(e) => handleChange("examples", e.target.value)}
      />

      <label className="block font-medium">
        Prompting Techniques (Optional)
      </label>
      <div className="space-y-2">
        {promptingTechniques.map((technique) => (
          <div key={technique} className="flex items-center space-x-2">
            <Checkbox
              checked={formData.techniques.includes(technique)}
              onCheckedChange={(checked) =>
                handleChange(
                  "techniques",
                  checked
                    ? [...formData.techniques, technique]
                    : formData.techniques.filter((t) => t !== technique)
                )
              }
            />
            <label className="text-sm">{technique}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptForm;
