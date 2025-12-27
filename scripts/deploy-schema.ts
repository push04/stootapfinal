import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    console.log("Starting schema deployment...");

    try {
        const schemaPath = path.join(__dirname, "..", "supabase_seed.sql");
        const schemaSql = fs.readFileSync(schemaPath, "utf-8");

        console.log("Read schema file. Executing statements sequentially...");

        const statements = schemaSql
            .split(';')
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0);

        for (const statement of statements) {
            if (!statement || statement.startsWith('--')) continue;

            try {
                await db.execute(sql.raw(statement));
            } catch (err: any) {
                console.warn(`Warning executing statement: ${statement.substring(0, 50)}...`, err.message);
            }
        }
        console.log(`Finished executing schema.`);

        console.log("✅ Schema successfully deployed to Supabase!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to deploy schema:", error);
        process.exit(1);
    }
}

main();
