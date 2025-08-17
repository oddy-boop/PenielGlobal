
"use server";

import { supabase } from "@/lib/supabaseClient";
import type { Inspiration } from "@/lib/types";

export async function fetchDailyInspiration(): Promise<{ inspiration: Inspiration } | { error: string }> {
  try {
    const { data, error } = await supabase.from('inspirations').select('*');

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { inspiration: { 
        id: 0, 
        type: 'text', 
        prompt: "No inspirational messages have been added yet.",
        image_url: null,
        created_at: new Date().toISOString()
      }};
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    const randomInspiration = data[randomIndex] as Inspiration;
    
    return { inspiration: randomInspiration };

  } catch (e: any) {
    console.error(e);
    return { error: 'An unexpected error occurred: ' + e.message };
  }
}
