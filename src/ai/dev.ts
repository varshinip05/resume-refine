import { config } from 'dotenv';
config();

import '@/ai/flows/resume-analyzer.ts';
import '@/ai/flows/suggestion-generator.ts';
import '@/ai/flows/resume-feedback-generator.ts';
import '@/ai/flows/job-recommender.ts';
import '@/ai/tools/job-search-tool.ts';
