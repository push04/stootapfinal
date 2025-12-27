
import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("🛠️ Fixing 'profiles' table...");

    try {
        // 1. Drop existing
        console.log("Dropping profiles table if exists...");
        await db.execute(sql.raw('DROP TABLE IF EXISTS "profiles" CASCADE'));
        console.log("✅ Dropped.");

        // 2. Create proper schema
        console.log("Creating 'profiles' table...");
        await db.execute(sql.raw(`
            CREATE TABLE "profiles" (
                "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
                "full_name" text NOT NULL,
                "email" text NOT NULL UNIQUE,
                "phone" text,
                "role" text DEFAULT 'business' NOT NULL,
                "created_at" timestamp DEFAULT now() NOT NULL
            );
        `));
        console.log("✅ Created 'profiles' table.");

        // 3. Verify
        const res = await db.execute(sql`SELECT count(*) FROM profiles`);
        console.log("✅ Verification Count:", res[0].count);

    } catch (e: any) {
        console.error("❌ Fix Failed:", e);
    }
    process.exit(0);
}

main();
