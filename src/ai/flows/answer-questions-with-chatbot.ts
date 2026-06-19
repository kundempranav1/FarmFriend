'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {geminiConfig} from '@/ai/config';
import {z} from 'genkit';

const AnswerQuestionInputSchema = z.object({
  question: z.string().describe('The question to answer.'),
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

const AnswerQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  // Initialize Genkit lazily inside the server action — avoids SSR crashes
  const ai = genkit({
    plugins: [googleAI({ apiKey: geminiConfig.apiKey })],
    model: 'googleai/gemini-2.0-flash',
  });

  const prompt = ai.definePrompt({
    name: 'answerQuestionPrompt',
    input: { schema: AnswerQuestionInputSchema },
    output: { schema: AnswerQuestionOutputSchema },
    prompt: `You are a helpful farming assistant chatbot. Answer the following question:

{{question}}`,
  });

  const { output } = await prompt(input);

  if (!output) {
    throw new Error('The AI model did not return an answer. Please try again.');
  }

  return output;
}
