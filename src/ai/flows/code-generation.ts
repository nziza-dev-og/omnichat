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

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const generateCodePrompt = ai.definePrompt({
  name: 'generateCodePrompt',
  input: {schema: GenerateCodeInputSchema},
  output: {schema: GenerateCodeOutputSchema},
  prompt: `You are an expert software developer.

You will generate code based on the provided task description and programming language.

Task Description: {{{taskDescription}}}
Programming Language: {{{programmingLanguage}}}

Generate the code and provide a brief explanation.

Output:
```
{
  "generatedCode": "",
  "explanation": ""
}
```
`,
});

const generateCodeFlow = ai.defineFlow(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async input => {
    const {output} = await generateCodePrompt(input);
    return output!;
  }
);
