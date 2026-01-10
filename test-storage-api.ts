import "dotenv/config";
import { storage } from "./server/storage-db";

async function testStorage() {
    console.log("Testing storage layer with Supabase REST API...");

    try {
        // Test Categories
        console.log("\n--- Testing Categories ---");
        const categories = await storage.getAllCategories();
        console.log(`Found ${categories.length} categories.`);
        if (categories.length > 0) {
            console.log("First category:", categories[0].name);
        }

        // Test Services
        console.log("\n--- Testing Services ---");
        const services = await storage.getAllServices();
        console.log(`Found ${services.length} services.`);
        if (services.length > 0) {
            console.log("First service:", services[0].name);
        }

        // Test Profiles
        console.log("\n--- Testing Profiles ---");
        const profiles = await storage.getAllProfiles();
        console.log(`Found ${profiles.length} profiles.`);

        console.log("\nâœ“ Storage test completed successfully!");
    } catch (error) {
        console.error("\nâœ– Storage test failed:");
        console.error(error);
    }
}

testStorage();
