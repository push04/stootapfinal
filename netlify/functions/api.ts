import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import serverless from "serverless-http";
import { createExpressApp } from "../../server/app";

let cachedHandler: ReturnType<typeof serverless> | null = null;

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Initialize the Express app once and cache it for subsequent invocations
  if (!cachedHandler) {
    const { app } = await createExpressApp();
    cachedHandler = serverless(app, {
      binary: ["image/*", "application/pdf"],
    });
  }

  return cachedHandler(event, context);
};
