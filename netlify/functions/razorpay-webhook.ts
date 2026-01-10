import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import crypto from "crypto";
import { storage } from "../../server/storage-db";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
    
    if (!RAZORPAY_KEY_SECRET) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Razorpay not configured" }),
      };
    }

    const webhookSignature = event.headers["x-razorpay-signature"];
    const webhookBody = event.body || "";

    if (!webhookSignature) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing webhook signature" }),
      };
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(webhookBody)
      .digest("hex");

    if (webhookSignature !== expectedSignature) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid webhook signature" }),
      };
    }

    // Parse the webhook payload
    const payload = JSON.parse(webhookBody);
    const eventType = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;

    // Handle different event types
    if (eventType === "payment.captured") {
      console.log("Payment captured:", paymentEntity);
      // Update order status if needed
    } else if (eventType === "payment.failed") {
      console.log("Payment failed:", paymentEntity);
      // Handle failed payment
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Webhook processing failed" }),
    };
  }
};
