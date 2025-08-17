
"use server";

import { supabase } from "@/lib/supabaseClient";

interface Inspiration {
  prompt: string;
}

export async function fetchDailyInspiration(): Promise<{ prompt: string } | { error: string }> {
  try {
    // Fetch all prompts from the database
    const { data, error } = await supabase.from('inspirations').select('prompt');

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { prompt: "No inspirational messages have been added yet. Please check back later." };
    }

    // Select one at random
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomInspiration = data[randomIndex] as Inspiration;
    
    return { prompt: randomInspiration.prompt };

  } catch (e: any) {
    console.error(e);
    return { error: 'An unexpected error occurred: ' + e.message };
  }
}
