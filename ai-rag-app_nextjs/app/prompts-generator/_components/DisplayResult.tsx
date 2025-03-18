import { Textarea } from "@/components/ui/textarea";
import React from "react";

type Props = {
  result: {
    title: string;
    prompt: string;
    details: string;
    techniques: string[];
  };
};

const DisplayResult = (props: Props) => {
  return (
    <div className="p-4 mb-20 mt-10 flex flex-col gap-4 border-gray-500 border rounded-lg">
      <div>
        <h3 className="text-xl font-semibold mb-2">{props.result.title}</h3>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Generated Prompt:</h3>
        <Textarea readOnly value={props.result.prompt} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Details:</h3>
        <p>{props.result.details}</p>
      </div>

      <div>
        {" "}
        <h3 className="text-lg font-semibold mt-4">Used Techniques:</h3>
        <ul className="list-disc pl-4">
          {props.result.techniques.map((technique, index) => (
            <li key={index}>{technique}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DisplayResult;
