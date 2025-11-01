import { createClient } from "@supabase/supabase-js";

// Get environment variables with proper Vite prefixes, fallback to in-repo credentials
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || "https://nqpvacbctivuqzxqvxyk.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xcHZhY2JjdGl2dXF6eHF2eHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzOTkyNDMsImV4cCI6MjA0NTk3NTI0M30.VaF5k97SJxCjEhXwjZqy3jmQGcWuwuZRq21L0XM4UNs";

// Create Supabase client for browser use with anon key
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);
