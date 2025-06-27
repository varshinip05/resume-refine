'use server';
/**
 * @fileOverview Defines a Genkit tool for searching for job listings.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// This is a mock database of job listings.
// In a real-world application, this would be a call to a live job search API.
const MOCK_JOB_DB = [
  {
    title: 'Frontend Developer',
    company: 'Innovate Inc.',
    location: 'Boston, MA',
    salary: '$110,000 - $140,000',
    skills: ['React', 'TypeScript', 'CSS', 'Next.js', 'GraphQL'],
  },
  {
    title: 'Full Stack Engineer',
    company: 'Data Dynamics',
    location: 'Remote',
    salary: '$130,000 - $170,000',
    skills: ['Node.js', 'React', 'TypeScript', 'PostgreSQL', 'Docker'],
  },
  {
    title: 'UX/UI Designer',
    company: 'Creative Solutions',
    location: 'New York, NY',
    salary: '$95,000 - $125,000',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
  },
  {
    title: 'Product Manager',
    company: 'CloudCore',
    location: 'Austin, TX',
    salary: '$140,000 - $180,000',
    skills: ['Agile', 'Roadmap Planning', 'User Stories', 'Market Analysis', 'JIRA'],
  },
  {
    title: 'DevOps Engineer',
    company: 'SecureNet',
    location: 'Remote',
    salary: '$135,000 - $165,000',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Python'],
  },
  {
    title: 'Data Scientist',
    company: 'QuantumLeap AI',
    location: 'San Francisco, CA',
    salary: '$150,000 - $200,000',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Machine Learning'],
  },
];

const JobSearchInputSchema = z.object({
  query: z.string().describe('A search query for job titles or skills.'),
});

const JobSearchResultSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string(),
  salary: z.string(),
  skills: z.array(z.string()),
});

export const searchForJobsTool = ai.defineTool(
  {
    name: 'searchForJobsTool',
    description: 'Searches a database for available job listings based on a query.',
    inputSchema: JobSearchInputSchema,
    outputSchema: z.array(JobSearchResultSchema),
  },
  async (input) => {
    console.log(`Tool called: Searching for jobs with query "${input.query}"`);
    const query = input.query.toLowerCase();

    // Simulate a database search by filtering the mock data.
    const results = MOCK_JOB_DB.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.skills.some((skill) => skill.toLowerCase().includes(query))
    );

    return results;
  }
);
