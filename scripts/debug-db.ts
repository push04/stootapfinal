
import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("🔍 Checking Database Connection...");
    console.log("URL:", process.env.SUPABASE_URL);

    try {
        // 1. Check if we can run a simple query
        const result = await db.execute(sql`SELECT NOW()`);
        console.log("✅ Database Connected. Time:", result[0].now);

        // 2. Check if profiles table exists
        console.log("🔍 Checking profiles table...");
        try {
            const profiles = await db.execute(sql`SELECT count(*) FROM profiles`);
            console.log("✅ Profiles table exists. Count:", profiles[0].count);
        } catch (e: any) {
            console.error("❌ Profiles table query failed:", e.message);
        }

        // 3. Check categories
        console.log("🔍 Checking categories table...");
        try {
            const categories = await db.execute(sql`SELECT count(*) FROM categories`);
            console.log("✅ Categories table exists. Count:", categories[0].count);
        } catch (e: any) {
            console.error("❌ Categories table query failed:", e.message);
        }

        // 4. Check orders
        console.log("🔍 Checking orders table...");
        try {
            const orders = await db.execute(sql`SELECT count(*) FROM orders`);
            console.log("✅ Orders table exists. Count:", orders[0].count);
        } catch (e: any) {
            console.error("❌ Orders table query failed:", e.message);
        }

        // 5. Check notifications
        console.log("🔍 Checking notifications table...");
        try {
            const notifications = await db.execute(sql`SELECT count(*) FROM notifications`);
            console.log("✅ Notifications table exists. Count:", notifications[0].count);
        } catch (e: any) {
            console.error("❌ Notifications table query failed:", e.message);
        }

        // 6. Check leads
        console.log("🔍 Checking leads table...");
        try {
            const leads = await db.execute(sql`SELECT count(*) FROM leads`);
            console.log("✅ Leads table exists. Count:", leads[0].count);
        } catch (e: any) {
            console.error("❌ Leads table query failed:", e.message);
        }

        process.exit(0);
    } catch (error: any) {
        console.error("❌ Critical DB Error:", error.message);
        console.error(error);
        process.exit(1);
    }
}

main();
