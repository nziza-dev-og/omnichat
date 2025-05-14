'use server';
/**
 * @fileOverview Manages conversation context for the chatbot using OpenAI.
 *
 * - handleContext - A function that maintains and utilizes conversation context.
 * - HandleContextInput - The input type for the handleContext function.
 * - HandleContextOutput - The return type for the handleContext function.
 */

import {ai}from '@/ai/genkit'; // Genkit's 'ai' object might still be used for defining schemas or other utilities
import {z}from 'genkit';
import OpenAI from "openai";

// Initialize OpenAI client
// Ensure OPENAI_API_KEY is in your .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const HandleContextInputSchema = z.object({
  message: z.string().describe('The user message.'),
  conversationHistory: z.string().describe('The past conversation history.'),
});
export type HandleContextInput = z.infer<typeof HandleContextInputSchema>;

const HandleContextOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
  updatedConversationHistory: z
    .string()
    .describe('The updated conversation history including the latest message and response.'),
});
export type HandleContextOutput = z.infer<typeof HandleContextOutputSchema>;

export async function handleContext(input: HandleContextInput): Promise<HandleContextOutput> {
  return handleContextFlow(input);
}

// This flow now directly uses the OpenAI API
const handleContextFlow = ai.defineFlow(
  {
    name: 'handleContextFlow',
    inputSchema: HandleContextInputSchema,
    outputSchema: HandleContextOutputSchema,
  },
  async (input: HandleContextInput): Promise<HandleContextOutput> => {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set in the environment variables. Please add it to your .env file.");
    }

    const { message, conversationHistory } = input;

    const systemPrompt = `You are a helpful coding assistant named OmniAssist. You maintain the context of the conversation.`;
    const userPrompt = `Past Conversation:\n${conversationHistory}\n\nUser Message:\n${message}\n\nOmniAssist Response:`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Or "gpt-4-turbo" or another preferred model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
      });

      const botResponse = completion.choices[0].message.content;
      if (!botResponse) {
        throw new Error("OpenAI returned an empty response.");
      }

      const updatedConversationHistory = `${conversationHistory}\nUser: ${message}\nOmniAssist: ${botResponse}`.trim();
      
      return {
        response: botResponse,
        updatedConversationHistory: updatedConversationHistory,
      };

    } catch (error) {
      console.error("OpenAI API call failed in handleContextFlow:", error);
      // Consider how to propagate this error or return a meaningful error response
      // For now, re-throwing, but a structured error object might be better.
      throw error; 
    }
  }
);
