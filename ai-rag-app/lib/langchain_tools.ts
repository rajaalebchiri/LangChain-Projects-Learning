import { tool } from "@langchain/core/tools";
import { z } from "zod";

const displayingBio = tool(({ name, age, profession }: { name: string; age: number; profession: string }): string => {
    console.log(name, age, profession)
    return `
    Meet ${name}, a passionate and dedicated professional in the field of ${profession}. 
    At just ${age} years old, ${name} has already made significant strides in their career, showing exceptional skill and commitment to their craft. 

    With a strong background in ${profession}, ${name} continues to strive for excellence, always eager to take on new challenges and expand their knowledge.

    In addition to their professional expertise, ${name} is also known for their drive, creativity, and positive attitude, making them a valuable asset in any project or team.
    
    Feel free to get in touch with ${name} to learn more about their work and achievements!
    `;
}, {
    name: "displayingBio",
    description: "displaying the user bio by extracting informations from intro and return the bio",
    schema: z.object({
        name: z.string(),
        age: z.number(),
        profession: z.string(),
    }),
})

export { displayingBio }