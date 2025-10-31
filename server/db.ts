import { drizzle as drizzleNeonServerless } from "drizzle-orm/neon-serverless";
import { drizzle as drizzleNeonHttp } from "drizzle-orm/neon-http";
import { Pool, neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "@shared/schema";
import ws from "ws";

// Build Supabase connection string from environment variables
function getConnectionString(): string {
  // First check if DATABASE_URL is provided directly
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Otherwise, build from Supabase credentials
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePassword = process.env.SUPABASE_DB_PASSWORD;

  if (!supabaseUrl || !supabasePassword) {
    throw new Error("Either DATABASE_URL or SUPABASE_URL + SUPABASE_DB_PASSWORD must be provided");
  }

  // Extract project ref from URL (e.g., https://mwtzmkqgflwovdopmwgo.supabase.co -> mwtzmkqgflwovdopmwgo)
  const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
  
  // Use Supabase pooler connection string for better performance with serverless
  // Format: postgresql://postgres.{project_ref}:{password}@aws-0-{region}.pooler.supabase.com:6543/postgres
  // Note: We'll use direct connection for simplicity. For production pooler is recommended.
  return `postgresql://postgres.${projectRef}:${supabasePassword}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`;
}

const connectionString = getConnectionString();

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString });
export const db = drizzleNeonServerless({ client: pool, schema });

const sql = neon(connectionString);
export const queryClient = drizzleNeonHttp({ client: sql, schema });
