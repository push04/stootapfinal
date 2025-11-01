import { createClient } from "@supabase/supabase-js";

// Supabase server-side client with service role key
// This bypasses RLS and should only be used for admin/backend operations
function getSupabaseUrl(): string {
  // Check for NEXT_PUBLIC_SUPABASE_URL first (Netlify client var), then SUPABASE_URL
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL environment variable is required");
  }
  return url;
}

function getServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY environment variable is required");
  }
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
