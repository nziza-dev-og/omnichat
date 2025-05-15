'use server';
/**
 * @fileOverview Generates images using the Together AI API.
 *
 * - generateImage - A function that handles image generation.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import Together from 'together-ai';

const together = new Together({apiKey: process.env.TOGETHER_API_KEY});

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The prompt to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  b64Json: z
    .string()
    .describe(
      'The Base64 encoded JSON string of the generated image. Expected format: "data:image/png;base64,<encoded_data>"'
    ),
  promptUsed: z.string().describe('The prompt that was used for generation.')
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(
  input: GenerateImageInput
): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input: GenerateImageInput): Promise<GenerateImageOutput> => {
    if (!process.env.TOGETHER_API_KEY) {
      throw new Error(
        'TOGETHER_API_KEY is not set in the environment variables. Please add it to your .env file.'
      );
    }

    try {
      const response = await together.images.generate({
        model: 'black-forest-labs/FLUX.1-dev',
        prompt: input.prompt,
        steps: 20, // Defaulting to 20 steps, can be configured
        n: 1,      // Generating one image
      });

      if (!response.data || response.data.length === 0 || !response.data[0].b64_json) {
        throw new Error('Together AI did not return image data.');
      }
      
      // The API returns b64_json directly, which is the base64 string.
      // Prepend the data URI scheme for direct use in <img> tags or markdown.
      const imageDataUri = `data:image/png;base64,${response.data[0].b64_json}`;

      return {
        b64Json: imageDataUri,
        promptUsed: input.prompt,
      };
    } catch (error) {
      console.error('Together AI image generation failed:', error);
      throw error;
    }
  }
);
