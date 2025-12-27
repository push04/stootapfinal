import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Client Configuration for Browser
 * 
 * Uses environment variables if available, falls back to hardcoded credentials for development
 */

// Hardcoded fallbacks for development (can be overridden by environment variables)
const fallbackUrl = "https://mwtzmkqgflwovdopmwgo.supabase.co";
const fallbackKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dHpta3FnZmx3b3Zkb3Btd2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MDgwNDIsImV4cCI6MjA3NzQ4NDA0Mn0.kEmprltpOnLvOaT53AUf3TlZaOmE19u21edEtRpflG8";

// Get environment variables with fallbacks
let supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || fallbackUrl;
let supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || fallbackKey;

// Sanitize values - remove comments, extra whitespace, and accidental table separators
const cleanUrl = supabaseUrl?.split('#')[0].split('|')[0].trim() || fallbackUrl;
const cleanKey = supabaseAnonKey?.split('#')[0].split('|')[0].trim() || fallbackKey;

// Additional validation
if (cleanUrl && !cleanUrl.startsWith('https://')) {
  console.error('⚠️  SUPABASE_URL must start with https://');
}

if (cleanKey && cleanKey.length < 100) {
  console.error('⚠️  SUPABASE_ANON_KEY appears to be invalid (too short)');
}

// Log configuration status (hide sensitive parts)
if (import.meta.env.DEV) {
  const usingFallback = cleanUrl === fallbackUrl;
  console.log('🔧 Supabase Client Configuration:', {
    url: cleanUrl ? `${cleanUrl.substring(0, 30)}...` : '❌ MISSING',
    keyConfigured: cleanKey ? '✅ Set' : '❌ MISSING',
    environment: import.meta.env.MODE,
    usingFallbackCredentials: usingFallback,
  });
}

// Create Supabase client for browser use with anon key
export const supabase = createClient(
  cleanUrl,
  cleanKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Use localStorage for session persistence
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      // Set flow type to implicit for better compatibility with Netlify
      flowType: 'implicit',
    },
    // Add global options for better error handling
    global: {
      headers: {
        'X-Client-Info': 'stootap-web',
      },
    },
  }
);
