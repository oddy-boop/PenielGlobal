
"use client";

import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Add your Supabase Project URL and Public Anon Key to your .env file
// Create a .env file at the root of your project if it doesn't exist.
//
// .env file contents:
// NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
// NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLIC_ANON_KEY

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are not defined. Please check your .env file.');
}

// Initialize the Supabase client
// This object will be your single point of interaction with Supabase services.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
