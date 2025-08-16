"use server";

import type { DailyInspirationOutput } from "@/ai/flows/daily-inspiration";

// This is a list of manually curated prompts that can be updated by an admin.
const inspirations = [
  "Reflect on a moment today when you felt grateful.",
  "Ask for guidance in a challenging situation you are facing.",
  "Offer a prayer of gratitude for the blessings in your life.",
  "Pray for peace and healing for those who are suffering.",
  "Seek strength to overcome temptation and make positive choices.",
  "Read a passage from scripture and reflect on its meaning.",
  "Consider how you can apply the teachings of your faith to your daily life.",
  "Spend time in quiet contemplation and listen for God’s voice.",
  "Journal about your spiritual journey and the lessons you are learning.",
  "Engage in an act of service to others as an expression of your faith.",
];

// This server action provides a secure way for the client to request a daily inspiration prompt.
// It now selects a random prompt from the manually curated list.
export async function fetchDailyInspiration(): Promise<DailyInspirationOutput | { error: string }> {
  try {
    const prompt = inspirations[Math.floor(Math.random() * inspirations.length)];
    if (!prompt) {
        return { error: 'Failed to get a prompt. Please try again.' };
    }
    return { prompt };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
