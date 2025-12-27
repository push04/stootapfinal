// netlify/functions/razorpay-webhook.ts
import crypto from "crypto";
var handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }
  try {
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
    if (!RAZORPAY_KEY_SECRET) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Razorpay not configured" })
      };
    }
    const webhookSignature = event.headers["x-razorpay-signature"];
    const webhookBody = event.body || "";
    if (!webhookSignature) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing webhook signature" })
      };
    }
    const expectedSignature = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(webhookBody).digest("hex");
    if (webhookSignature !== expectedSignature) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid webhook signature" })
      };
    }
    const payload = JSON.parse(webhookBody);
    const eventType = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    if (eventType === "payment.captured") {
      console.log("Payment captured:", paymentEntity);
    } else if (eventType === "payment.failed") {
      console.log("Payment failed:", paymentEntity);
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Webhook processing failed" })
    };
  }
};
export {
  handler
};
//# sourceMappingURL=razorpay-webhook.js.map
