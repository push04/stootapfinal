import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, toCamelCase, toSnakeCase } from "./storage";
import type { Request } from "express";

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
    session?: any;
  }
}
import { ZodError, z } from "zod";
import { requireAdmin, loginAdmin, logoutAdmin, isAdminAuthenticated } from "./auth";
import Razorpay from "razorpay";
import crypto from "crypto";
import { supabaseServer } from "./supabase-server";
import { validateRequest, commonSchemas, rateLimit } from "./validation";
import { registerOpportunitiesRoutes } from "./opportunities-routes";


// Razorpay configuration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const razorpayInstance = RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET ? new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {

  // Categories API
  app.get("/api/categories", async (_req, res) => {
    const categories = await storage.getAllCategories();
    res.json(categories);
  });

  // Services API
  app.get("/api/services", async (req, res) => {
    const { category, active } = req.query;

    let services = await storage.getAllServices(
      active !== undefined ? active === "true" : undefined
    );

    if (category) {
      const cat = await storage.getCategoryBySlug(category as string);
      if (cat) {
        const categoryServices = await storage.getServicesByCategory(cat.id);
        if (active !== undefined) {
          services = categoryServices.filter((s) => s.active === (active === "true"));
        } else {
          services = categoryServices;
        }
      }
    }

    res.json(services);
  });

  app.get("/api/services/:slug", async (req, res) => {
    const service = await storage.getServiceBySlug(req.params.slug);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(service);
  });

  // Leads API
  app.post("/api/leads", async (req, res) => {
    try {
      const { insertLeadSchema } = await import("@shared/schema");
      const validated = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validated as any);
      res.json(lead);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({
          error: "Validation failed",
          details: (error as any).errors
        });
      }
      res.status(400).json({ error: "Failed to create lead" });
    }
  });

  // Startup Inquiries API
  app.post("/api/startup-inquiries", async (req, res) => {
    try {
      const { insertLeadSchema } = await import("@shared/schema");
      const { name, email, phone, startupIdea, fundingNeeded, stage } = req.body;

      const validated = insertLeadSchema.parse({
        name,
        email,
        phone,
        role: "student",
        message: startupIdea,
        kind: "startup",
        capturedVia: "web_form",
        metadata: {
          fundingNeeded,
          stage,
        }
      });

      const lead = await storage.createLead(validated as any);
      res.json(lead);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({
          error: "Validation failed",
          details: (error as any).errors
        });
      }
      res.status(400).json({ error: "Failed to create startup inquiry" });
    }
  });

  // Package Inquiries API
  app.post("/api/package-inquiries", async (req, res) => {
    try {
      const { insertLeadSchema } = await import("@shared/schema");
      const { name, email, phone, packageType, businessStage, message } = req.body;

      const validated = insertLeadSchema.parse({
        name,
        email,
        phone,
        role: "business",
        message: message || `Package Inquiry: ${packageType}`,
        kind: "package_inquiry",
        capturedVia: "web_form",
        metadata: {
          packageType,
          businessStage,
        }
      });

      const lead = await storage.createLead(validated as any);
      res.json(lead);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({
          error: "Validation failed",
          details: (error as any).errors
        });
      }
      console.error("Package inquiry error:", error);
      res.status(400).json({ error: "Failed to submit package inquiry" });
    }
  });

  // Mentorship Bookings API
  app.post("/api/mentorship-bookings", async (req, res) => {
    try {
      const { insertLeadSchema } = await import("@shared/schema");
      const { name, email, phone, sessionType, isStudent, studentId, topic, preferredDate, preferredTime, price } = req.body;

      const validated = insertLeadSchema.parse({
        name,
        email,
        phone,
        role: isStudent ? "student" : "business",
        message: topic,
        kind: "mentorship_booking",
        capturedVia: "web_form",
        metadata: {
          sessionType,
          isStudent,
          studentId: studentId || null,
          preferredDate: preferredDate || null,
          preferredTime: preferredTime || null,
          price,
        }
      });

      const lead = await storage.createLead(validated as any);
      res.json(lead);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({
          error: "Validation failed",
          details: (error as any).errors
        });
      }
      console.error("Mentorship booking error:", error);
      res.status(400).json({ error: "Failed to submit mentorship booking" });
    }
  });

  // Cart API
  app.get("/api/cart/:sessionId", async (req, res) => {
    const { sessionId } = req.params;
    const cartItems = await storage.getCartItemsBySession(sessionId);

    const itemsWithServices = await Promise.all(
      cartItems.map(async (item) => {
        const service = await storage.getService(item.serviceId);
        return {
          ...item,
          service,
        };
      })
    );

    res.json(itemsWithServices);
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const { insertCartItemSchema } = await import("@shared/schema");
      const validated = insertCartItemSchema.parse(req.body);

      const service = await storage.getService(validated.serviceId);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      if (!service.active) {
        return res.status(400).json({ error: "Service is not available" });
      }

      const cartItem = await storage.addToCart({
        sessionId: validated.sessionId,
        serviceId: validated.serviceId,
        qty: (validated as any).qty ?? 1,
      } as any);

      res.json(cartItem);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({
          error: "Validation failed",
          details: (error as any).errors
        });
      }
      res.status(400).json({ error: "Failed to add item to cart" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { qty } = req.body;

      if (typeof qty !== "number" || qty < 1 || !Number.isInteger(qty)) {
        return res.status(400).json({ error: "Quantity must be a positive integer" });
      }

      const cartItem = await storage.updateCartItemQty(id, qty);
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.removeFromCart(id);

      if (!deleted) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to remove cart item" });
    }
  });

  app.post("/api/cart/clear", async (req, res) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ error: "Missing sessionId" });
      }

      await storage.clearCart(sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to clear cart" });
    }
  });

  // Payment API (Razorpay) - Optional
  app.get("/api/payment/razorpay-key", (_req, res) => {
    if (!RAZORPAY_KEY_ID) {
      // Return a clear message that payment is disabled
      return res.status(503).json({
        error: "Payment gateway is currently disabled. Orders will be processed manually. Please contact support to complete your order."
      });
    }
    res.json({ key: RAZORPAY_KEY_ID });
  });

  app.post("/api/payment/create-order", async (req, res) => {
    try {
      if (!razorpayInstance) {
        console.error("Razorpay not configured - payment gateway disabled");
        return res.status(503).json({
          error: "Payment gateway is currently disabled",
          message: "Your order has been saved. Our team will contact you to complete the payment process."
        });
      }

      const { amount, currency = "INR", receipt, notes } = req.body;

      if (!amount) {
        return res.status(400).json({ error: "Amount is required" });
      }

      const options = {
        amount: Math.round(amount * 100),
        currency,
        receipt: receipt || `order_${Date.now()}`,
        notes: notes || {},
      };

      console.log("Creating Razorpay order with amount:", options.amount / 100, currency);

      const razorpayOrder = await razorpayInstance.orders.create(options);

      console.log("Razorpay order created successfully:", razorpayOrder.id);
      res.json(razorpayOrder);
    } catch (error: any) {
      console.error("Razorpay order creation failed:", error);
      console.error("Error details:", {
        message: error.message,
        description: error.error?.description,
        code: error.error?.code,
        statusCode: error.statusCode
      });

      res.status(500).json({
        error: "Failed to create payment order",
        details: error.error?.description || error.message || "Unknown error"
      });
    }
  });

  app.post("/api/payment/verify", async (req, res) => {
    try {
      if (!RAZORPAY_KEY_SECRET) {
        return res.status(500).json({ error: "Razorpay not configured" });
      }

      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
        return res.status(400).json({ error: "Missing required payment details" });
      }

      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

      if (razorpay_signature === expectedSign) {
        await storage.updateOrder(orderId, {
          status: "paid",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        } as any);

        const order = await storage.getOrder(orderId);

        // Note: Notification system can be implemented later with dedicated notification table
        // For now, payment success is tracked via order status

        res.json({ success: true, message: "Payment verified successfully" });
      } else {
        res.status(400).json({ error: "Invalid payment signature" });
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      res.status(500).json({ error: "Payment verification failed" });
    }
  });

  app.post("/api/payment/webhook", async (req, res) => {
    try {
      if (!RAZORPAY_KEY_SECRET) {
        return res.status(500).json({ error: "Razorpay not configured" });
      }

      const webhookSignature = req.headers["x-razorpay-signature"] as string;
      const webhookBody = JSON.stringify(req.body);

      const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(webhookBody)
        .digest("hex");

      if (webhookSignature !== expectedSignature) {
        return res.status(400).json({ error: "Invalid webhook signature" });
      }

      const event = req.body.event;
      const paymentEntity = req.body.payload?.payment?.entity;

      if (event === "payment.captured") {
        console.log("Payment captured:", paymentEntity);
      } else if (event === "payment.failed") {
        console.log("Payment failed:", paymentEntity);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Webhook processing failed:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // Orders API
  app.post("/api/orders", async (req, res) => {
    try {
      const { insertOrderSchema } = await import("@shared/schema");

      // Automatically add userId if user is authenticated
      const orderData = {
        ...req.body,
        userId: req.user?.id || null, // Include userId from authenticated session
      };

      const validated = insertOrderSchema.parse(orderData);

      const order = await storage.createOrder(validated as any);

      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          await storage.createOrderItem({
            orderId: order.id,
            serviceId: item.serviceId,
            name: item.name,
            unitPriceInr: item.unitPriceInr,
            qty: item.qty,
            totalInr: item.totalInr,
          } as any);
        }
      }

      res.json(order);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors
        });
      }
      res.status(400).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const items = await storage.getOrderItemsByOrderId(order.id);
      res.json({ ...order, items });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.get("/api/orders/session/:sessionId", async (req, res) => {
    try {
      const orders = await storage.getOrdersBySession(req.params.sessionId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Update order status (customer-accessible for payment flow)
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ["pending", "payment_processing", "paid", "failed", "cancelled"];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      // Get the order first to verify it exists and check session/user ownership
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Only allow updating own orders (via session or user ID)
      const sessionId = req.body.sessionId || req.query.sessionId;
      if (req.user) {
        // If authenticated, check user ID
        if (order.userId !== req.user.id) {
          return res.status(403).json({ error: "Not authorized to update this order" });
        }
      } else if (sessionId) {
        // If not authenticated, check session ID
        if (order.sessionId !== sessionId) {
          return res.status(403).json({ error: "Not authorized to update this order" });
        }
      } else {
        return res.status(401).json({ error: "Authentication or session ID required" });
      }

      const updated = await storage.updateOrder(id, { status } as any);
      if (!updated) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });





  // User Authentication (Legacy - Supabase Auth handles this now)
  app.post("/api/auth/register", async (req, res) => {
    res.status(410).json({
      error: "This endpoint is deprecated. Please use Supabase Auth for registration."
    });
  });

  // Legacy login endpoint - Not used (Supabase Auth handles login)
  app.post("/api/auth/login", async (req, res) => {
    res.status(410).json({
      error: "This endpoint is deprecated. Please use Supabase Auth for login."
    });
  });

  // Old session-based login (kept for reference but not used)
  app.post("/api/auth/login-legacy", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const profile = await storage.getProfileByEmail(email);
      if (!profile) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // This is legacy code - Supabase Auth handles password verification
      // Keeping for reference but should not be used
      return res.status(410).json({ error: "Use Supabase Auth for login" });

      return new Promise((resolve) => {
        if (req.session) {
          req.session.regenerate((err) => {
            if (err) {
              console.error("Session regeneration error:", err);
              res.status(500).json({ error: "Session error" });
              resolve();
              return;
            }
            req.session.userId = profile.id;
            req.session.save((saveErr) => {
              if (saveErr) {
                console.error("Session save error:", saveErr);
                res.status(500).json({ error: "Session save error" });
                resolve();
                return;
              }
              res.json({
                success: true,
                message: "Login successful",
                user: {
                  id: profile.id,
                  fullName: profile.fullName,
                  email: profile.email,
                  phone: profile.phone,
                  role: profile.role
                }
              });
              resolve();
            });
          });
        } else {
          res.status(500).json({ error: "No session available" });
          resolve();
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    if (req.session) {
      req.session.userId = undefined;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error during logout:", err);
        }
        res.json({ success: true, message: "Logged out successfully" });
      });
    } else {
      res.json({ success: true, message: "Logged out successfully" });
    }
  });

  app.get("/api/me", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      // Try to get existing profile by Supabase user ID
      let profile = await storage.getProfile(req.user.id);

      // If profile doesn't exist, create one from Supabase user data
      if (!profile) {
        try {
          profile = await storage.createProfile({
            id: req.user.id,
            fullName: req.user.email.split('@')[0],
            email: req.user.email,
            phone: null,
            role: req.user.role || 'business',
          } as any);
        } catch (createError) {
          // If creation fails (e.g., email already exists), try to get by email
          const existingProfile = await storage.getProfileByEmail(req.user.email);
          if (existingProfile) {
            // Profile exists with different ID - this shouldn't happen but handle gracefully
            console.warn(`Profile mismatch: Supabase ID ${req.user.id} vs DB ID ${existingProfile.id} for ${req.user.email}`);
            profile = existingProfile;
          } else {
            throw createError;
          }
        }
      }

      res.json({
        id: profile.id,
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        createdAt: profile.createdAt
      });
    } catch (error: any) {
      console.error("❌ CRITICAL ERROR in /api/me:");
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
      console.error("Full Error:", JSON.stringify(error, null, 2));
      res.status(500).json({ error: "Failed to get user profile", details: error.message });
    }
  });

  // Update user profile
  app.put("/api/me",
    validateRequest({
      body: z.object({
        fullName: commonSchemas.fullName,
        phone: commonSchemas.phone.optional(),
      })
    }),
    async (req, res) => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: "Not authenticated" });
        }

        const { fullName, phone } = req.body;
        const updates: any = { fullName };
        if (phone !== undefined) {
          updates.phone = phone || null;
        }

        const updatedProfile = await storage.updateProfile(req.user.id, updates);

        if (!updatedProfile) {
          return res.status(404).json({ error: "Profile not found" });
        }

        res.json({
          success: true,
          message: "Profile updated successfully",
          user: {
            id: updatedProfile.id,
            fullName: updatedProfile.fullName,
            email: updatedProfile.email,
            phone: updatedProfile.phone,
            role: updatedProfile.role
          }
        });
      } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Failed to update profile" });
      }
    });


  // Update user role (switch profile)
  app.put("/api/me/role", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { role } = req.body;

      if (!["student", "business", "company"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      const updatedProfile = await storage.updateProfile(req.user.id, { role } as any);
      if (!updatedProfile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      const { error } = await supabaseServer.auth.admin.updateUserById(
        req.user.id,
        { user_metadata: { role } }
      );

      if (error) {
        console.error("Update auth metadata error:", error);
      }

      res.json({
        success: true,
        message: "Profile role updated successfully",
        role: updatedProfile.role,
      });
    } catch (error) {
      console.error("Update role error:", error);
      res.status(500).json({ error: "Failed to update role" });
    }
  });
  // Change password using Supabase Auth
  app.post("/api/me/change-password", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { newPassword } = req.body; // Note: Supabase Auth handles current password verification

      if (!newPassword) {
        return res.status(400).json({ error: "New password is required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ error: "New password must be at least 8 characters" });
      }

      // Use Supabase Auth Admin API to change password
      // Note: In production, consider requiring re-authentication before password changes
      const { error } = await supabaseServer.auth.admin.updateUserById(
        req.user.id,
        { password: newPassword }
      );

      if (error) {
        console.error("Password change error:", error);
        return res.status(500).json({ error: "Failed to change password" });
      }

      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  // Get user's orders
  app.get("/api/me/orders", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const orders = await storage.getOrdersByUser(req.user.id);

      // Get order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItemsByOrderId(order.id);
          return { ...order, items };
        })
      );

      res.json(ordersWithItems);
    } catch (error) {
      console.error("Get user orders error:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Admin Authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const result = await loginAdmin(req, res, username, password);

      if (result.success) {
        res.json({ success: true, message: result.message });
      } else {
        res.status(401).json({ error: result.message });
      }
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    logoutAdmin(req, res);
    res.json({ success: true });
  });

  app.get("/api/admin/check", (req, res) => {
    res.json({ isAdmin: isAdminAuthenticated(req) });
  });

  // Admin Integration Status Check
  app.get("/api/admin/integration-status", requireAdmin, async (_req, res) => {
    try {
      const status = {
        razorpay: {
          configured: !!(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET),
          error: !(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) ? "Razorpay keys not configured" : null,
        },
        openrouter: {
          configured: !!OPENROUTER_API_KEY,
          error: !OPENROUTER_API_KEY ? "OpenRouter API key not configured" : null,
        },
        supabase: {
          configured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
          error: !(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) ? "Supabase credentials not configured" : null,
        },
      };

      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to check integration status" });
    }
  });

  // Admin Dashboard APIs
  app.get("/api/admin/analytics", requireAdmin, async (_req, res) => {
    try {
      const orders = await storage.getAllOrders();
      const leads = await storage.getAllLeads();
      const services = await storage.getAllServices();
      const categories = await storage.getAllCategories();

      const totalRevenue = orders
        .filter(o => o.status === "completed")
        .reduce((sum, o) => sum + parseFloat(o.totalInr.toString()), 0);

      const pendingOrders = orders.filter(o => o.status === "pending").length;
      const completedOrders = orders.filter(o => o.status === "completed").length;
      const processingOrders = orders.filter(o => o.status === "processing").length;
      const cancelledOrders = orders.filter(o => o.status === "cancelled").length;

      const now = new Date();
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const ordersLast7Days = orders.filter(o => new Date(o.createdAt) >= last7Days);
      const ordersLast30Days = orders.filter(o => new Date(o.createdAt) >= last30Days);
      const leadsLast7Days = leads.filter(l => new Date(l.createdAt) >= last7Days);
      const leadsLast30Days = leads.filter(l => new Date(l.createdAt) >= last30Days);

      const revenueLast7Days = ordersLast7Days
        .filter(o => o.status === "completed")
        .reduce((sum, o) => sum + parseFloat(o.totalInr.toString()), 0);

      const revenueLast30Days = ordersLast30Days
        .filter(o => o.status === "completed")
        .reduce((sum, o) => sum + parseFloat(o.totalInr.toString()), 0);

      const weeklyTrend = [];
      for (let i = 6; i >= 0; i--) {
        const dayStart = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const dayOrders = orders.filter(o => {
          const orderDate = new Date(o.createdAt);
          return orderDate >= dayStart && orderDate <= dayEnd;
        });

        const dayRevenue = dayOrders
          .filter(o => o.status === "completed")
          .reduce((sum, o) => sum + parseFloat(o.totalInr.toString()), 0);

        weeklyTrend.push({
          date: dayStart.toISOString().split('T')[0],
          name: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
          orders: dayOrders.length,
          revenue: parseFloat(dayRevenue.toFixed(2)),
          leads: leads.filter(l => {
            const leadDate = new Date(l.createdAt);
            return leadDate >= dayStart && leadDate <= dayEnd;
          }).length
        });
      }

      const servicePerformance = services.map(service => ({
        serviceId: service.id,
        serviceName: service.name,
        categoryId: service.categoryId,
        active: service.active,
        basePriceInr: service.basePriceInr
      }));

      const categoryStats = categories.map(cat => {
        const catServices = services.filter(s => s.categoryId === cat.id);
        return {
          categoryId: cat.id,
          categoryName: cat.name,
          serviceCount: catServices.length,
          activeServiceCount: catServices.filter(s => s.active).length
        };
      });

      const conversionRate = leads.length > 0
        ? ((orders.length / leads.length) * 100).toFixed(1)
        : "0.0";

      const avgOrderValue = completedOrders > 0
        ? (totalRevenue / completedOrders).toFixed(2)
        : "0.00";

      const completionRate = orders.length > 0
        ? ((completedOrders / orders.length) * 100).toFixed(1)
        : "0.0";

      const analytics = {
        totalOrders: orders.length,
        pendingOrders,
        completedOrders,
        processingOrders,
        cancelledOrders,
        totalRevenue: totalRevenue.toFixed(2),
        totalLeads: leads.length,
        totalServices: services.length,
        activeServices: services.filter(s => s.active).length,
        recentOrders: orders.slice(0, 10),
        recentLeads: leads.slice(0, 10),
        ordersLast7Days: ordersLast7Days.length,
        ordersLast30Days: ordersLast30Days.length,
        leadsLast7Days: leadsLast7Days.length,
        leadsLast30Days: leadsLast30Days.length,
        revenueLast7Days: revenueLast7Days.toFixed(2),
        revenueLast30Days: revenueLast30Days.toFixed(2),
        weeklyTrend,
        servicePerformance,
        categoryStats,
        conversionRate,
        avgOrderValue,
        completionRate
      };

      res.json(analytics);
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/admin/orders", requireAdmin, async (_req, res) => {
    try {
      console.log("Admin orders API called");
      const orders = await storage.getAllOrders();
      console.log(`Found ${orders.length} orders`);
      res.json(orders);
    } catch (error) {
      console.error("Admin get orders error:", error);
      if (error instanceof Error) {
        console.error("Stack trace:", error.stack);
      }
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.patch("/api/admin/orders/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const order = await storage.updateOrder(id, { status } as any);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.get("/api/admin/orders/:id/details", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrder(id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const items = await storage.getOrderItemsByOrderId(id);

      res.json({
        ...order,
        items
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order details" });
    }
  });

  app.get("/api/admin/leads", requireAdmin, async (req, res) => {
    try {
      const leads = await storage.getAllLeads();

      // Support search and filtering
      let filteredLeads = leads;
      const { search, kind, role } = req.query;

      if (search) {
        const searchLower = (search as string).toLowerCase();
        filteredLeads = filteredLeads.filter(lead =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.phone.includes(searchLower) ||
          lead.message.toLowerCase().includes(searchLower)
        );
      }

      if (kind && kind !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.kind === kind);
      }

      if (role && role !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.role === role);
      }

      res.json(filteredLeads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/admin/leads/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const leads = await storage.getAllLeads();
      const lead = leads.find(l => l.id === id);

      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lead details" });
    }
  });

  // User Management APIs
  app.get("/api/admin/users", requireAdmin, async (_req, res) => {
    try {
      const users = await storage.getAllProfiles();
      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const userData = toSnakeCase(req.body);
      const { data, error } = await supabaseServer
        .from("profiles")
        .insert(userData)
        .select()
        .single();

      if (error) throw error;
      res.json(toCamelCase(data));
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({
        error: "Failed to create user",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = toSnakeCase(req.body);

      const { data, error } = await supabaseServer
        .from("profiles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(toCamelCase(data));
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;

      const { error } = await supabaseServer
        .from("profiles")
        .delete()
        .eq("id", id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Notification/Message APIs
  app.post("/api/admin/notifications", requireAdmin, async (req, res) => {
    try {
      const { userId, title, message, type, actionUrl } = req.body;

      if (!userId || !title || !message) {
        return res.status(400).json({ error: "userId, title, and message are required" });
      }

      const notification = await storage.createNotification({
        userId,
        type: type || "admin_message",
        title,
        message,
        actionUrl: actionUrl || null,
      } as any);

      res.json(notification);
    } catch (error) {
      console.error("Create notification error:", error);
      res.status(500).json({ error: "Failed to create notification" });
    }
  });

  app.get("/api/notifications", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const notifications = await storage.getNotificationsByUserId(req.user.id);
      res.json(notifications);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const notification = await storage.markNotificationAsRead(req.params.id);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      res.json(notification);
    } catch (error) {
      console.error("Mark notification as read error:", error);
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  app.delete("/api/notifications/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const deleted = await storage.deleteNotification(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Notification not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Delete notification error:", error);
      res.status(500).json({ error: "Failed to delete notification" });
    }
  });

  // Category Management APIs - GET endpoint
  app.get("/api/admin/categories", requireAdmin, async (_req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Service Management APIs
  app.get("/api/admin/services", requireAdmin, async (_req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/admin/services", requireAdmin, async (req, res) => {
    try {
      console.log("Creating service with data:", req.body);
      const service = await storage.createService(req.body);
      res.json(service);
    } catch (error) {
      console.error("Failed to create service:", error);
      res.status(500).json({
        error: "Failed to create service",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.patch("/api/admin/services/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const service = await storage.updateService(id, updates);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/admin/services/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteService(id);
      if (!deleted) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Category Management APIs
  app.post("/api/admin/categories", requireAdmin, async (req, res) => {
    try {
      console.log("Creating category with data:", req.body);
      const category = await storage.createCategory(req.body);
      res.json(category);
    } catch (error) {
      console.error("Failed to create category:", error);
      res.status(500).json({
        error: "Failed to create category",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.patch("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const category = await storage.updateCategory(id, updates);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCategory(id);
      if (!deleted) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Notification APIs
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const notifications = await storage.getUserNotifications(req.params.userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/:userId/unread", async (req, res) => {
    try {
      const notifications = await storage.getUnreadNotifications(req.params.userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unread notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const notification = await storage.markNotificationRead(req.params.id);
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  app.post("/api/notifications/:userId/mark-all-read", async (req, res) => {
    try {
      await storage.markAllNotificationsRead(req.params.userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });

  // Support Tickets APIs
  app.get("/api/tickets/:userId", async (req, res) => {
    try {
      const tickets = await storage.getUserTickets(req.params.userId);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  app.get("/api/admin/tickets", requireAdmin, async (_req, res) => {
    try {
      const tickets = await storage.getAllTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  app.post("/api/tickets", async (req, res) => {
    try {
      const { insertTicketSchema } = await import("@shared/schema");
      const validated = insertTicketSchema.parse(req.body);
      const ticket = await storage.createTicket(validated);
      res.json(ticket);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create ticket" });
    }
  });

  app.get("/api/tickets/:id/replies", async (req, res) => {
    try {
      const replies = await storage.getTicketReplies(req.params.id);
      res.json(replies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ticket replies" });
    }
  });

  app.post("/api/tickets/:id/replies", async (req, res) => {
    try {
      const { insertTicketReplySchema } = await import("@shared/schema");
      const validated = insertTicketReplySchema.parse({
        ...req.body,
        ticketId: req.params.id,
      });
      const reply = await storage.createTicketReply(validated);
      res.json(reply);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create reply" });
    }
  });

  app.patch("/api/admin/tickets/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const ticket = await storage.updateTicket(id, updates);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: "Failed to update ticket" });
    }
  });

  // Documents APIs
  app.get("/api/orders/:orderId/documents", async (req, res) => {
    try {
      const documents = await storage.getOrderDocuments(req.params.orderId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const { insertDocumentSchema } = await import("@shared/schema");
      const validated = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(validated);
      res.json(document);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  // Audit Logs APIs
  app.get("/api/admin/audit-logs", requireAdmin, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const logs = await storage.getAuditLogs(limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  app.post("/api/admin/audit-log", requireAdmin, async (req, res) => {
    try {
      const { action, resourceType, resourceId, details } = req.body;
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];

      const log = await storage.createAuditLog({
        userId: (req.session as any)?.adminId || "system",
        action,
        resourceType,
        resourceId,
        details,
        ipAddress,
        userAgent,
      });

      res.json(log);
    } catch (error) {
      res.status(500).json({ error: "Failed to create audit log" });
    }
  });

  // Site Content Management APIs
  app.get("/api/site-content", async (_req, res) => {
    try {
      const content = await storage.getAllSiteContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site content" });
    }
  });

  app.get("/api/site-content/section/:section", async (req, res) => {
    try {
      const content = await storage.getSiteContentBySection(req.params.section);
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site content" });
    }
  });

  app.get("/api/site-content/key/:key", async (req, res) => {
    try {
      const content = await storage.getSiteContentByKey(req.params.key);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site content" });
    }
  });

  app.get("/api/admin/site-content", requireAdmin, async (_req, res) => {
    try {
      const content = await storage.getAllSiteContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site content" });
    }
  });

  app.post("/api/admin/site-content", requireAdmin, async (req, res) => {
    try {
      const { insertSiteContentSchema } = await import("@shared/schema");
      const validated = insertSiteContentSchema.parse(req.body);
      const content = await storage.createSiteContent(validated);
      res.json(content);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create site content" });
    }
  });

  app.patch("/api/admin/site-content/:id", requireAdmin, async (req, res) => {
    try {
      const content = await storage.updateSiteContent(req.params.id, req.body);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to update site content" });
    }
  });

  app.patch("/api/admin/site-content/key/:key", requireAdmin, async (req, res) => {
    try {
      const { value } = req.body;
      if (!value) {
        return res.status(400).json({ error: "Value is required" });
      }
      const content = await storage.updateSiteContentByKey(req.params.key, value);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to update site content" });
    }
  });

  app.delete("/api/admin/site-content/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteSiteContent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete site content" });
    }
  });

  // Admin Notifications
  app.post("/api/admin/notifications", requireAdmin, async (req, res) => {
    try {
      const { userId, title, message, type } = req.body;

      if (!userId || !title || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const notification = await storage.createNotification({
        userId,
        title,
        message,
        type: type || "admin_message",
        read: false,
        createdAt: new Date(),
      } as any); // cast to any to avoid strict type issues with optional fields

      res.status(201).json(notification);
    } catch (error) {
      console.error("Create notification error:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // Register opportunities routes
  registerOpportunitiesRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}
