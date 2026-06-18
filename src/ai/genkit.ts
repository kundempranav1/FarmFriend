import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === '') {
  const msg =
    'GEMINI_API_KEY environment variable is not set. ' +
    'Please add it to your .env file (locally) or to your Vercel / hosting ' +
    'environment variables (in production). AI features will not work without it.';
  // Always log so it shows in Vercel Function logs.
  console.error(msg);
}

export const ai = genkit({
  plugins: apiKey
    ? [googleAI({ apiKey })]
    : [],
  model: apiKey ? 'googleai/gemini-2.5-flash' : undefined,
});
