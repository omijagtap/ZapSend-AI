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
  });
} else {
  console.log('✅ Gemini API key found, initializing...');
  try {
    ai = genkit({
      plugins: [googleAI({ apiKey })],
      model: 'googleai/gemini-2.5-flash',
    });
    console.log('✅ Gemini AI initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Gemini AI:', error);
    // Fallback to basic genkit
    ai = genkit({
      plugins: [],
    });
  }
}

export { ai };
