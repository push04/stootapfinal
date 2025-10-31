import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { createServer, type Server } from "http";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

const PgSession = connectPgSimple(session);

function getConnectionString(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePassword = process.env.SUPABASE_DB_PASSWORD;

  if (!supabaseUrl || !supabasePassword) {
    throw new Error("Either DATABASE_URL or SUPABASE_URL + SUPABASE_DB_PASSWORD must be provided");
  }

  const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
  return `postgresql://postgres.${projectRef}:${supabasePassword}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`;
}

export async function createExpressApp(): Promise<{ app: express.Express; server: Server }> {
  const app = express();

  if (!process.env.SESSION_SECRET && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET environment variable is required in production");
  }

  const connectionString = getConnectionString();
  const sessionPool = new Pool({ connectionString });

  app.use(session({
    store: new PgSession({
      pool: sessionPool,
      createTableIfMissing: true,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production-" + Math.random(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }));

  app.use(express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  }));
  app.use(express.urlencoded({ extended: false }));

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
    throw err;
  });

  return { app, server };
}
