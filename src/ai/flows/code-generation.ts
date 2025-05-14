
// src/ai/flows/code-generation.ts
'use server';

/**
 * @fileOverview A code generation AI agent.
 *
 * - generateCode - A function that handles the code generation process.
 * - GenerateCodeInput - The input type for the generateCode function.
 * - GenerateCodeOutput - The return type for the generateCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import OpenAI from "openai";

const GenerateCodeInputSchema = z.object({
  programmingLanguage: z.string().describe('The programming language for which code should be generated.'),
  taskDescription: z.string().describe('The description of the coding task.'),
  modelType: z.enum(['OpenAI', 'DeepInfra']).describe('The type of model to use for code generation (OpenAI or DeepInfra).'),
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const GenerateCodeOutputSchema = z.object({
  generatedCode: z.string().describe('The generated code snippet.'),
  explanation: z.string().optional().describe('Explanation of the generated code.'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

// Initialize OpenAI client
// Ensure OPENAI_API_KEY is in your .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // The 'openai' SDK will automatically use this env var if apiKey is not set or undefined.
});

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const exampleOutputFormat = {
  generatedCode: "Your generated code here...",
  explanation: "A brief explanation of the code."
};

// This Genkit prompt will be used if modelType is 'DeepInfra'
const genkitGenerateCodePrompt = ai.definePrompt({
  name: 'genkitGenerateCodePrompt',
  input: {schema: GenerateCodeInputSchema}, // It's fine that modelType is part of input, prompt doesn't use it
  output: {schema: GenerateCodeOutputSchema},
  prompt: `You are an expert software developer.

You will generate code based on the provided task description and programming language.

Task Description: {{{taskDescription}}}
Programming Language: {{{programmingLanguage}}}

Generate the code and provide a brief explanation, ensuring your output is a valid JSON object matching the structure below.

Output:
\`\`\`json
${JSON.stringify(exampleOutputFormat, null, 2)}
\`\`\`
`,
});

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
${JSON.stringify(exampleOutputFormat, null, 2)}`;

        const userPrompt = `Task Description: ${input.taskDescription}\nProgramming Language: ${input.programmingLanguage}`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4-turbo", // Using a capable model for code generation
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1,
          response_format: { type: "json_object" }, // Request JSON output
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
      // Fallback to Genkit prompt (e.g., for DeepInfra or other models configured via Genkit)
      const {output} = await genkitGenerateCodePrompt(input); 
      if (!output) {
        throw new Error("Genkit prompt returned no output for DeepInfra model.");
      }
      return output;
    }
  }
);

