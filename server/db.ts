import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePassword = process.env.SUPABASE_DB_PASSWORD;

if (!supabaseUrl || !supabasePassword) {
  throw new Error("SUPABASE_URL and SUPABASE_DB_PASSWORD must be provided");
}

// Extract project ref from URL for constructing direct connection string
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');

// Construct connection string properly
// Use direct connection for reliability
const connectionString = process.env.DATABASE_URL || `postgresql://postgres:${supabasePassword}@db.${projectRef}.supabase.co:5432/postgres`;

// Initialize postgres client
const client = postgres(connectionString, { prepare: false });

// Initialize Drizzle
export const db = drizzle(client);

// For compatibility if needed elsewhere
export const queryClient = client;
