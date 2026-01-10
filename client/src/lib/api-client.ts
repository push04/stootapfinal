import { supabase } from "./supabase-client";

/**
 * Fetch wrapper that automatically adds Supabase auth token to requests
 */
import { supabase } from "./supabase-client";

/**
 * Fetch wrapper that automatically adds Supabase auth token to requests
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Get the current session
  const { data: { session } } = await supabase.auth.getSession();

  // Prepare headers
  const headers = new Headers(options.headers || {});

  // Set default Content-Type to application/json if there's a body and it's not set
  if (options.body && !headers.has("Content-Type") && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  } else if (!headers.has("Content-Type") && !options.body) {
    // Some endpoints expect Content-Type even for GETs (though rare, it doesn't hurt)
    headers.set("Content-Type", "application/json");
  }

  // Add authorization header if we have a session
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }

  // Make the fetch request
  return fetch(url, {
    ...options,
    headers,
  });
}
