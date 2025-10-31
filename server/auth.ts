import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

declare module "express-session" {
  interface SessionData {
    adminId?: string;
    userId?: string;
    sessionCartId?: string;
  }
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || 
  hashPassword("@Stootap123");

if (!process.env.ADMIN_PASSWORD_HASH && process.env.NODE_ENV === "production") {
  console.warn("\n⚠️  WARNING: Using default admin credentials in production!");
  console.warn("⚠️  Set ADMIN_PASSWORD_HASH environment variable to secure your admin panel.");
  console.warn("⚠️  Generate hash: node -e \"console.log(require('crypto').createHash('sha256').update('YOUR_PASSWORD').digest('hex'))\"\n");
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyAdmin(username: string, password: string): boolean {
  const passwordHash = hashPassword(password);
  return username === ADMIN_USERNAME && passwordHash === ADMIN_PASSWORD_HASH;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.session?.adminId) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized: Admin access required" });
  }
}

export async function loginAdmin(req: Request, username: string, password: string): Promise<{ success: boolean; message: string }> {
  if (verifyAdmin(username, password)) {
    if (req.session) {
      req.session.regenerate((err) => {
        if (err) {
          console.error("Session regeneration error:", err);
        }
        req.session.adminId = "admin";
      });
    }
    return { success: true, message: "Login successful" };
  }
  return { success: false, message: "Invalid credentials" };
}
