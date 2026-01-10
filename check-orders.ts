import { supabaseServer } from "./server/supabase-server";

async function checkOrders() {
    const { data: profiles, error: pError } = await supabaseServer
        .from('profiles')
        .select('id, email');

    if (pError) {
        console.error("Error fetching profiles:", pError);
        return;
    }

    console.log("Profiles:", profiles);

    for (const profile of profiles) {
        const { data: orders, error: oError } = await supabaseServer
            .from('orders')
            .select('*')
            .eq('user_id', profile.id);

        if (oError) {
            console.error(`Error fetching orders for ${profile.email}:`, oError);
        } else {
            console.log(`Orders for ${profile.email}:`, orders.length);
            if (orders.length > 0) {
                console.log(orders);
            }
        }
    }
}

checkOrders();
