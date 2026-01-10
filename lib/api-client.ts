import { supabase } from "./supabase-client";

/**
 * Fetch wrapper that automatically adds Supabase auth token to requests
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Get the current session
  const { data: { session } } = await supabase.auth.getSession();
  
  // Prepare headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add authorization header if we have a session
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  // Make the fetch request
  return fetch(url, {
    ...options,
    headers,
  });
}
