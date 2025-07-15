// This file contains the Genkit flow for generating suggestions to improve a resume and highlight the user's strengths.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * @fileOverview Generates suggestions to improve a resume and highlight the user's strengths.
 *
 * - generateResumeSuggestions - A function that generates resume improvement suggestions.
 * - ResumeSuggestionsInput - The input type for the generateResumeSuggestions function.
 * - ResumeSuggestionsOutput - The return type for the generateResumeSuggestions function.
 */

const ResumeSuggestionsInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to generate suggestions for.'),
});
export type ResumeSuggestionsInput = z.infer<typeof ResumeSuggestionsInputSchema>;

const ResumeSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('Suggestions to improve the resume and highlight strengths.'),
});
export type ResumeSuggestionsOutput = z.infer<typeof ResumeSuggestionsOutputSchema>;

export async function generateResumeSuggestions(
  input: ResumeSuggestionsInput
): Promise<ResumeSuggestionsOutput> {
  return generateResumeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeSuggestionsPrompt',
  input: {schema: ResumeSuggestionsInputSchema},
  output: {schema: ResumeSuggestionsOutputSchema},
  prompt: `You are an expert resume writer. Review the following resume text and provide suggestions to improve it and highlight the candidate's strengths. Be specific and actionable.

Resume Text:
{{{resumeText}}}`,
});

const generateResumeSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateResumeSuggestionsFlow',
    inputSchema: ResumeSuggestionsInputSchema,
    outputSchema: ResumeSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
