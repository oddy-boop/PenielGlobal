
"use client";

import { supabase } from './supabaseClient';
import type { ActivityLog } from './types';

/**
 * Logs an activity to the Supabase 'activity_logs' table.
 * @param action - A short description of the action (e.g., "Created Event").
 * @param details - More specific details about the action (e.g., the title of the event).
 */
export async function logActivity(action: string, details: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert([{ action, details }]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error logging activity to Supabase:", error);
  }
}
