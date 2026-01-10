import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();

const password = process.env.SUPABASE_DB_PASSWORD || "pushpal2004";
const connectionString = `postgresql://postgres.mwtzmkqgflwovdopmwgo:${password}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`;

const sql = postgres(connectionString);

async function checkOpportunities() {
    console.log("Checking opportunities table...");
    try {
        const opportunities = await sql`SELECT id, title, slug FROM job_posts LIMIT 10`;
        console.log("Opportunities:", JSON.stringify(opportunities, null, 2));
    } catch (error) {
        console.error("Error checking opportunities:", error);
    } finally {
        await sql.end();
    }
}

checkOpportunities();
