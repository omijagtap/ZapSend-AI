// Test Gemini API directly
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing Gemini API...');
console.log('API Key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');

try {
  const ai = genkit({
    plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
    model: 'googleai/gemini-2.5-flash',
  });

  // Test basic generation
  const result = await ai.generate({
    prompt: 'Generate 3 email subject lines for AI marketing',
    output: {
      format: 'json',
      schema: {
        type: 'object',
        properties: {
          subjects: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  });

  console.log('✅ Success:', result.text);
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Full error:', error);
}
