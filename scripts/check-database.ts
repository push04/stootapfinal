import { supabaseServer } from "../server/supabase-server";

/**
 * Diagnostic script to check database connectivity and configuration
 */
async function checkDatabase() {
  console.log("🔍 Checking Database Configuration...\n");
  
  // 1. Check environment variables
  console.log("📋 Environment Variables:");
  console.log("  SUPABASE_URL:", process.env.SUPABASE_URL || "NOT SET (using fallback)");
  console.log("  SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY ? "✓ SET" : "NOT SET (using fallback)");
  console.log("  DATABASE_URL:", process.env.DATABASE_URL || "NOT SET");
  console.log("  SESSION_SECRET:", process.env.SESSION_SECRET ? "✓ SET" : "❌ NOT SET");
  console.log("");

  // 2. Test database connection
  console.log("🔌 Testing Database Connection...");
  try {
    const { data, error } = await supabaseServer.from("profiles").select("count");
    
    if (error) {
      console.log("❌ Connection Error:", error.message);
      return false;
    }
    
    console.log("✅ Database connection successful!");
    console.log("");
  } catch (err: any) {
    console.log("❌ Connection failed:", err.message);
    return false;
  }

  // 3. Check tables exist
  console.log("📊 Checking Database Tables...");
  const tables = [
    "profiles",
    "categories", 
    "services",
    "orders",
    "order_items",
    "leads",
    "cart_items",
    "companies",
    "job_posts",
    "job_applications"
  ];

  for (const table of tables) {
    try {
      const { count, error } = await supabaseServer
        .from(table)
        .select("*", { count: "exact", head: true });
      
      if (error) {
        console.log(`  ❌ ${table}: Error - ${error.message}`);
      } else {
        console.log(`  ✅ ${table}: ${count ?? 0} rows`);
      }
    } catch (err: any) {
      console.log(`  ❌ ${table}: ${err.message}`);
    }
  }
  console.log("");

  // 4. Check for seed data
  console.log("🌱 Checking Seed Data...");
  
  const { data: categories, error: catError } = await supabaseServer
    .from("categories")
    .select("*")
    .limit(5);
  
  if (catError) {
    console.log("  ❌ Cannot fetch categories:", catError.message);
  } else {
    console.log(`  Categories: ${categories?.length || 0} found`);
    if (categories && categories.length > 0) {
      categories.forEach((c: any) => {
        console.log(`    - ${c.name} (${c.slug})`);
      });
    } else {
      console.log("  ⚠️  No categories found. Run: npm run db:seed");
    }
  }

  const { data: services, error: svcError } = await supabaseServer
    .from("services")
    .select("*")
    .limit(5);
  
  if (svcError) {
    console.log("  ❌ Cannot fetch services:", svcError.message);
  } else {
    console.log(`  Services: ${services?.length || 0} found`);
    if (services && services.length > 0) {
      services.forEach((s: any) => {
        console.log(`    - ${s.name} (₹${s.base_price_inr})`);
      });
    } else {
      console.log("  ⚠️  No services found. Run: npm run db:seed");
    }
  }

  console.log("\n✅ Database Check Complete!");
  return true;
}

// Run the check
checkDatabase()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
