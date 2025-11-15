import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Check if API key is available
const apiKey = process.env.GEMINI_API_KEY;

let ai;

if (!apiKey) {
  console.warn('GEMINI_API_KEY environment variable is not set. AI features will be disabled.');
  // Create a mock genkit instance for development without API key
  ai = genkit({
    plugins: [],
    model: undefined,
  });
} else {
  ai = genkit({
    plugins: [googleAI({ apiKey })],
    model: 'googleai/gemini-2.5-flash',
  });
}

export { ai };
