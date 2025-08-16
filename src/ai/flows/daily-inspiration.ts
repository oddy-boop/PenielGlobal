
'use server';
/**
 * @fileOverview Generates daily inspirational content.
 *
 * - getDailyInspiration - A function that generates an inspirational prompt.
 * - DailyInspirationInput - The input type for the getDailyInspiration function.
 * - DailyInspirationOutput - The return type for the getDailyInspiration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyInspirationInputSchema = z.object({});
export type DailyInspirationInput = z.infer<typeof DailyInspirationInputSchema>;

const DailyInspirationOutputSchema = z.object({
  prompt: z.string().describe('A short, uplifting prompt for prayer, reflection, or devotion, suitable for a church-going audience. It should be thoughtful and encouraging.'),
});
export type DailyInspirationOutput = z.infer<typeof DailyInspirationOutputSchema>;

export async function getDailyInspiration(input: DailyInspirationInput): Promise<DailyInspirationOutput> {
  return dailyInspirationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyInspirationPrompt',
  input: {schema: DailyInspirationInputSchema},
  output: {schema: DailyInspirationOutputSchema},
  prompt: `You are a gentle and wise spiritual guide. 
  
  Please generate a single, concise, and uplifting prompt for daily reflection, suitable for a general Christian audience.
  
  The prompt should inspire a moment of prayer, thoughtful contemplation, or a simple act of faith. 
  
  Avoid complex theological jargon and focus on themes of gratitude, guidance, peace, strength, and service.
  
  Here are some examples of the tone and style you should aim for:
  - "Reflect on a moment today when you felt grateful."
  - "Ask for guidance in a challenging situation you are facing."
  - "Offer a prayer of gratitude for the blessings in your life."
  - "Consider how you can be a source of comfort to someone in need today."
  
  Now, generate a new prompt.`,
});

const dailyInspirationFlow = ai.defineFlow(
  {
    name: 'dailyInspirationFlow',
    inputSchema: DailyInspirationInputSchema,
    outputSchema: DailyInspirationOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
