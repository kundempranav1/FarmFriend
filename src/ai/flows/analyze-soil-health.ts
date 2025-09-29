'use server';

/**
 * @fileOverview Analyzes soil health from an image.
 *
 * - analyzeSoilHealth - A function that takes an image of soil and returns an analysis of its moisture, pH, and nitrogen levels.
 * - AnalyzeSoilHealthInput - The input type for the analyzeSoilHealth function.
 * - AnalyzeSoilHealthOutput - The return type for the analyzeSoilHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSoilHealthInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the soil, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeSoilHealthInput = z.infer<typeof AnalyzeSoilHealthInputSchema>;

const AnalyzeSoilHealthOutputSchema = z.object({
    soilMoisture: z.number().describe('The estimated soil moisture level as a percentage (0-100).'),
    phLevel: z.number().describe('The estimated pH level of the soil (0-14).'),
    nitrogenLevel: z.number().describe('The estimated nitrogen level in the soil as a percentage (0-100), where 100 is very high.'),
});
export type AnalyzeSoilHealthOutput = z.infer<typeof AnalyzeSoilHealthOutputSchema>;

export async function analyzeSoilHealth(input: AnalyzeSoilHealthInput): Promise<AnalyzeSoilHealthOutput> {
  return analyzeSoilHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSoilHealthPrompt',
  input: {schema: AnalyzeSoilHealthInputSchema},
  output: {schema: AnalyzeSoilHealthOutputSchema},
  prompt: `You are an expert soil scientist. Analyze the provided image of soil and estimate the following properties:
- Soil Moisture (%): Look at the color (darker usually means more moisture), texture, and signs of water.
- pH Level: Assess the visual cues that might indicate acidity or alkalinity. This is a rough estimation.
- Nitrogen Level (%): Estimate the nitrogen content based on color and apparent organic matter. A rich, dark color often suggests higher nitrogen.

Provide your best estimates for these three values based on the visual information in the photo.

Photo: {{media url=photoDataUri}}
`,
});

const analyzeSoilHealthFlow = ai.defineFlow(
  {
    name: 'analyzeSoilHealthFlow',
    inputSchema: AnalyzeSoilHealthInputSchema,
    outputSchema: AnalyzeSoilHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
