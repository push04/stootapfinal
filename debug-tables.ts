import { supabaseServer } from "./server/supabase-server";

async function debugTables() {
    const { data: profiles, error: pError } = await supabaseServer.from('profiles').select('*');
    console.log("Profiles count:", profiles?.length || 0);
    if (profiles && profiles.length > 0) {
        console.log("First profile:", profiles[0]);
    }

    const { data: orders, error: oError } = await supabaseServer.from('orders').select('*');
    console.log("Orders count:", orders?.length || 0);
    if (orders && orders.length > 0) {
        console.log("First order:", orders[0]);
    }
}

debugTables();
