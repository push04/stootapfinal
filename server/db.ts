import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "@shared/schema";
import ws from "ws";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
export const db = drizzle({ client: pool, schema });

const sql = neon(connectionString);
export const queryClient = drizzle({ client: sql, schema });
