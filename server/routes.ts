import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-db";
import { seedDatabase } from "./seed";
import { ZodError } from "zod";
import { requireAdmin, loginAdmin } from "./auth";

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
