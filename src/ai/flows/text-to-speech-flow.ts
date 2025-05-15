
'use server';
/**
 * @fileOverview Converts text to speech using the ElevenLabs API.
 *
 * - textToSpeech - A function that handles text-to-speech conversion.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ElevenLabsClient } from 'elevenlabs';

const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
let elevenLabsClient: ElevenLabsClient | null = null;

if (elevenLabsApiKey) {
  elevenLabsClient = new ElevenLabsClient({
    apiKey: elevenLabsApiKey,
  });
}

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  voiceId: z
    .string()
    .optional()
    .default('21m00Tcm4TlvDq8ikWAM') // Default voice ID (e.g., "Rachel" by ElevenLabs)
    .describe('The ElevenLabs voice ID to use.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'The generated audio as a base64 data URI (e.g., "data:audio/mpeg;base64,..."). Returns empty if TTS is disabled or text is empty.'
    ),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

async function streamToBuffer(
  stream: ReadableStream<Uint8Array>
): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text, voiceId }) => {
    if (!elevenLabsClient) {
      console.warn('ElevenLabs API key not configured. Skipping TTS.');
      return { audioDataUri: '' };
    }
    if (!text.trim()) {
      console.warn('Empty text provided for TTS. Skipping.');
      return { audioDataUri: '' };
    }

    try {
      const audioStream = await elevenLabsClient.textToSpeech.convert(
        voiceId || '21m00Tcm4TlvDq8ikWAM',
        {
          text: text,
          model_id: 'eleven_multilingual_v2', // A versatile model
        }
      );

      const audioBuffer = await streamToBuffer(
        audioStream as ReadableStream<Uint8Array>
      );
      const base64Audio = audioBuffer.toString('base64');
      const audioDataUri = `data:audio/mpeg;base64,${base64Audio}`;

      return { audioDataUri };
    } catch (error) {
      console.error('ElevenLabs API call failed:', error);
      throw new Error(
        `ElevenLabs API error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
