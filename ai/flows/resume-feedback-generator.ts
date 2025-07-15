'use server';

/**
 * @fileOverview Generates feedback for a given resume.
 *
 * - resumeFeedbackGenerator - A function that generates feedback for a given resume.
 * - ResumeFeedbackInput - The input type for the resumeFeedbackGenerator function.
 * - ResumeFeedbackOutput - The return type for the resumeFeedbackGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeFeedbackInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to provide feedback on.'),
});
export type ResumeFeedbackInput = z.infer<typeof ResumeFeedbackInputSchema>;

const ResumeFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Feedback on the resume, highlighting areas for improvement and skill gaps.'),
  skillGaps: z.string().describe('A summary of the skill gaps identified in the resume.'),
  suggestions: z.string().describe('Suggestions for improving the resume.'),
});
export type ResumeFeedbackOutput = z.infer<typeof ResumeFeedbackOutputSchema>;

export async function resumeFeedbackGenerator(input: ResumeFeedbackInput): Promise<ResumeFeedbackOutput> {
  return resumeFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeFeedbackPrompt',
  input: {schema: ResumeFeedbackInputSchema},
  output: {schema: ResumeFeedbackOutputSchema},
  prompt: `You are a resume expert. You will provide feedback on the resume, highlighting areas for improvement and skill gaps, so the user can enhance their resume's effectiveness.

  Resume Text: {{{resumeText}}}

  Provide detailed feedback, identify skill gaps, and suggest concrete improvements.
  The response should be structured to be easily parsed by a machine.`, 
});

const resumeFeedbackFlow = ai.defineFlow(
  {
    name: 'resumeFeedbackFlow',
    inputSchema: ResumeFeedbackInputSchema,
    outputSchema: ResumeFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
