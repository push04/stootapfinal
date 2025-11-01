import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import signature from "cookie-signature";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "@Stootap123";

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-in-production";

export function verifyAdmin(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// Sign a cookie value with SESSION_SECRET
function signCookie(value: string): string {
  return signature.sign(value, SESSION_SECRET);
}

// Unsign and verify a signed cookie
function unsignCookie(signedValue: string): string | false {
  return signature.unsign(signedValue, SESSION_SECRET);
}

// Check if request has valid admin cookie
export function isAdminAuthenticated(req: Request): boolean {
  const adminCookie = req.cookies?.['admin_session'];
  if (!adminCookie) return false;
  
  const unsigned = unsignCookie(adminCookie);
  return unsigned === "admin";
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (isAdminAuthenticated(req)) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized: Admin access required" });
  }
}

export async function loginAdmin(req: Request, res: Response, username: string, password: string): Promise<{ success: boolean; message: string }> {
  if (verifyAdmin(username, password)) {
    // Set signed cookie for admin auth (stateless, no DB)
    const signedCookie = signCookie("admin");
    res.cookie('admin_session', signedCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    return { success: true, message: "Login successful" };
  }
  return { success: false, message: "Invalid credentials" };
}

export function logoutAdmin(req: Request, res: Response): void {
  res.clearCookie('admin_session');
}
