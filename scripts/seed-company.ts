
import { db } from "../server/db";
import { companies, profiles } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seedCompany() {
    console.log("Checking for profiles...");
    const allProfiles = await db.select().from(profiles);

    if (allProfiles.length === 0) {
        console.log("No profiles found. Please login to the app first to create a profile.");
        process.exit(1);
    }

    const user = allProfiles[0];
    console.log(`Found user: ${user.email} (${user.id})`);

    // Update role to company
    await db.update(profiles).set({ role: "company" }).where(eq(profiles.id, user.id));
    console.log("Updated user role to 'company'");

    // Check if company exists
    const existingCompany = await db.select().from(companies).where(eq(companies.userId, user.id));

    if (existingCompany.length > 0) {
        console.log("Company already exists for this user.");
    } else {
        console.log("Creating test company...");
        await db.insert(companies).values({
            userId: user.id,
            companyName: "Test Company Inc.",
            contactName: user.fullName || "Test User",
            contactEmail: user.email,
            businessType: "Technology",
            companyDescription: "A test company for debugging.",
            verified: true,
            status: "active",
            trialStartDate: new Date(),
            trialEndDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        } as any);
        console.log("Test company created!");
    }

    console.log("Seeding complete. Refresh the dashboard.");
    process.exit(0);
}

seedCompany().catch((err) => {
    console.error("Error seeding company:", err);
    process.exit(1);
});
