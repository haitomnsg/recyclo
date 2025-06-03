'use server';

import { classifyWaste as classifyWasteFlow, type ClassifyWasteInput, type ClassifyWasteOutput } from '@/ai/flows/classify-waste';

export async function classifyWasteItemAction(input: ClassifyWasteInput): Promise<ClassifyWasteOutput | { error: string }> {
  try {
    // Input validation can be done here using Zod if needed,
    // but classifyWasteFlow inputSchema already handles it.
    const result = await classifyWasteFlow(input);
    return result;
  } catch (error) {
    console.error("Error classifying waste item:", error);
    // Check if error is an instance of Error to safely access message
    if (error instanceof Error) {
      return { error: `Failed to classify waste item: ${error.message}` };
    }
    return { error: "An unknown error occurred during waste classification." };
  }
}
