import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { seedDatabase } from "./seed";

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

  const httpServer = createServer(app);

  return httpServer;
}
