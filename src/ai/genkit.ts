import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {geminiConfig} from '@/ai/config';

export const ai = genkit({
  plugins: [googleAI({ apiKey: geminiConfig.apiKey })],
  model: 'googleai/gemini-2.0-flash',
});

