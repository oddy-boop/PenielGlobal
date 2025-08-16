
"use server";

import { getDailyInspiration } from "@/ai/flows/daily-inspiration";
import type { DailyInspirationOutput } from "@/ai/flows/daily-inspiration";

// This server action provides a secure way for the client to request a daily inspiration prompt.
// It now calls the Genkit flow to generate a prompt.
export async function fetchDailyInspiration(): Promise<DailyInspirationOutput | { error: string }> {
  try {
    const result = await getDailyInspiration({});
    if (!result || !result.prompt) {
        return { error: 'Failed to get an inspiration. Please try again.' };
    }
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
