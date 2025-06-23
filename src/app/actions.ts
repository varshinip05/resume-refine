'use server';

import { analyzeResume } from '@/ai/flows/resume-analyzer';
import { resumeFeedbackGenerator } from '@/ai/flows/resume-feedback-generator';
import { z } from 'zod';

const fileToDataUri = (file: File) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
      resolve(dataUri);
    } catch (error) {
      reject(error);
    }
  });
};

const fileToText = async (file: File): Promise<string> => {
  // Mocking PDF text extraction as there's no library to do it in this environment.
  // In a real-world application, a library like 'pdf-parse' on the server would be used.
  console.log('Mocking text extraction for', file.name);
  return Promise.resolve(`
    John Doe
    Software Engineer
    john.doe@example.com

    Summary
    A passionate software engineer with 5 years of experience in developing web applications using React, Node.js, and TypeScript.

    Experience
    Senior Software Engineer, Tech Corp (2021-Present)
    - Developed and maintained web applications.
    - Led a team of 3 developers.

    Software Engineer, Startup Inc (2019-2021)
    - Worked on the company's main product.
    - Implemented new features.

    Skills
    - JavaScript, TypeScript, React, Node.js, Next.js, SQL, MongoDB.
  `);
};

const actionSchema = z
  .object({
    resume: z.instanceof(File),
  })
  .refine((data) => data.resume.size > 0, {
    message: 'Resume file is required.',
    path: ['resume'],
  })
  .refine((data) => data.resume.type === 'application/pdf', {
    message: 'File must be a PDF.',
    path: ['resume'],
  });

export type AnalysisResult = {
  skills?: string[];
  feedback?: string;
  skillGaps?: string;
  suggestions?: string;
  error?: string;
};

export async function analyzeResumeAction(
  formData: FormData
): Promise<AnalysisResult> {
  const parseResult = actionSchema.safeParse({ resume: formData.get('resume') });

  if (!parseResult.success) {
    return { error: parseResult.error.errors[0].message };
  }
  const { resume: file } = parseResult.data;

  try {
    const [resumeDataUri, resumeText] = await Promise.all([
      fileToDataUri(file),
      fileToText(file),
    ]);

    const [analysisResult, feedbackResult] = await Promise.all([
      analyzeResume({ resumeDataUri }),
      resumeFeedbackGenerator({ resumeText }),
    ]);

    return {
      skills: analysisResult.skills,
      ...feedbackResult,
    };
  } catch (e) {
    console.error(e);
    return { error: 'An error occurred during analysis. Please try again.' };
  }
}
