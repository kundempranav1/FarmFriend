'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {geminiConfig} from '@/ai/config';
import {z} from 'genkit';

const PredictSeasonInputSchema = z.object({
  cropName: z.string().describe('The name of the crop.'),
  location: z.string().describe('The location (e.g., city, state) where the crop will be grown.'),
});
export type PredictSeasonInput = z.infer<typeof PredictSeasonInputSchema>;

const PredictSeasonOutputSchema = z.object({
  sowingPrediction: z.string().describe('The predicted best time to sow the crop (e.g., "Mid-June to Early July").'),
  harvestingPrediction: z.string().describe('The predicted best time to harvest the crop (e.g., "Late October to Mid-November").'),
  weatherRisk: z.string().describe('A brief assessment of potential weather risks for the season.'),
  alternateCrops: z.array(z.object({
    name: z.string().describe('The name of the alternative crop.'),
    reason: z.string().describe('The reason this crop is a good alternative.'),
  })).describe('A list of alternative crops to consider if the weather outlook is risky.'),
});
export type PredictSeasonOutput = z.infer<typeof PredictSeasonOutputSchema>;

export async function predictSeason(input: PredictSeasonInput): Promise<PredictSeasonOutput> {
  // Initialize Genkit lazily inside the server action — avoids SSR crashes
  const ai = genkit({
    plugins: [googleAI({ apiKey: geminiConfig.apiKey })],
    model: 'googleai/gemini-2.0-flash',
  });

  const prompt = ai.definePrompt({
    name: 'predictSeasonPrompt',
    input: { schema: PredictSeasonInputSchema },
    output: { schema: PredictSeasonOutputSchema },
    prompt: `You are an agricultural AI expert specializing in seasonal predictions.

Based on historical weather patterns, climate model data (including El Niño/La Niña cycles), and regional agricultural knowledge for the given location, provide a "Smart Season Prediction" for the specified crop.

Your prediction must include:
1. The optimal sowing window.
2. The expected harvesting window.
3. A brief assessment of potential weather risks for the upcoming season.
4. If there are significant risks, recommend 2-3 alternative crops that are better suited for the predicted conditions and explain why.

Location: {{{location}}}
Crop: {{{cropName}}}
`,
  });

  const { output } = await prompt(input);

  if (!output) {
    throw new Error('The AI model did not return a valid season prediction. Please try again.');
  }

  return output;
}
