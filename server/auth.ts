import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import signature from "cookie-signature";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";

// Default hash for password "@Stootap123"
const DEFAULT_ADMIN_PASSWORD_HASH = "6e20e7f929a8745bea430809f10fce69fc53f0385291d4a76c56a817984426d7";

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || DEFAULT_ADMIN_PASSWORD_HASH;

if (!process.env.ADMIN_PASSWORD_HASH && process.env.NODE_ENV === "production") {
  console.warn("\n⚠️  WARNING: Using default admin credentials in production!");
  console.warn("⚠️  Set ADMIN_PASSWORD_HASH environment variable to secure your admin panel.");
  console.warn("⚠️  Generate hash: node -e \"console.log(require('crypto').createHash('sha256').update('YOUR_PASSWORD').digest('hex'))\"\n");
}

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-in-production";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyAdmin(username: string, password: string): boolean {
  const passwordHash = hashPassword(password);
  return username === ADMIN_USERNAME && passwordHash === ADMIN_PASSWORD_HASH;
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
