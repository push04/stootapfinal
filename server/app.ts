import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { createServer, type Server } from "http";
import cookieParser from "cookie-parser";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { authenticateSupabaseUser } from "./auth-middleware";

declare module 'http' {
  interface IncomingMessage {
    rawBody?: Buffer
  }
}
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Create session store connection
function getSessionStore() {
  const isProduction = process.env.NODE_ENV === "production";

  // In development, always use memory store for simplicity
  if (!isProduction) {
    console.log("[Session] Using memory store for development");
    return new MemoryStore({ checkPeriod: 86400000 });
  }

  // In production, try PostgreSQL for session storage
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.warn("[Session] DATABASE_URL not set, using memory store");
    return new MemoryStore({ checkPeriod: 86400000 });
  }

  try {
    const PgSession = pgSession(session);
    return new PgSession({
      conString: connectionString,
      tableName: "session",
      createTableIfMissing: true,
    });
  } catch (error: any) {
    console.error("[Session] PostgreSQL session store failed:", error.message);
    return new MemoryStore({ checkPeriod: 86400000 });
  }
}

export async function createExpressApp(): Promise<{ app: express.Express; server: Server }> {
  const app = express();

  // Trust proxy for Netlify/serverless environments
  app.set('trust proxy', 1);

  if (!process.env.SESSION_SECRET && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET environment variable is required in production");
  }

  // Use cookie-parser for stateless auth (no DB-backed sessions)
  app.use(cookieParser(process.env.SESSION_SECRET || "dev-secret-change-in-production"));

  const isProduction = process.env.NODE_ENV === "production";

  app.use(
    session({
      cookie: {
        maxAge: 86400000, // 24 hours
        secure: isProduction, // HTTPS only in production
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax", // Allow cross-site in production for Netlify
      },
      store: getSessionStore(),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
      proxy: isProduction, // Trust proxy in production
    })
  );

  // Security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  app.use(express.json({
    limit: '10mb', // Limit request body size
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  }));
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));

  // Add Supabase authentication middleware
  app.use(authenticateSupabaseUser);

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        console.log(logLine);
      }
    });

    next();
  });

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
  });

  return { app, server };
}
