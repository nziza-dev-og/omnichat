'use server';
/**
 * @fileOverview Manages conversation context for the chatbot using Together AI.
 *
 * - handleContext - A function that maintains and utilizes conversation context.
 * - HandleContextInput - The input type for the handleContext function.
 * - HandleContextOutput - The return type for the handleContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import Together from "together-ai";

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

const HandleContextInputSchema = z.object({
  message: z.string().describe('The user message.'),
  conversationHistory: z.string().describe('The past conversation history (e.g., "User: Hi\\nOmniAssist: Hello!").'),
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

const handleContextFlow = ai.defineFlow(
  {
    name: 'handleContextFlow',
    inputSchema: HandleContextInputSchema,
    outputSchema: HandleContextOutputSchema,
  },
  async (input: HandleContextInput): Promise<HandleContextOutput> => {
    if (!process.env.TOGETHER_API_KEY) {
      throw new Error("TOGETHER_API_KEY is not set in the environment variables. Please add it to your .env file.");
    }

    const { message, conversationHistory } = input;

    const messagesForApi: {role: "system" | "user" | "assistant", content: string}[] = [
        { role: "system", content: "You are a helpful coding assistant named OmniAssist. You maintain the context of the conversation." }
    ];

    if (conversationHistory) {
      const historyLines = conversationHistory.split('\n');
      for (const line of historyLines) {
        if (line.startsWith('User: ')) {
          messagesForApi.push({ role: 'user', content: line.substring(6) });
        } else if (line.startsWith('OmniAssist: ')) {
          messagesForApi.push({ role: 'assistant', content: line.substring(12) });
        }
      }
    }
    messagesForApi.push({ role: 'user', content: message });

    try {
      const completion = await together.chat.completions.create({
        model: "Qwen/Qwen3-235B-A22B-fp8-tput", 
        messages: messagesForApi,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
      });

      const botResponseContent = completion.choices[0].message?.content;
      if (!botResponseContent) {
        throw new Error("Together AI returned an empty response.");
      }
      
      const updatedConversationHistory = `${conversationHistory}\nUser: ${message}\nOmniAssist: ${botResponseContent}`.trim();
      
      return {
        response: botResponseContent,
        updatedConversationHistory: updatedConversationHistory,
      };

    } catch (error) {
      console.error("Together AI API call failed in handleContextFlow:", error);
      throw error; 
    }
  }
);
