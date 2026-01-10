import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.SUPABASE_URL || "https://mwtzmkqgflwovdopmwgo.supabase.co";
const key = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dHpta3FnZmx3b3Zkb3Btd2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MDgwNDIsImV4cCI6MjA3NzQ4NDA0Mn0.kEmprltpOnLvOaT53AUf3TlZaOmE19u21edEtRpflG8";

const supabase = createClient(url, key);

async function test() {
    console.log("Testing profile creation with anon key...");
    const testId = "test-user-" + Date.now();
    const { data, error } = await supabase.from("profiles").insert({
        id: testId,
        full_name: "Test User",
        email: "test@example.com",
        role: "student"
    }).select();

    if (error) {
        console.error("Error creating profile:", error);
    } else {
        console.log("Profile created successfully:", data);
        // Clean up
        await supabase.from("profiles").delete().eq("id", testId);
    }
}

test();
