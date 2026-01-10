import { Request, Response, NextFunction } from "express";

export function isAdminAuthenticated(req: Request): boolean {
    return (req as any).session?.admin === true;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (isAdminAuthenticated(req)) {
        next();
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
}

export async function loginAdmin(req: Request, res: Response, username, password) {
    if (username === "admin" && password === "@Stootap123") { // Matches SETUP_LOCAL.md
        if ((req as any).session) {
            (req as any).session.admin = true;
        } else {
            console.warn("Session middleware not configured, admin login won't persist properly without it.");
        }
        return { success: true, message: "Logged in" };
    }
    return { success: false, message: "Invalid credentials" };
}

export function logoutAdmin(req: Request, res: Response) {
    if ((req as any).session) {
        (req as any).session.admin = undefined;
    }
}
