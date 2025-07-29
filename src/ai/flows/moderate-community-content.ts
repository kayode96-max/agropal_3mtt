'use server';

/**
 * @fileOverview This file defines a Genkit flow for moderating community content.
 *
 * - moderateCommunityContent - A function that moderates community content.
 * - ModerateCommunityContentInput - The input type for the moderateCommunityContent function.
 * - ModerateCommunityContentOutput - The return type for the moderateCommunityContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateCommunityContentInputSchema = z.object({
  content: z
    .string()
    .describe('The text content to be moderated, e.g., a post or comment.'),
});
export type ModerateCommunityContentInput = z.infer<typeof ModerateCommunityContentInputSchema>;

const ModerateCommunityContentOutputSchema = z.object({
  isAppropriate: z
    .boolean()
    .describe(
      'Whether the content is appropriate (true) or violates community guidelines (false).'
    ),
  reason: z
    .string()
    .describe(
      'The reason why the content was flagged as inappropriate, if applicable.  If the content is appropriate, this should be an empty string.'
    ),
  confidenceScore: z
    .number()
    .describe(
      'A score between 0 and 1 indicating the confidence level of the moderation decision.  0 is least confident, 1 is most confident.'
    ),
});
export type ModerateCommunityContentOutput = z.infer<typeof ModerateCommunityContentOutputSchema>;

export async function moderateCommunityContent(
  input: ModerateCommunityContentInput
): Promise<ModerateCommunityContentOutput> {
  return moderateCommunityContentFlow(input);
}

const moderateCommunityContentPrompt = ai.definePrompt({
  name: 'moderateCommunityContentPrompt',
  input: {schema: ModerateCommunityContentInputSchema},
  output: {schema: ModerateCommunityContentOutputSchema},
  prompt: `You are a community moderator responsible for identifying inappropriate content.

  Analyze the following content and determine if it violates community guidelines.
  Return a JSON object indicating whether the content is appropriate, the reason for flagging it (if inappropriate), and a confidence score.

  Content: {{{content}}}

  Community Guidelines:
  - No hate speech or discrimination.
  - No harassment or personal attacks.
  - No sexually explicit content.
  - No spam or irrelevant content.
  - No promotion of illegal activities.

  Respond in the following JSON format:
  {
    "isAppropriate": true|false,
    "reason": "reason for flagging (if inappropriate), otherwise empty string",
    "confidenceScore": 0.0-1.0
  }`,
});

const moderateCommunityContentFlow = ai.defineFlow(
  {
    name: 'moderateCommunityContentFlow',
    inputSchema: ModerateCommunityContentInputSchema,
    outputSchema: ModerateCommunityContentOutputSchema,
  },
  async input => {
    const {output} = await moderateCommunityContentPrompt(input);
    return output!;
  }
);
