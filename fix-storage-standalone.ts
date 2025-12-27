import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";
import { sql } from "drizzle-orm";

// Load environment variables
dotenv.config();

// Configure Neon to use WebSocket
neonConfig.webSocketConstructor = ws;

async function fixStorage() {
    console.log("Starting Supabase Storage fix (Standalone)...");

    // Build connection string
    let connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabasePassword = process.env.SUPABASE_DB_PASSWORD;
        if (!supabaseUrl || !supabasePassword) {
            console.error("❌ Missing credentials in .env");
            process.exit(1);
        }
        const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
        connectionString = `postgresql://postgres.${projectRef}:${supabasePassword}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`;
    }

    console.log("Connecting to database...");
    const pool = new Pool({ connectionString });
    const db = drizzle(pool);

    try {
        // 1. Check if 'cvs' bucket exists
        console.log("Checking for 'cvs' bucket...");
        const bucketCheck = await db.execute(sql`
      SELECT id FROM storage.buckets WHERE id = 'cvs'
    `);

        if (bucketCheck.rows.length === 0) {
            console.log("Bucket 'cvs' not found. Creating...");
            await db.execute(sql`
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
          'cvs',
          'cvs',
          true,
          5242880,
          ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        );
      `);
            console.log("✅ Bucket 'cvs' created successfully.");
        } else {
            console.log("✅ Bucket 'cvs' already exists.");
        }

        // 2. Apply RLS Policies
        console.log("Configuring access policies...");

        // Policy: Public Read
        await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE tablename = 'objects' AND policyname = 'Public can read CVs'
        ) THEN
          CREATE POLICY "Public can read CVs" ON storage.objects FOR SELECT TO public USING (bucket_id = 'cvs');
        END IF;
      END
      $$;
    `);
        console.log("✅ Public read policy applied.");

        // Policy: Authenticated Upload
        await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE tablename = 'objects' AND policyname = 'Authenticated users can upload CVs'
        ) THEN
          CREATE POLICY "Authenticated users can upload CVs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cvs');
        END IF;
      END
      $$;
    `);
        console.log("✅ Authenticated upload policy applied.");

        // Policy: Users can delete their own files
        try {
            await db.execute(sql`
        DO $$
        BEGIN
            IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'objects' AND policyname = 'Users can delete their own CVs'
            ) THEN
            CREATE POLICY "Users can delete their own CVs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);
            END IF;
        END
        $$;
        `);
            console.log("✅ Delete policy applied.");
        } catch (e) {
            console.warn("⚠️ Could not apply delete policy (might be missing helper function), but upload/read should work.");
        }

        console.log("\n🎉 FIX COMPLETED SUCCESSFULLY!");
        console.log("The 'cvs' bucket is now ready for uploads.");

        // Close pool
        await pool.end();
        process.exit(0);

    } catch (error) {
        console.error("\n❌ FAILED to fix storage:", error);
        await pool.end();
        process.exit(1);
    }
}

fixStorage();
