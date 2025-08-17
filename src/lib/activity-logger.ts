
"use client";

import type { ActivityLog } from './types';

/**
 * Logs an activity to localStorage.
 * @param action - A short description of the action (e.g., "Created Event").
 * @param details - More specific details about the action (e.g., the title of the event).
 */
export function logActivity(action: string, details: string): void {
  try {
    const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    const updatedLogs = [newLog, ...logs].slice(0, 20); // Keep last 20 logs
    localStorage.setItem('activity_logs', JSON.stringify(updatedLogs));
  } catch (error) {
    console.error("Error logging activity to localStorage:", error);
  }
}
