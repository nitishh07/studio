'use server';
/**
 * @fileOverview An AI assistant for crafting comprehensive job descriptions.
 *
 * - generateJobDescription - A function that generates a job description based on provided details.
 * - GenerateJobDescriptionInput - The input type for the generateJobDescription function.
 * - GenerateJobDescriptionOutput - The return type for the generateJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJobDescriptionInputSchema = z.object({
  title: z.string().describe('The job title.'),
  company: z.string().describe('The company offering the job.'),
  responsibilities: z
    .array(z.string())
    .describe('A list of key responsibilities for the job.'),
});
export type GenerateJobDescriptionInput = z.infer<
  typeof GenerateJobDescriptionInputSchema
>;

const GenerateJobDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated comprehensive job description.'),
});
export type GenerateJobDescriptionOutput = z.infer<
  typeof GenerateJobDescriptionOutputSchema
>;

export async function generateJobDescription(
  input: GenerateJobDescriptionInput
): Promise<GenerateJobDescriptionOutput> {
  return generateJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJobDescriptionPrompt',
  input: {schema: GenerateJobDescriptionInputSchema},
  output: {schema: GenerateJobDescriptionOutputSchema},
  prompt: `You are an AI assistant specialized in crafting comprehensive and high-quality job descriptions efficiently.

Generate a detailed job description based on the following information:

Job Title: {{{title}}}
Company: {{{company}}}

Key Responsibilities:
{{#each responsibilities}}- {{{this}}}
{{/each}}

The job description should be professional, engaging, and clearly outline the role's expectations and benefits, aiming to attract top talent. Focus on creating a compelling narrative that highlights the company culture and growth opportunities.
`,
});

const generateJobDescriptionFlow = ai.defineFlow(
  {
    name: 'generateJobDescriptionFlow',
    inputSchema: GenerateJobDescriptionInputSchema,
    outputSchema: GenerateJobDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
