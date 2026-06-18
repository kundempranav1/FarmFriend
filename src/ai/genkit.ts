import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const plugins = [];
let model;

// Conditionally initialize the Google AI plugin only if the API key is available.
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== '') {
  plugins.push(
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  );
  model = 'googleai/gemini-2.5-flash';
} else {
  // In development, warn the user that the API key is missing.
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'GEMINI_API_KEY environment variable is not set. AI features will not be available. Please add your key to the .env file.'
    );
  }
}

export const ai = genkit({
  plugins,
  model, // This will be undefined if the key is missing, preventing a crash.
});
