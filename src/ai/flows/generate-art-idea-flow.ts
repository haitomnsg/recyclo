
'use server';
/**
 * @fileOverview AI agent for generating art ideas from waste items.
 *
 * - generateArtIdea - A function that handles the art idea generation process.
 * - GenerateArtIdeaInput - The input type for the generateArtIdea function.
 * - GenerateArtIdeaOutput - The return type for the generateArtIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArtIdeaInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a waste item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateArtIdeaInput = z.infer<typeof GenerateArtIdeaInputSchema>;

const GenerateArtIdeaOutputSchema = z.object({
  identifiedItems: z.array(z.string()).describe("A list of waste items identified in the image."),
  artProjectTitle: z.string().describe("A catchy title for the art project."),
  artProjectDescription: z.string().describe("A brief description of how to make the art project from the identified items."),
  youtubeSearchQuery: z.string().describe("A concise YouTube search query to find video tutorials for this or similar art projects."),
});
export type GenerateArtIdeaOutput = z.infer<typeof GenerateArtIdeaOutputSchema>;

export async function generateArtIdea(input: GenerateArtIdeaInput): Promise<GenerateArtIdeaOutput> {
  return generateArtIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArtIdeaPrompt',
  input: {schema: GenerateArtIdeaInputSchema},
  output: {schema: GenerateArtIdeaOutputSchema},
  prompt: `You are a creative assistant specializing in DIY and upcycling projects using waste materials.
Analyze the provided image, which contains one or more waste items.

Your tasks are to:
1. Identify the primary waste item(s) visible in the image. List them in the 'identifiedItems' array.
2. Suggest a specific and creative art, craft, or utility project that can be made from these identified waste item(s). Provide a catchy title for this project in 'artProjectTitle'.
3. Briefly describe the project idea and general steps or concept in 'artProjectDescription'.
4. Generate a concise and effective YouTube search query that would help someone find video tutorials for making this specific project or similar projects using the identified waste items. Put this in 'youtubeSearchQuery'.

Focus on creative and practical reuse.

Waste item photo: {{media url=photoDataUri}}`,
});

const generateArtIdeaFlow = ai.defineFlow(
  {
    name: 'generateArtIdeaFlow',
    inputSchema: GenerateArtIdeaInputSchema,
    outputSchema: GenerateArtIdeaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to get a response from the AI model.");
    }
    return output;
  }
);
