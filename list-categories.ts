
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://mwtzmkqgflwovdopmwgo.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY;

async function listCategories() {
    try {
        const supabase = createClient(supabaseUrl, supabaseKey!);
        const { data, error } = await supabase.from('categories').select('*');

        if (error) {
            console.error("API error:", error);
            process.exit(1);
        }

        console.log("Categories found:", data?.length);
        console.log(JSON.stringify(data, null, 2));
        process.exit(0);
    } catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
}

listCategories();
