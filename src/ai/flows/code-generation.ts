
// src/ai/flows/code-generation.ts
'use server';

/**
 * @fileOverview A code generation AI agent using OpenAI.
 *
 * - generateCode - A function that handles the code generation process.
 * - GenerateCodeInput - The input type for the generateCode function.
 * - GenerateCodeOutput - The return type for the generateCode function.
 */

import {ai} from '@/ai/genkit'; // Genkit's 'ai' object might still be used for defining schemas
import {z}from 'genkit';
import OpenAI from "openai";

const GenerateCodeInputSchema = z.object({
  programmingLanguage: z.string().describe('The programming language for which code should be generated.'),
  taskDescription: z.string().describe('The description of the coding task.'),
  // modelType will effectively only be 'OpenAI' as DeepInfra/Genkit model option is removed
  modelType: z.enum(['OpenAI', 'DeepInfra']).describe('The type of model to use for code generation.'),
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const GenerateCodeOutputSchema = z.object({
  generatedCode: z.string().describe('The generated code snippet.'),
  explanation: z.string().optional().describe('Explanation of the generated code.'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    if (input.modelType === 'OpenAI') {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not set in the environment variables. Please add it to your .env file.");
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

        const completion = await openai.chat.completions.create({
          model: "gpt-4-turbo", 
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1,
          response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) {
          throw new Error("OpenAI returned an empty response.");
        }
        
        let parsedOutput;
        try {
            parsedOutput = JSON.parse(content);
        } catch (e) {
            console.error("Failed to parse OpenAI JSON response:", content, e);
            throw new Error("OpenAI response was not valid JSON. Ensure the model outputs strictly JSON.");
        }
        
        return GenerateCodeOutputSchema.parse(parsedOutput);

      } catch (error) {
        console.error("OpenAI API call failed:", error);
        throw error; 
      }
    } else {
      // This path should ideally not be reached if UI is updated correctly.
      throw new Error(`Unsupported modelType: ${input.modelType}. Only 'OpenAI' is configured.`);
    }
  }
);
