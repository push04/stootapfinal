import { Request, Response, NextFunction } from "express";
import { supabaseAuth } from "./supabase-server";

export async function authenticateSupabaseUser(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next();
    }
    const token = authHeader.replace("Bearer ", "");
    try {
        const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
        if (error) {
            console.error("Auth middleware error:", error.message);
        }
        if (user) {
            console.log("Auth middleware success for:", user.email);
            (req as any).user = user;
        } else {
            console.warn("Auth middleware: Invalid or expired token");
        }
    } catch (err) {
        console.error("Auth middleware exception:", err);
    }
    next();
}
