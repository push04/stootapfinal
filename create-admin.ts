
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://mwtzmkqgflwovdopmwgo.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY;

async function createAdmin() {
    try {
        const supabase = createClient(supabaseUrl, supabaseKey!);

        // Check if admin already exists
        const { data: existing } = await supabase.from('profiles').select('*').eq('email', 'admin@stootap.com').single();
        if (existing) {
            console.log("Admin user already exists.");
            process.exit(0);
        }

        const { data, error } = await supabase.from('profiles').insert([
            {
                full_name: "Admin User",
                email: "admin@stootap.com",
                role: "admin"
            }
        ]).select();

        if (error) {
            console.error("API error:", error);
            process.exit(1);
        }

        console.log("Admin user created successfully:", data);
        process.exit(0);
    } catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
}

createAdmin();
