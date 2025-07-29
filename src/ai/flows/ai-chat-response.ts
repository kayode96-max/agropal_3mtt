'use server';

/**
 * @fileOverview An AI chat agent that answers questions about farming practices in multiple Nigerian languages.
 *
 * - aiChatResponse - A function that handles the chat process and returns an AI generated response.
 * - AiChatResponseInput - The input type for the aiChatResponse function.
 * - AiChatResponseOutput - The return type for the aiChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiChatResponseInputSchema = z.object({
  query: z.string().describe('The user query about farming practices in either English, Yoruba, Hausa, Igbo, or Nigerian Pidgin.'),
});
export type AiChatResponseInput = z.infer<typeof AiChatResponseInputSchema>;

const AiChatResponseOutputSchema = z.object({
  response: z.string().describe('The AI generated response to the user query, in the same language as the query.'),
});
export type AiChatResponseOutput = z.infer<typeof AiChatResponseOutputSchema>;

export async function aiChatResponse(input: AiChatResponseInput): Promise<AiChatResponseOutput> {
  return aiChatResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatResponsePrompt',
  input: {schema: AiChatResponseInputSchema},
  output: {schema: AiChatResponseOutputSchema},
  prompt: `You are a friendly and helpful AI assistant for Nigerian farmers, acting as a community guide.
  Your name is 'Agbè̩ anko', the digital farming companion.
  You can understand and respond in English, Yoruba, Hausa, Igbo, and Nigerian Pidgin.

  When a user asks a question, you must:
  1. Identify the language of the query (English, Yoruba, Hausa, Igbo, or Pidgin).
  2. Provide a helpful, concise answer about farming practices, crop diagnosis, market prices, or weather, tailored to Nigeria.
  3. ALWAYS respond in the SAME language as the user's query.
  4. Keep your responses easy to understand, even for users with limited literacy.
  5. Be encouraging and build a sense of community.

  User Query: {{{query}}}
  `,
});

const aiChatResponseFlow = ai.defineFlow(
  {
    name: 'aiChatResponseFlow',
    inputSchema: AiChatResponseInputSchema,
    outputSchema: AiChatResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
