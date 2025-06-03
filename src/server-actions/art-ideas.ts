
'use server';

import { generateArtIdea as generateArtIdeaFlow, type GenerateArtIdeaInput, type GenerateArtIdeaOutput } from '@/ai/flows/generate-art-idea-flow';

export async function generateArtIdeaAction(input: GenerateArtIdeaInput): Promise<GenerateArtIdeaOutput | { error: string }> {
  try {
    const result = await generateArtIdeaFlow(input);
    return result;
  } catch (error) {
    console.error("Error generating art idea:", error);
    if (error instanceof Error) {
      return { error: `Failed to generate art idea: ${error.message}` };
    }
    return { error: "An unknown error occurred while generating the art idea." };
  }
}
