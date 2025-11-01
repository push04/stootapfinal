import { createClient } from "@supabase/supabase-js";

// Get environment variables with proper Vite prefixes
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

// For development: Use placeholder values if environment variables are not set
// The backend handles all Supabase operations, so this is mainly for auth
const url = supabaseUrl || "https://placeholder.supabase.co";
const key = supabaseAnonKey || "placeholder_key";

// Create Supabase client for browser use with anon key
export const supabase = createClient(
  url,
  key,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
