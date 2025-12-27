import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePassword = process.env.SUPABASE_DB_PASSWORD;

if (!supabaseUrl || !supabasePassword) {
  throw new Error("SUPABASE_URL and SUPABASE_DB_PASSWORD must be provided");
}

// Extract project ref from URL for constructing connection string
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');

// URL-encode password to handle special characters like @
const encodedPassword = encodeURIComponent(supabasePassword);

// Use POOLER connection for serverless (Netlify Functions)
// Tokyo region: ap-northeast-1
const connectionString = process.env.DATABASE_URL ||
  `postgresql://postgres.${projectRef}:${encodedPassword}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?sslmode=require`;

// Initialize postgres client with serverless-friendly settings
const client = postgres(connectionString, {
  prepare: false,
  ssl: 'require',
  max: 1, // Limit connections for serverless
  idle_timeout: 20,
  connect_timeout: 10,
});

// Initialize Drizzle
export const db = drizzle(client);

// For compatibility if needed elsewhere
export const queryClient = client;
