import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { createServer, type Server } from "http";
import cookieParser from "cookie-parser";
import session from "express-session";
import createMemoryStore from "memorystore";
import { authenticateSupabaseUser } from "./auth-middleware";

const MemoryStore = createMemoryStore(session);

declare module 'http' {
  interface IncomingMessage {
    rawBody?: Buffer
  }
}

export async function createExpressApp(): Promise<{ app: express.Express; server: Server }> {
  const app = express();

  if (!process.env.SESSION_SECRET && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET environment variable is required in production");
  }

  // Use cookie-parser for stateless auth (no DB-backed sessions)
  app.use(cookieParser(process.env.SESSION_SECRET || "dev-secret-change-in-production"));

  app.use(
    session({
      cookie: { maxAge: 86400000 },
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
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
