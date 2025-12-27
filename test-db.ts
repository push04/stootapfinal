
import "dotenv/config";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { db } from "./server/db";
import { categories } from "./shared/schema";

async function testConnection() {
    try {
        console.log("Testing database connection...");
        const result = await db.select().from(categories).limit(1);
        console.log("Connection successful! Found", result.length, "categories.");
        process.exit(0);
    } catch (error) {
        console.error("Connection failed:", error);
        process.exit(1);
    }
}

testConnection();
