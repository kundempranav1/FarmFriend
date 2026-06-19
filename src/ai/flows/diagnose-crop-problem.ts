'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {geminiConfig} from '@/ai/config';
import {z} from 'genkit';

const DiagnoseCropProblemInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the affected crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  description: z.string().describe('A description of the crop problem.'),
});
export type DiagnoseCropProblemInput = z.infer<typeof DiagnoseCropProblemInputSchema>;

const DiagnoseCropProblemOutputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis of the crop problem.'),
  confidence: z.number().describe('The confidence score of the diagnosis (0-1).'),
  solutions: z.object({
    organicRemedies: z.array(z.string()).describe('A list of organic remedies for the problem.'),
    chemicalTreatments: z.array(z.string()).describe('A list of chemical treatments for the problem.'),
  }).describe('Solutions for the diagnosed problem, separated into organic and chemical treatments.'),
  prevention: z.array(z.string()).describe('A list of prevention tips to avoid the problem in the future.'),
});
export type DiagnoseCropProblemOutput = z.infer<typeof DiagnoseCropProblemOutputSchema>;

export async function diagnoseCropProblem(input: DiagnoseCropProblemInput): Promise<DiagnoseCropProblemOutput> {
  // Initialize Genkit lazily inside the server action — avoids SSR crashes
  const ai = genkit({
    plugins: [googleAI({ apiKey: geminiConfig.apiKey })],
    model: 'googleai/gemini-2.0-flash',
  });

  const prompt = ai.definePrompt({
    name: 'diagnoseCropProblemPrompt',
    input: { schema: DiagnoseCropProblemInputSchema },
    output: { schema: DiagnoseCropProblemOutputSchema },
    prompt: `You are an expert agronomist AI specializing in diagnosing crop diseases from images and descriptions.

Analyze the provided information to identify the likely problem. Provide a diagnosis, a confidence score between 0 and 1, and suggest solutions.

- **Diagnosis:** The most likely disease, pest, or deficiency.
- **Confidence Score:** Your confidence in the diagnosis (a number from 0.0 to 1.0).
- **Solutions:** Provide a list of organic remedies and a separate list of chemical treatments.
- **Prevention:** Offer practical tips to prevent this issue in the future.

Your response MUST be a valid JSON object matching the requested schema. Do not include any extra text, markdown formatting, or explanations outside of the JSON structure.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}
`,
  });

  const { output } = await prompt(input);

  if (!output) {
    throw new Error('The AI model did not return a valid diagnosis. Please try again.');
  }

  return output;
}
