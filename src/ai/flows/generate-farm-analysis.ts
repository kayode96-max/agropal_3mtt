'use server';
/**
 * @fileOverview An AI-powered farm analysis generator.
 *
 * - generateFarmAnalysis - A function that generates a farm analysis report.
 * - GenerateFarmAnalysisInput - The input type for the function.
 * - GenerateFarmAnalysisOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateFarmAnalysisInputSchema = z.object({
  crop: z.string().describe('The type of crop being planted (e.g., Maize, Cassava, Rice).'),
  landArea: z.string().describe('The size of the farmland, including units (e.g., 2 acres, 1.5 hectares).'),
  soilType: z.string().describe('The dominant soil type of the farm (e.g., Loamy, Sandy, Clay).'),
  region: z.string().describe('The geographical region in Nigeria where the farm is located (e.g., Southwest, North-Central).'),
});
export type GenerateFarmAnalysisInput = z.infer<typeof GenerateFarmAnalysisInputSchema>;


const GenerateFarmAnalysisOutputSchema = z.object({
  yieldPrediction: z.string().describe('A detailed prediction of the potential crop yield, including a quantitative estimate (e.g., "3.5 - 4.5 tonnes per acre").'),
  revenueProjection: z.string().describe('An estimated gross revenue based on the predicted yield and current market prices for the specified region in Nigeria (e.g., "Between NGN 800,000 and NGN 950,000").'),
  profitAnalysis: z.object({
    estimatedCosts: z.string().describe('A summary of estimated total costs, covering key inputs like seeds, fertilizer, labor, and pest control for the given land area and crop.'),
    projectedNetProfit: z.string().describe('The projected net profit, calculated as gross revenue minus estimated costs.'),
  }),
  recommendations: z.string().describe('A set of actionable recommendations to improve yield and profitability, tailored to the provided inputs. Include advice on fertilizer type, planting techniques, and water management.'),
  riskAssessment: z.string().describe('An assessment of potential risks, such as common pests/diseases for the crop in that region, climate-related challenges, and market price volatility.'),
});
export type GenerateFarmAnalysisOutput = z.infer<typeof GenerateFarmAnalysisOutputSchema>;


const analysisPrompt = ai.definePrompt({
    name: 'farmAnalysisPrompt',
    input: { schema: GenerateFarmAnalysisInputSchema },
    output: { schema: GenerateFarmAnalysisOutputSchema },
    prompt: `You are an expert agricultural analyst for Nigerian farmers. Your task is to generate a comprehensive farm analysis report based on the user's provided inputs.
    
    Use your knowledge of Nigerian agriculture, crop types, soil, climate by region, and market conditions to provide realistic and actionable insights.

    **User Inputs:**
    - Crop: {{{crop}}}
    - Land Area: {{{landArea}}}
    - Soil Type: {{{soilType}}}
    - Region: {{{region}}}

    **Your Task:**
    1.  **Yield Prediction:** Predict a realistic yield range for the specified crop, area, soil, and region.
    2.  **Revenue Projection:** Based on the yield prediction and typical market prices for that crop in that region of Nigeria, project the potential gross revenue in Nigerian Naira (NGN).
    3.  **Profitability Analysis:**
        - Estimate the likely costs (seeds, fertilizer, labor, etc.) for the specified farm size and crop.
        - Calculate the projected net profit.
    4.  **Recommendations:** Provide specific, actionable advice. For example, if the soil is sandy, recommend organic matter. If the crop is maize, suggest appropriate NPK fertilizer ratios.
    5.  **Risk Assessment:** Identify key risks. For cassava in the South, mention Cassava Mosaic Disease. For the North, mention potential water scarcity issues. Discuss market price fluctuations.

    Respond ONLY with the JSON object conforming to the output schema.
    `,
});


const generateFarmAnalysisFlow = ai.defineFlow(
  {
    name: 'generateFarmAnalysisFlow',
    inputSchema: GenerateFarmAnalysisInputSchema,
    outputSchema: GenerateFarmAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    if (!output) {
      throw new Error("Failed to generate a farm analysis from the AI model.");
    }
    return output;
  }
);


export async function generateFarmAnalysis(input: GenerateFarmAnalysisInput): Promise<GenerateFarmAnalysisOutput> {
  return generateFarmAnalysisFlow(input);
}
