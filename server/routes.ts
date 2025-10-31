import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-db";
import { seedDatabase } from "./seed";
import { ZodError } from "zod";
import { requireAdmin, loginAdmin } from "./auth";

// AI Concierge configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const AI_MODEL = "deepseek/deepseek-chat-v3-0324:free"; // Cost-effective model

export async function registerRoutes(app: Express): Promise<Server> {
  await seedDatabase();

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

  // Admin Authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      
      const result = await loginAdmin(req, username, password);
      
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
    if (req.session) {
      req.session.adminId = undefined;
    }
    res.json({ success: true });
  });

  app.get("/api/admin/check", (req, res) => {
    res.json({ isAdmin: !!req.session?.adminId });
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

  const httpServer = createServer(app);

  return httpServer;
}
