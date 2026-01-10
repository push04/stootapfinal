
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://mwtzmkqgflwovdopmwgo.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY;

async function testApi() {
    try {
        console.log("Testing Supabase API connection...");
        const supabase = createClient(supabaseUrl, supabaseKey!);
        const { data, error } = await supabase.from('categories').select('*').limit(1);

        if (error) {
            console.error("API connection failed:", error);
            process.exit(1);
        }

        console.log("API connection successful! Found", data?.length, "categories.");
        process.exit(0);
    } catch (error) {
        console.error("API test failed:", error);
        process.exit(1);
    }
}

testApi();
