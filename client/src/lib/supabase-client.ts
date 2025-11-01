import { createClient } from "@supabase/supabase-js";

// Get environment variables with proper Vite prefixes
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

// Fail fast if credentials are missing - no placeholders
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = `
    ❌ CRITICAL: Missing Supabase credentials!
    
    Required environment variables:
    - VITE_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "✓" : "✗ MISSING"}
    - VITE_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? "✗ MISSING" : "✓"}
    
    Please ensure client/.env.development and client/.env.production files exist with valid credentials.
  `;
  console.error(errorMsg);
  throw new Error("Missing Supabase credentials. Check console for details.");
}

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
