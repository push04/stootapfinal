import { defineConfig } from "drizzle-kit";

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

  // Extract project ref from URL
  const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
  
  // Use Supabase pooler connection string
  return `postgresql://postgres.${projectRef}:${supabasePassword}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`;
}

const connectionString = getConnectionString();

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
