// Minimal test to find what's failing
console.log("Step 1: Starting imports...");

import "dotenv/config";
console.log("Step 2: dotenv loaded");

console.log("Step 3: Trying to import storage...");
import { storage } from "./storage";
console.log("Step 4: storage imported successfully");

console.log("Step 5: Trying storage operation...");
storage.getAllCategories().then(cats => {
    console.log("Step 6: Categories fetched:", cats.length);
    process.exit(0);
}).catch(err => {
    console.log("Step 6 FAILED:", err.message);
    process.exit(1);
});
