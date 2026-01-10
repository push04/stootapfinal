
import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Starting manual table creation...");
    try {
        // 1. Create table
        console.log("Creating test_manual_table...");
        await db.execute(sql.raw(`
            CREATE TABLE IF NOT EXISTS test_manual_table (
                id serial PRIMARY KEY,
                name text
            );
        `));
        console.log("✅ Created test_manual_table.");

        // 2. Insert
        await db.execute(sql`INSERT INTO test_manual_table (name) VALUES ('test')`);
        console.log("✅ Inserted row.");

        // 3. Select
        const res = await db.execute(sql`SELECT * FROM test_manual_table`);
        console.log("✅ Selected:", res);

        // 4. Drop
        await db.execute(sql`DROP TABLE test_manual_table`);
        console.log("✅ Dropped table.");

    } catch (e: any) {
        console.error("❌ Manual Creation Failed:", e);
    }
    process.exit(0);
}

main();
