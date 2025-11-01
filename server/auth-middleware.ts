import { Request, Response, NextFunction } from "express";
import { supabaseServer } from "./supabase-server";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role?: string;
      };
    }
  }
}

/**
 * Middleware to verify Supabase authentication token from Authorization header
 * Extracts user info and attaches to req.user
 */
export async function authenticateSupabaseUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // No token, continue (route handlers will check if auth is required)
    }

    // Extract the JWT token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the JWT with Supabase
    const { data: { user }, error } = await supabaseServer.auth.getUser(token);

    if (error || !user) {
      console.error("Invalid Supabase token:", error?.message);
      return next(); // Invalid token, continue (route will handle unauthorized)
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email || '',
      role: user.user_metadata?.role || 'business',
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    next(); // On error, continue (route will handle unauthorized)
  }
}

/**
 * Middleware to require authentication
 * Use after authenticateSupabaseUser
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}
