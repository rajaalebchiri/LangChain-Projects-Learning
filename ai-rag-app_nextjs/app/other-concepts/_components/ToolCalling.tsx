"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { displayingBio } from "@/lib/langchain_tools";
import { HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import Link from "next/link";
import React, { useState } from "react";

const ToolCalling = () => {
  const [introduction, setIntroduction] = useState("");
  const [bio, setBio] = useState("");
  const generateBio = async () => {
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
      apiKey: "",
    });

    const llmWithTools = llm.bindTools([displayingBio]);

    //const res = await llmWithTools.invoke("generate a bio from my introduction " + introduction);

    const messages = [
      new HumanMessage(
        "generate a bio from my introduction" +
          introduction +
          "generate only the bio no extra text"
      ),
    ];

    const aiMessage = await llmWithTools.invoke(messages);

    messages.push(aiMessage);

    for (const toolCall of aiMessage.tool_calls) {
      const selectedTool = displayingBio;
      const toolMessage = await selectedTool.invoke(toolCall);
      messages.push(toolMessage);
    }

    const resp = await llmWithTools.invoke(messages);

    console.log(resp);

    setBio(resp?.content || "");
  };
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-blue-900">
        Tool Calling
      </h1>
      <p>
        Building a small tool and integrating it with AI to extract information
        from introductions and generate a brief bio in a specific template.
      </p>
      <Textarea
        value={introduction}
        onChange={(e) => setIntroduction(e.target.value)}
        placeholder="Introduce yourself."
      />
      <Button onClick={generateBio}>Generate Bio</Button>
      {bio && (
        <div>
          <h3 className="text-lg font-semibold mt-4">Bio</h3>
          <p>{bio}</p>
        </div>
      )}

      <hr />

      <p className="mt-4">Used Docs</p>

      <Link
        className="text-blue-600"
        href="https://js.langchain.com/docs/how_to/tool_calling/"
      >
        How to use chat models to call tools
      </Link>
      <Link
        className="text-blue-600"
        href="https://js.langchain.com/docs/how_to/tool_results_pass_to_model/"
      >
        How to pass tool outputs to chat models
      </Link>
      <Link
        className="text-blue-600"
        href={"https://js.langchain.com/docs/concepts/tool_calling/"}
      >
        Tool calling
      </Link>
    </div>
  );
};

export default ToolCalling;
