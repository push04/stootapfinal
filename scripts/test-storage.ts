
import "dotenv/config";
import { storage } from "../server/storage";
import { db } from "../server/db";
import { sql } from "drizzle-orm";
import { profiles } from "../shared/schema";

async function main() {
    console.log("Testing storage layer...");

    // Debug 1: Simple check
    console.log("Profiles Import:", typeof profiles);

    const fs = await import('fs');
    fs.writeFileSync('test_results.txt', "Starting Tests\n");

    try {
        // Test 1: Unquoted
        console.log("Testing Unquoted 'profiles'...");
        await db.execute(sql`SELECT count(*) FROM profiles`);
        console.log("✅ Unquoted SUCCESS");
        fs.appendFileSync('test_results.txt', "Unquoted: SUCCESS\n");
    } catch (err: any) {
        console.error("❌ Unquoted FAILED:", err.message);
        fs.appendFileSync('test_results.txt', `Unquoted: FAILED (${err.message})\n`);
    }

    try {
        // Test 2: Quoted
        console.log("Testing Quoted \"profiles\"...");
        await db.execute(sql`SELECT count(*) FROM "profiles"`);
        console.log("✅ Quoted SUCCESS");
        fs.appendFileSync('test_results.txt', "Quoted: SUCCESS\n");
    } catch (err: any) {
        console.error("❌ Quoted FAILED:", err.message);
        fs.appendFileSync('test_results.txt', `Quoted: FAILED (${err.message})\n`);
    }

    try {
        // Test 3: Public Schema Qualified
        console.log("Testing Public Quoted \"public\".\"profiles\"...");
        await db.execute(sql`SELECT count(*) FROM "public"."profiles"`);
        console.log("✅ Public Quoted SUCCESS");
        fs.appendFileSync('test_results.txt', "Public: SUCCESS\n");
    } catch (err: any) {
        console.error("❌ Public Quoted FAILED:", err.message);
        fs.appendFileSync('test_results.txt', `Public: FAILED (${err.message})\n`);
    }

    try {
        // Debug 3: Generated SQL
        const q = db.select().from(profiles).toSQL();
        fs.writeFileSync('sql_debug.txt', JSON.stringify(q, null, 2));
        console.log("Generated SQL written to sql_debug.txt");

        // 1. Test getProfile with a random UUID
        const randomId = "00000000-0000-0000-0000-000000000000";
        console.log(`Fetching non-existent profile ${randomId}...`);
        const p = await storage.getProfile(randomId);
        console.log("Profile result (should be undefined):", p);

        // ... (rest of test)


        // 2. Test createProfile
        const testId = "123e4567-e89b-12d3-a456-426614174000"; // Valid UUID
        const testEmail = `test-${Date.now()}@example.com`;

        console.log(`Creating dummy profile for ${testEmail}...`);

        // Check if exists first to clean up if needed (though random email helps)
        const check = await storage.getProfileByEmail(testEmail);
        if (check) {
            console.log("Profile already exists.");
        } else {
            const newP = await storage.createProfile({
                id: testId,
                fullName: "Test User",
                email: testEmail,
                role: "business",
                phone: "1234567890"
            });
            console.log("✅ Created Profile:", newP);
        }

    } catch (e: any) {
        console.error("❌ Storage Test Error (Writing to error.json):");
        const fs = await import('fs');
        fs.writeFileSync('error.json', JSON.stringify(e, null, 2));
        console.error(e.message);
    }
    process.exit(0);
}

main();
