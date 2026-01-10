// Test database connection script
import "dotenv/config";
import postgres from "postgres";

const connStr = process.env.DATABASE_URL;
console.log("Testing connection with:", connStr?.substring(0, 60) + "...");

if (!connStr) {
    console.error("No DATABASE_URL set!");
    process.exit(1);
}

try {
    const sql = postgres(connStr, {
        ssl: { rejectUnauthorized: false },
        max: 1,
        connect_timeout: 30,
    });

    console.log("Client created, testing query...");

    sql`SELECT 1 as test`
        .then((result) => {
            console.log("SUCCESS! Database connection works:", result);
            process.exit(0);
        })
        .catch((err) => {
            console.error("Query failed:", err.code, err.message);
            process.exit(1);
        });
} catch (error: any) {
    console.error("Client creation failed:", error.message);
    process.exit(1);
}
