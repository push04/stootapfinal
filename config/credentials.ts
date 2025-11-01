/**
 * CREDENTIALS CONFIGURATION
 * ⚠️ WARNING: This file contains sensitive credentials
 * Keep this repository PRIVATE at all times
 * 
 * All credentials are stored in this file for easy access in the Replit environment
 */

// Supabase Configuration (already in .env files, documented here)
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_PUBLIC_SUPABASE_URL || "https://nqpvacbctivuqzxqvxyk.supabase.co",
  anonKey: import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xcHZhY2JjdGl2dXF6eHF2eHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzOTkyNDMsImV4cCI6MjA0NTk3NTI0M30.VaF5k97SJxCjEhXwjZqy3jmQGcWuwuZRq21L0XM4UNs",
};

// Hardcoded Admin Credentials
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "@Stootap123",
  email: "admin@stootap.com",
  role: "admin",
};

// Razorpay Configuration (add your keys here)
export const RAZORPAY_CONFIG = {
  keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_ID",
  keySecret: process.env.RAZORPAY_KEY_SECRET || "YOUR_KEY_SECRET",
};

// OpenRouter AI Configuration (add your key here)
export const OPENROUTER_CONFIG = {
  apiKey: process.env.OPENROUTER_API_KEY || "YOUR_OPENROUTER_API_KEY",
  apiUrl: "https://openrouter.ai/api/v1/chat/completions",
};

// Session Configuration
export const SESSION_CONFIG = {
  secret: process.env.SESSION_SECRET || "stootap-session-secret-change-in-production",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Database Configuration (Neon PostgreSQL - from Supabase)
export const DATABASE_CONFIG = {
  url: process.env.DATABASE_URL || "postgresql://postgres:[PASSWORD]@db.nqpvacbctivuqzxqvxyk.supabase.co:5432/postgres",
};

// Email Configuration (for future use with email verification)
export const EMAIL_CONFIG = {
  from: "noreply@stootap.com",
  supportEmail: "support@stootap.com",
};

// Application Configuration
export const APP_CONFIG = {
  name: "Stootap",
  url: process.env.REPLIT_DEV_DOMAIN 
    ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
    : "http://localhost:5000",
  port: 5000,
  environment: process.env.NODE_ENV || "development",
};

/**
 * Helper function to get all credentials for server-side use
 * DO NOT expose this to client-side code
 */
export function getAllCredentials() {
  return {
    supabase: SUPABASE_CONFIG,
    admin: ADMIN_CREDENTIALS,
    razorpay: RAZORPAY_CONFIG,
    openrouter: OPENROUTER_CONFIG,
    session: SESSION_CONFIG,
    database: DATABASE_CONFIG,
    email: EMAIL_CONFIG,
    app: APP_CONFIG,
  };
}

export default {
  SUPABASE_CONFIG,
  ADMIN_CREDENTIALS,
  RAZORPAY_CONFIG,
  OPENROUTER_CONFIG,
  SESSION_CONFIG,
  DATABASE_CONFIG,
  EMAIL_CONFIG,
  APP_CONFIG,
  getAllCredentials,
};
