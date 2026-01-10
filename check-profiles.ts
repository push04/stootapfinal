import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();

const password = process.env.SUPABASE_DB_PASSWORD || "pushpal2004";
const connectionString = `postgresql://postgres.mwtzmkqgflwovdopmwgo:${password}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`;

const sql = postgres(connectionString);

async function checkProfiles() {
    console.log("Checking profiles table...");
    try {
        const profiles = await sql`SELECT * FROM profiles ORDER BY created_at DESC LIMIT 5`;
        console.log("Latest profiles:", JSON.stringify(profiles, null, 2));
    } catch (error) {
        console.error("Error checking profiles:", error);
    } finally {
        await sql.end();
    }
}

checkProfiles();
