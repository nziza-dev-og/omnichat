'use server';

/**
 * @fileOverview Allows the user to select an LLM from a list of available models via the DeepInfra API.
 *
 * - selectLLM - A function that allows the user to select an LLM.
 * - SelectLLMInput - The input type for the selectLLM function.
 * - SelectLLMOutput - The return type for the selectLLM function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SelectLLMInputSchema = z.object({
  modelName: z.string().describe('The name of the LLM to select.'),
});
export type SelectLLMInput = z.infer<typeof SelectLLMInputSchema>;

const SelectLLMOutputSchema = z.object({
  selectedModel: z.string().describe('The name of the selected LLM.'),
});
export type SelectLLMOutput = z.infer<typeof SelectLLMOutputSchema>;

export async function selectLLM(input: SelectLLMInput): Promise<SelectLLMOutput> {
  return selectLLMFlow(input);
}

const selectLLMPrompt = ai.definePrompt({
  name: 'selectLLMPrompt',
  input: {schema: SelectLLMInputSchema},
  output: {schema: SelectLLMOutputSchema},
  prompt: `You are an AI assistant helping the user select an LLM.

The user has requested to use the following model: {{{modelName}}}

Please confirm the selected model.
`,
});

const selectLLMFlow = ai.defineFlow(
  {
    name: 'selectLLMFlow',
    inputSchema: SelectLLMInputSchema,
    outputSchema: SelectLLMOutputSchema,
  },
  async input => {
    const {output} = await selectLLMPrompt(input);
    return output!;
  }
);
