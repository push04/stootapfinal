import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-db";
import { ZodError } from "zod";
import { requireAdmin, loginAdmin, logoutAdmin, isAdminAuthenticated } from "./auth";
import Razorpay from "razorpay";
import crypto from "crypto";

// AI Concierge configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const AI_MODEL = "deepseek/deepseek-chat-v3-0324:free"; // Cost-effective model

// Razorpay configuration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
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
      const lead = await storage.createLead(validated);
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
        qty: validated.qty ?? 1,
      });
      
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

  // Payment API (Razorpay)
  app.get("/api/payment/razorpay-key", (_req, res) => {
    if (!RAZORPAY_KEY_ID) {
      return res.status(500).json({ error: "Razorpay not configured" });
    }
    res.json({ key: RAZORPAY_KEY_ID });
  });

  app.post("/api/payment/create-order", async (req, res) => {
    try {
      if (!razorpayInstance) {
        console.error("Razorpay not configured - missing credentials");
        return res.status(500).json({ error: "Razorpay not configured. Please contact support." });
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
        });

        const order = await storage.getOrder(orderId);
        
        if (order && order.customerEmail) {
          await storage.createNotification({
            userId: order.userId || "guest",
            type: "payment_success",
            title: "Payment Successful",
            message: `Your payment of ₹${order.totalInr} was successful. Order ID: ${order.id}`,
            actionUrl: `/orders/${order.id}`,
          });
        }

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
      const validated = insertOrderSchema.parse(req.body);
      
      const order = await storage.createOrder(validated);
      
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          await storage.createOrderItem({
            orderId: order.id,
            serviceId: item.serviceId,
            name: item.name,
            unitPriceInr: item.unitPriceInr,
            qty: item.qty,
            totalInr: item.totalInr,
          });
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

  // AI Concierge API
  app.post("/api/ai/concierge", async (req, res) => {
    try {
      const { messages, userRole = "business" } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array required" });
      }

      if (!OPENROUTER_API_KEY) {
        return res.status(500).json({ error: "OpenRouter API key not configured" });
      }

      // Get all categories and services for context
      const categories = await storage.getAllCategories();
      const services = await storage.getAllServices(true);
      
      // Build system prompt with business context
      const systemPrompt = `You are an AI business concierge for Stootap, a platform helping students and businesses in India launch and grow. You provide personalized guidance on business services.

Available Service Categories:
${categories.map(c => `- ${c.name}: ${c.description}`).join('\n')}

You have access to ${services.length} services across ${categories.length} categories. When users ask about services:
1. Understand their business needs
2. Recommend relevant services from our catalog
3. Explain benefits and outcomes clearly
4. Help them find the right services for their goals
5. Be friendly, professional, and concise

User role: ${userRole}
If they're a student, emphasize startup and funding opportunities. If business owner, focus on compliance and growth services.

Keep responses under 150 words. Be helpful and guide them toward taking action.`;

      // Make request to OpenRouter
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://stootap.com",
          "X-Title": "Stootap AI Concierge"
        },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages
          ],
          stream: false,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API error:", errorText);
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

      res.json({ 
        message: assistantMessage,
        model: AI_MODEL,
        usage: data.usage
      });

    } catch (error) {
      console.error("AI Concierge error:", error);
      res.status(500).json({ 
        error: "Failed to process AI request",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // User Authentication
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { fullName, email, password, phone, role } = req.body;
      
      if (!fullName || !email || !password) {
        return res.status(400).json({ error: "Full name, email, and password are required" });
      }
      
      const existingProfile = await storage.getProfileByEmail(email);
      if (existingProfile) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
      
      const profile = await storage.createProfile({
        fullName,
        email,
        phone: phone || null,
        passwordHash,
        role: role || "business",
      });
      
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
                message: "Registration successful",
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
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      const profile = await storage.getProfileByEmail(email);
      if (!profile) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
      if (profile.passwordHash !== passwordHash) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
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
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const profile = await storage.getProfile(req.session.userId);
      if (!profile) {
        req.session.userId = undefined;
        return res.status(401).json({ error: "User not found" });
      }
      
      res.json({
        id: profile.id,
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        createdAt: profile.createdAt
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ error: "Failed to get user profile" });
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

  // Admin Dashboard APIs
  app.get("/api/admin/analytics", requireAdmin, async (_req, res) => {
    try {
      const orders = await storage.getAllOrders();
      const leads = await storage.getAllLeads();
      const services = await storage.getAllServices();
      
      const totalRevenue = orders
        .filter(o => o.status === "completed")
        .reduce((sum, o) => sum + parseFloat(o.totalInr.toString()), 0);
      
      const pendingOrders = orders.filter(o => o.status === "pending").length;
      const completedOrders = orders.filter(o => o.status === "completed").length;
      
      const analytics = {
        totalOrders: orders.length,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue.toFixed(2),
        totalLeads: leads.length,
        totalServices: services.length,
        activeServices: services.filter(s => s.active).length,
        recentOrders: orders.slice(0, 10),
        recentLeads: leads.slice(0, 10),
      };
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/admin/orders", requireAdmin, async (_req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
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
      
      const order = await storage.updateOrder(id, { status });
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

  app.get("/api/admin/leads", requireAdmin, async (_req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

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
        userId: req.session?.adminId || "system",
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

  const httpServer = createServer(app);

  return httpServer;
}
