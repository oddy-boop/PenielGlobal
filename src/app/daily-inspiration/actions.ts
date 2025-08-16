"use server";

import { getDailyInspiration } from "@/ai/flows/daily-inspiration";
import type { DailyInspirationOutput } from "@/ai/flows/daily-inspiration";

// This server action provides a secure way for the client to request a daily inspiration prompt.
// It calls the underlying Genkit flow without exposing any implementation details to the client.
export async function fetchDailyInspiration(): Promise<DailyInspirationOutput | { error: string }> {
  try {
    // We pass an empty object as we are not using user history in this implementation.
    const inspiration = await getDailyInspiration({});
    if (!inspiration || !inspiration.prompt) {
        return { error: 'Failed to generate a prompt. Please try again.' };
    }
    return inspiration;
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
