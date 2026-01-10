import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";
import * as schema from "@shared/schema";

// Lazy initialization state
let _db: PostgresJsDatabase<typeof schema> | null = null;
let _queryClient: ReturnType<typeof postgres> | null = null;
let _initError: Error | null = null;
let _initialized = false;

function getDatabaseConnectionString(): string | null {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePassword = process.env.SUPABASE_DB_PASSWORD;

  if (supabaseUrl && supabasePassword) {
    const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
    const encodedPassword = encodeURIComponent(supabasePassword);
    return `postgresql://postgres:${encodedPassword}@db.${projectRef}.supabase.co:5432/postgres`;
  }

  return null;
}

// Initialize db on first access
function initDb(): PostgresJsDatabase<typeof schema> {
  if (_db !== null) return _db;

  if (_initError !== null) {
    throw _initError;
  }

  const connectionString = getDatabaseConnectionString();

  if (!connectionString) {
    console.warn("[DB] No database connection configured");
    _initError = new Error("No database connection configured");
    throw _initError;
  }

  try {
    console.log("[DB] Initializing database connection...");
    _queryClient = postgres(connectionString, {
      prepare: false,
      ssl: { rejectUnauthorized: false },
      max: 3,
      idle_timeout: 20,
      connect_timeout: 30,
    });

    _db = drizzle(_queryClient, { schema });
    _initialized = true;
    console.log("[DB] Database connection ready");
    return _db;
  } catch (error: any) {
    console.error("[DB] Connection failed:", error.message);
    _initError = error;
    throw error;
  }
}

// Proxy for lazy initialization
const dbHandler: ProxyHandler<object> = {
  get(_target, prop) {
    const realDb = initDb();
    const value = (realDb as any)[prop];
    if (typeof value === 'function') {
      return value.bind(realDb);
    }
    return value;
  }
};

export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, dbHandler);

export function isDatabaseAvailable(): boolean {
  return _initialized;
}

export function getQueryClient() {
  if (!_initialized) initDb();
  return _queryClient;
}

export { _queryClient as queryClient };
