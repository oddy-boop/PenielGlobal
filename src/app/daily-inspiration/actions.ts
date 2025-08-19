
"use server";

import { supabase } from "@/lib/supabaseClient";
import type { Inspiration } from "@/lib/types";

export async function fetchAllInspirations(): Promise<{ inspirations: Inspiration[] } | { error: string }> {
  try {
    const { data, error } = await supabase.from('inspirations').select('*');

    if (error) throw error;
    
    return { inspirations: data || [] };

  } catch (e: any)
 {
    console.error(e);
    return { error: 'An unexpected error occurred: ' + e.message };
  }
}
