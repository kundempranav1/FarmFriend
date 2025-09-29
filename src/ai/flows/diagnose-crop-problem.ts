'use server';

/**
 * @fileOverview Diagnoses crop problems based on an image and description.
 *
 * - diagnoseCropProblem - A function that takes an image and description of a crop problem and returns a diagnosis, confidence score, and potential solutions.
 * - DiagnoseCropProblemInput - The input type for the diagnoseCropProblem function.
 * - DiagnoseCropProblemOutput - The return type for the diagnoseCropProblem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseCropProblemInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the affected crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'    ),
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
  return diagnoseCropProblemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseCropProblemPrompt',
  input: {schema: DiagnoseCropProblemInputSchema},
  output: {schema: DiagnoseCropProblemOutputSchema},
  prompt: `You are an AI assistant that helps farmers diagnose problems with their crops.

You are provided with a photo and a description of the problem. You should use this information to diagnose the problem, provide a confidence score (0-1), and suggest potential solutions, including organic remedies and chemical treatments.

Finally, provide prevention tips to avoid the problem in the future.

IMPORTANT: Your response must be only the raw JSON object, without any markdown formatting or other text.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}

Make sure the confidence score is a number between 0 and 1.
`,
});

const diagnoseCropProblemFlow = ai.defineFlow(
  {
    name: 'diagnoseCropProblemFlow',
    inputSchema: DiagnoseCropProblemInputSchema,
    outputSchema: DiagnoseCropProblemOutputSchema,
  },
  async input => {
    return await prompt(input);
  }
);
