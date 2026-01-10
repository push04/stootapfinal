import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

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
    // Return a dummy value if env vars are missing to valid types during build
    // But this will fail at runtime if not set
    if (process.env.NODE_ENV === "production") {
      throw new Error("Either DATABASE_URL or SUPABASE_URL + SUPABASE_DB_PASSWORD must be provided");
    }
    return "postgresql://postgres:postgres@localhost:5432/postgres";
  }

  // Extract project ref from URL
  const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');

  // Use direct connection for reliability
  return `postgresql://postgres:${supabasePassword}@db.${projectRef}.supabase.co:5432/postgres`;
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
