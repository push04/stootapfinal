import { createClient } from "@supabase/supabase-js";

// Supabase server-side client with service role key
// This bypasses RLS and should only be used for admin/backend operations
function getSupabaseUrl(): string {
  // Support both Vite (VITE_PUBLIC_*) and Netlify (NEXT_PUBLIC_*) env var conventions
  const url = process.env.VITE_PUBLIC_SUPABASE_URL || 
              process.env.NEXT_PUBLIC_SUPABASE_URL || 
              process.env.SUPABASE_URL ||
              "https://nqpvacbctivuqzxqvxyk.supabase.co"; // Fallback to in-repo credential
  return url;
}

function getServiceRoleKey(): string {
  // Try service role key first, fall back to anon key if not available
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 
              process.env.SUPABASE_ANON_KEY ||
              process.env.VITE_PUBLIC_SUPABASE_ANON_KEY ||
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xcHZhY2JjdGl2dXF6eHF2eHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzOTkyNDMsImV4cCI6MjA0NTk3NTI0M30.VaF5k97SJxCjEhXwjZqy3jmQGcWuwuZRq21L0XM4UNs"; // Fallback to in-repo credential
  
  // Use the key as-is (works for both service role and anon key)
  return key;
}

// Create a single instance for server-side operations
export const supabaseServer = createClient(
  getSupabaseUrl(),
  getServiceRoleKey(),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
