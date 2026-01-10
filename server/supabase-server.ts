import { createClient } from "@supabase/supabase-js";

// Supabase server-side clients
// Shared fallback credentials - MUST match client-side configuration
const FALLBACK_URL = "https://wgrfrdwjvmoaoxpdxcfu.supabase.co";
const FALLBACK_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndncmZyZHdqdm1vYW94cGR4Y2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MzIyODQsImV4cCI6MjA4MjQwODI4NH0.6VWXxbSSA8EtlGhEzxgC3wOHrX_h2EssdyVEdECIFPE";

function getSupabaseUrl(): string {
  // Support both Vite (VITE_PUBLIC_*) and Netlify (NEXT_PUBLIC_*) env var conventions
  // Prioritize SUPABASE_URL as it's more reliable
  let url = process.env.SUPABASE_URL ||
    process.env.VITE_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    FALLBACK_URL;

  // Sanitize URL - remove everything after # or | if present (handles comments/tables)
  url = url.split('#')[0].split('|')[0].trim();

  // If sanitization resulted in empty string, use fallback
  return url || FALLBACK_URL;
}

function getAnonKey(): string {
  let key = process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    FALLBACK_ANON_KEY;

  // Sanitize key - remove comments/tables
  key = key.split('#')[0].split('|')[0].trim();

  // If sanitization resulted in empty string, use fallback
  return key || FALLBACK_ANON_KEY;
}

function getServiceRoleKey(): string {
  // Try service role key first, fall back to anon key if not available
  let key = process.env.SUPABASE_SERVICE_ROLE_KEY ||
    getAnonKey();

  // Sanitize key - remove comments/tables
  key = key.split('#')[0].split('|')[0].trim();

  // If sanitization resulted in empty string, use fallback
  return key || FALLBACK_ANON_KEY;
}

// Create a single instance for server-side operations with service role (bypasses RLS)
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

// Create a separate client for auth token verification (uses anon key, respects RLS)
export const supabaseAuth = createClient(
  getSupabaseUrl(),
  getAnonKey(),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
