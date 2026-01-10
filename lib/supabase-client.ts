import { createClient } from "@supabase/supabase-js";

// Get environment variables with proper Vite prefixes, with fallbacks
const fallbackUrl = "https://mwtzmkqgflwovdopmwgo.supabase.co";
const fallbackKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dHpta3FnZmx3b3Zkb3Btd2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MDgwNDIsImV4cCI6MjA3NzQ4NDA0Mn0.kEmprltpOnLvOaT53AUf3TlZaOmE19u21edEtRpflG8";

let supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || fallbackUrl;
let supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || fallbackKey;

// Sanitize values - remove comments/tables, use fallback if result is empty
supabaseUrl = (supabaseUrl.split('#')[0].split('|')[0].trim() || fallbackUrl);
supabaseAnonKey = (supabaseAnonKey.split('#')[0].split('|')[0].trim() || fallbackKey);

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
