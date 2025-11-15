'use server';

/**
 * @fileOverview This file defines a Genkit flow for optimizing email subject lines using AI.
 *
 * The flow accepts an email content and generates suggestions for improved subject lines to increase open rates.
 * It exports:
 * - `optimizeSubjectLine` - The function to trigger the subject line optimization flow.
 * - `OptimizeSubjectLineInput` - The input type for the optimizeSubjectLine function.
 * - `OptimizeSubjectLineOutput` - The output type for the optimizeSubjectLine function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeSubjectLineInputSchema = z.object({
  emailContent: z
    .string()
    .describe('The content of the email for which to generate subject lines.'),
});
export type OptimizeSubjectLineInput = z.infer<typeof OptimizeSubjectLineInputSchema>;

const OptimizeSubjectLineOutputSchema = z.object({
  suggestedSubjectLines: z
    .array(z.string())
    .describe('An array of 3 suggested subject lines optimized for higher open rates.'),
});
export type OptimizeSubjectLineOutput = z.infer<typeof OptimizeSubjectLineOutputSchema>;

export async function optimizeSubjectLine(input: OptimizeSubjectLineInput): Promise<OptimizeSubjectLineOutput> {
  return optimizeSubjectLineFlow(input);
}

const optimizeSubjectLinePrompt = ai.definePrompt({
  name: 'optimizeSubjectLinePrompt',
  input: {schema: OptimizeSubjectLineInputSchema},
  output: {schema: OptimizeSubjectLineOutputSchema},
  prompt: `You are an expert email marketer. Given the following email content, suggest 3 creative and compelling subject lines that are likely to result in higher open rates. Ensure the subjects are concise and engaging.\n\nEmail Content:\n{{{emailContent}}}\n\nSubject Lines:`,
});

const optimizeSubjectLineFlow = ai.defineFlow(
  {
    name: 'optimizeSubjectLineFlow',
    inputSchema: OptimizeSubjectLineInputSchema,
    outputSchema: OptimizeSubjectLineOutputSchema,
  },
  async input => {
    const {output} = await optimizeSubjectLinePrompt(input);
    return output!;
  }
);
