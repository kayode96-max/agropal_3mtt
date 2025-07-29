// diagnose-crop-issue.ts
'use server';

/**
 * @fileOverview A crop problem diagnosis AI agent that leverages Plant.id and generates local Nigerian treatment solutions.
 *
 * - diagnoseCropIssue - A function that handles the crop diagnosis process.
 * - DiagnoseCropIssueInput - The input type for the diagnoseCropIssue function.
 * - DiagnoseCropIssueOutput - The return type for the diagnoseCropIssue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseCropIssueInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the diseased plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  additionalDetails: z
    .string()
    .optional()
    .describe('Any additional details about the plant or its condition.'),
});
export type DiagnoseCropIssueInput = z.infer<typeof DiagnoseCropIssueInputSchema>;

const PlantIdApiResponseSchema = z.object({
  suggestions: z.array(
    z.object({
      plant_name: z.string(),
      plant_details: z.object({
        scientific_name: z.string(),
      }),
      probability: z.number(),
    })
  ),
  is_plant: z.boolean(),
});

const DiagnoseCropIssueOutputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis of the plant issue.'),
  treatmentSolutions: z
    .string()
    .describe('Potential local Nigerian treatment solutions.'),
  confidenceScore: z.number().describe('A confidence score for the diagnosis.'),
});
export type DiagnoseCropIssueOutput = z.infer<typeof DiagnoseCropIssueOutputSchema>;

const plantIdTool = ai.defineTool(
  {
    name: 'plantId',
    description: 'Identifies the plant and potential diseases using an image.',
    inputSchema: z.object({
      photoDataUri: z
        .string()
        .describe(
          "A photo of the diseased plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
    outputSchema: PlantIdApiResponseSchema,
  },
  async (input) => {
    // TODO: Implement Plant.id API call here.
    // This is a placeholder implementation.
    console.log('Plant.id tool called with input:');
    const mockResponse: z.infer<typeof PlantIdApiResponseSchema> = {
      suggestions: [
        {
          plant_name: 'Cassava',
          plant_details: {
            scientific_name: 'Manihot esculenta',
          },
          probability: 0.85,
        },
      ],
      is_plant: true,
    };
    return mockResponse;
  },
);

const diagnoseCropIssuePrompt = ai.definePrompt({
  name: 'diagnoseCropIssuePrompt',
  input: {schema: DiagnoseCropIssueInputSchema},
  output: {schema: DiagnoseCropIssueOutputSchema},
  tools: [plantIdTool],
  prompt: `You are an expert agricultural advisor in Nigeria, specializing in diagnosing plant diseases and recommending treatment solutions that are available locally.

  You have access to a tool called 'plantId' which can identify a plant from a photo.
  Use the 'plantId' tool with the provided 'photoDataUri' to identify the plant first.

  Based on the plant identification from the tool, and any 'additionalDetails' provided by the farmer, diagnose the issue affecting the plant and suggest treatment solutions.

  The treatment solutions should be specific to Nigeria, using locally available resources and methods.

  The user has provided the following information:
  Photo: {{media url=photoDataUri}}
  Additional Details: {{additionalDetails}}

  Format your response as a JSON object conforming to the output schema.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const diagnoseCropIssueFlow = ai.defineFlow(
  {
    name: 'diagnoseCropIssueFlow',
    inputSchema: DiagnoseCropIssueInputSchema,
    outputSchema: DiagnoseCropIssueOutputSchema,
  },
  async (input) => {
    const {output} = await diagnoseCropIssuePrompt(input);
    return output!;
  }
);

export async function diagnoseCropIssue(input: DiagnoseCropIssueInput): Promise<DiagnoseCropIssueOutput> {
  return diagnoseCropIssueFlow(input);
}

export type {PlantIdApiResponseSchema}
