import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();

const password = process.env.SUPABASE_DB_PASSWORD || "pushpal2004";
const connectionString = `postgresql://postgres.mwtzmkqgflwovdopmwgo:${password}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`;

const sql = postgres(connectionString);

async function disableRLS() {
    console.log("Disabling RLS on all tables...");
    try {
        const tables = [
            "profiles", "categories", "services", "orders", "order_items",
            "leads", "cart_items", "notifications", "tickets", "documents",
            "audit_logs", "subscription_plans", "user_subscriptions", "site_content",
            "companies", "company_subscriptions", "job_posts", "job_post_payments",
            "job_applications", "saved_jobs", "saved_companies", "cv_download_logs"
        ];

        for (const table of tables) {
            console.log(`Disabling RLS for ${table}...`);
            await sql`ALTER TABLE ${sql(table)} DISABLE ROW LEVEL SECURITY`;
        }

        console.log("RLS disabled successfully on all tables.");
    } catch (error) {
        console.error("Error disabling RLS:", error);
    } finally {
        await sql.end();
    }
}

disableRLS();
