import { createExpressApp } from "./app";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";

(async () => {
  // Seed database only in development
  if (process.env.NODE_ENV === "development") {
    await seedDatabase();
  }

  const { app, server } = await createExpressApp();

  // Set up Vite dev server in development, serve static files in production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
