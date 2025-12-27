import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import serverless from "serverless-http";
import { createExpressApp } from "../../server/app";

let cachedHandler: ReturnType<typeof serverless> | null = null;
let initializationError: Error | null = null;

// Validate critical environment variables on cold start
function validateEnvironment() {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SESSION_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      `Please set these in Netlify dashboard under Site settings → Environment variables.`
    );
  }

  console.log('✅ Environment validation passed');
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    // Initialize the Express app once and cache it for subsequent invocations
    if (!cachedHandler && !initializationError) {
      try {
        console.log('🚀 Initializing Express app for Netlify Functions...');

        // Validate environment before initialization
        validateEnvironment();

        const { app } = await createExpressApp();
        cachedHandler = serverless(app, {
          binary: ["image/*", "application/pdf"],
        });

        console.log('✅ Express app initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize Express app:', error);
        initializationError = error as Error;

        return {
          statusCode: 500,
          body: JSON.stringify({
            error: 'Server initialization failed',
            message: error instanceof Error ? error.message : 'Unknown error',
            hint: 'Check Netlify function logs for details'
          }),
        };
      }
    }

    // If initialization failed previously, return error
    if (initializationError) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Server initialization failed',
          message: initializationError.message,
        }),
      };
    }

    // Handle the request
    return cachedHandler!(event, context) as any;
  } catch (error) {
    console.error('❌ Function handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
