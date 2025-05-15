'use server';

/**
 * @fileOverview A code generation AI agent using Together AI.
 *
 * - generateCode - A function that handles the code generation process.
 * - GenerateCodeInput - The input type for the generateCode function.
 * - GenerateCodeOutput - The return type for the generateCode function.
 */

import {ai} from '@/ai/genkit';
import {z}from 'genkit';
import Together from "together-ai";

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

const GenerateCodeInputSchema = z.object({
  programmingLanguage: z.string().describe('The programming language for which code should be generated.'),
  taskDescription: z.string().describe('The description of the coding task.'),
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const GenerateCodeOutputSchema = z.object({
  generatedCode: z.string().describe('The generated code snippet.'),
  explanation: z.string().optional().describe('Explanation of the generated code.'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const exampleOutputFormat = {
  generatedCode: "Your generated code here...",
  explanation: "A brief explanation of the code."
};

const generateCodeFlow = ai.defineFlow(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async (input: GenerateCodeInput): Promise<GenerateCodeOutput> => {
    if (!process.env.TOGETHER_API_KEY) {
      throw new Error("TOGETHER_API_KEY is not set in the environment variables. Please add it to your .env file.");
    }
    try {
      const systemPrompt = `You are an expert software developer.
You will generate code based on the provided task description and programming language.
Your response MUST be a valid JSON object. Ensure your output strictly adheres to the following JSON structure:
\`\`\`json
${JSON.stringify(exampleOutputFormat, null, 2)}
\`\`\`
If you cannot fulfill the request or it's unclear, respond with an error message within the JSON structure's "explanation" field and empty "generatedCode".`;

      const userPrompt = `Task Description: ${input.taskDescription}\nProgramming Language: ${input.programmingLanguage}`;

      const completion = await together.chat.completions.create({
        model: "Qwen/Qwen3-235B-A22B-fp8-tput", // Using the same capable model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 1,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0].message?.content;
      if (!content) {
        throw new Error("Together AI returned an empty response.");
      }
      
      let parsedOutput;
      try {
          parsedOutput = JSON.parse(content);
      } catch (e) {
          console.error("Failed to parse Together AI JSON response:", content, e);
          // Attempt to extract JSON from a potentially markdown-wrapped response
          const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
          if (jsonMatch && jsonMatch[1]) {
            try {
              parsedOutput = JSON.parse(jsonMatch[1]);
            } catch (e2) {
              console.error("Failed to parse extracted JSON from Together AI response:", jsonMatch[1], e2);
              throw new Error("Together AI response was not valid JSON, even after attempting to extract from markdown.");
            }
          } else {
            throw new Error("Together AI response was not valid JSON. Ensure the model outputs strictly JSON.");
          }
      }
      
      return GenerateCodeOutputSchema.parse(parsedOutput);

    } catch (error) {
      console.error("Together AI API call failed:", error);
      throw error; 
    }
  }
);
