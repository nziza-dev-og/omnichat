'use server';
/**
 * @fileOverview Manages conversation context for the chatbot.
 *
 * - handleContext - A function that maintains and utilizes conversation context.
 * - HandleContextInput - The input type for the handleContext function.
 * - HandleContextOutput - The return type for the handleContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

const prompt = ai.definePrompt({
  name: 'handleContextPrompt',
  input: {schema: HandleContextInputSchema},
  output: {schema: HandleContextOutputSchema},
  prompt: `You are a helpful coding assistant named OmniAssist. You maintain the context of the conversation.

  Past Conversation:
  {{conversationHistory}}

  User Message:
  {{message}}

  Response:`, // Removed Handlebars await as it is invalid
});

const handleContextFlow = ai.defineFlow(
  {
    name: 'handleContextFlow',
    inputSchema: HandleContextInputSchema,
    outputSchema: HandleContextOutputSchema,
  },
  async input => {
    const {message, conversationHistory} = input;
    const {output} = await prompt({
      message,
      conversationHistory,
    });
    const response = output!.response;
    const updatedConversationHistory = conversationHistory + '\nUser: ' + message + '\nOmniAssist: ' + response;
    return {response, updatedConversationHistory};
  }
);
