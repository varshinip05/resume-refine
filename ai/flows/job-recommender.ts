'use server';
/**
 * @fileOverview A job recommender AI agent.
 *
 * - recommendJobs - A function that handles the job recommendation process.
 * - RecommendJobsInput - The input type for the recommendJobs function.
 * - RecommendJobsOutput - The return type for the recommendJobs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchForJobsTool } from '@/ai/tools/job-search-tool';

const RecommendJobsInputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('A list of skills from the user\'s resume.'),
});
export type RecommendJobsInput = z.infer<typeof RecommendJobsInputSchema>;

const JobSchema = z.object({
  title: z.string().describe('The job title.'),
  company: z.string().describe('A realistic, well-known, or plausible company name.'),
  location: z.string().describe('The job location (e.g., "San Francisco, CA", or "Remote").'),
  salary: z.string().describe('An estimated salary range for the role (e.g., "$120,000 - $160,000").'),
  match: z
    .number()
    .describe(
      'A percentage score (0-100) indicating how well the user\'s skills match the job.'
    ),
  skills: z
    .array(z.string())
    .describe('A list of the top 5 most important skills for this job.'),
});

const RecommendJobsOutputSchema = z.object({
  jobs: z
    .array(JobSchema)
    .describe('An array of 4 recommended job objects.'),
});
export type RecommendJobsOutput = z.infer<typeof RecommendJobsOutputSchema>;
export type Job = z.infer<typeof JobSchema>;


export async function recommendJobs(
  input: RecommendJobsInput
): Promise<RecommendJobsOutput> {
  return recommendJobsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendJobsPrompt',
  input: {schema: RecommendJobsInputSchema},
  output: {schema: RecommendJobsOutputSchema},
  tools: [searchForJobsTool],
  prompt: `You are an expert career advisor and job search assistant. Your task is to recommend four diverse and suitable job roles based on the user's skills.

The user has the following skills:
{{#each skills}}
- {{{this}}}
{{/each}}

First, use the searchForJobsTool to find job listings that are relevant to the user's skills. You should make a few different queries to the tool to ensure you get a diverse set of results.

After you have the job listings from the tool, review them and select the four best and most varied recommendations for the user. For each recommendation, provide:
- A clear job title.
- The company name.
- The location.
- An estimated annual salary range.
- A match percentage (0-100) representing how good a fit the job is for the provided skills.
- A list of the top 5 most important skills for the job.

Generate exactly 4 job recommendations based on the tool's output.
`,
});

const recommendJobsFlow = ai.defineFlow(
  {
    name: 'recommendJobsFlow',
    inputSchema: RecommendJobsInputSchema,
    outputSchema: RecommendJobsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
