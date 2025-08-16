
"use server";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Logs an activity to the 'activity_logs' collection in Firestore.
 * @param action - A short description of the action (e.g., "Created Event").
 * @param details - More specific details about the action (e.g., the title of the event).
 */
export async function logActivity(action: string, details: string): Promise<void> {
  try {
    await addDoc(collection(db, "activity_logs"), {
      action,
      details,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    // Depending on requirements, you might want to handle this error more gracefully
  }
}
