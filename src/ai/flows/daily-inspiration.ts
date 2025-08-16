// This file holds the Genkit flow for providing daily inspirational prayer or devotional prompts.
'use server';

/**
 * @fileOverview Provides a personalized daily prayer or devotional prompt.
 *
 * - getDailyInspiration - A function that returns a daily prayer or devotional prompt.
 * - DailyInspirationInput - The input type for the getDailyInspiration function.
 * - DailyInspirationOutput - The return type for the getDailyInspiration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyInspirationInputSchema = z.object({
  userHistory: z
    .string()
    .optional()
    .describe('A summary of the user history and past interactions.'),
});
export type DailyInspirationInput = z.infer<typeof DailyInspirationInputSchema>;

const DailyInspirationOutputSchema = z.object({
  prompt: z.string().describe('A personalized prayer or devotional prompt.'),
});
export type DailyInspirationOutput = z.infer<typeof DailyInspirationOutputSchema>;

export async function getDailyInspiration(input: DailyInspirationInput): Promise<DailyInspirationOutput> {
  return dailyInspirationFlow(input);
}

const prayerPrompts = [
  'Reflect on a moment today when you felt grateful.',
  'Ask for guidance in a challenging situation you are facing.',
  'Offer a prayer of gratitude for the blessings in your life.',
  'Pray for peace and healing for those who are suffering.',
  'Seek strength to overcome temptation and make positive choices.',
];

const devotionalPrompts = [
  'Read a passage from scripture and reflect on its meaning.',
  'Consider how you can apply the teachings of your faith to your daily life.',
  'Spend time in quiet contemplation and listen for God’s voice.',
  'Journal about your spiritual journey and the lessons you are learning.',
  'Engage in an act of service to others as an expression of your faith.',
];

const choosePromptTool = ai.defineTool({
  name: 'choosePrompt',
  description: 'Chooses an appropriate prayer or devotional prompt based on user history.',
  inputSchema: z.object({
    userHistory: z
      .string()
      .optional()
      .describe('A summary of the user history and past interactions.'),
  }),
  outputSchema: z.string(),
}, async (input) => {
  // Simple logic to choose a prompt, can be enhanced with more sophisticated reasoning.
  if (input.userHistory?.includes('challenging situation')) {
    return prayerPrompts[1];
  } else if (input.userHistory?.includes('grateful')) {
    return prayerPrompts[0];
  } else {
    // Return a random prompt if no specific history is found.
    const allPrompts = [...prayerPrompts, ...devotionalPrompts];
    return allPrompts[Math.floor(Math.random() * allPrompts.length)];
  }
});

const dailyInspirationPrompt = ai.definePrompt({
  name: 'dailyInspirationPrompt',
  tools: [choosePromptTool],
  input: {schema: DailyInspirationInputSchema},
  output: {schema: DailyInspirationOutputSchema},
  prompt: `Based on the user's past interactions: {{{userHistory}}}, provide a personalized prayer or devotional prompt using the choosePrompt tool. Return just the chosen prompt.`,
});

const dailyInspirationFlow = ai.defineFlow(
  {
    name: 'dailyInspirationFlow',
    inputSchema: DailyInspirationInputSchema,
    outputSchema: DailyInspirationOutputSchema,
  },
  async input => {
    const {output} = await dailyInspirationPrompt(input);
    return output!;
  }
);
