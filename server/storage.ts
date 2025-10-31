import {
  type Profile,
  type InsertProfile,
  type Category,
  type InsertCategory,
  type Service,
  type InsertService,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Lead,
  type InsertLead,
  type CartItem,
  type InsertCartItem,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;

  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  getAllServices(active?: boolean): Promise<Service[]>;
  getServicesByCategory(categoryId: string): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;

  getOrder(id: string): Promise<Order | undefined>;
  getOrdersBySession(sessionId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined>;

  getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;

  getCartItemsBySession(sessionId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQty(id: string, qty: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private profiles: Map<string, Profile>;
  private categories: Map<string, Category>;
  private services: Map<string, Service>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;
  private leads: Map<string, Lead>;
  private cartItems: Map<string, CartItem>;

  constructor() {
    this.profiles = new Map();
    this.categories = new Map();
    this.services = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.leads = new Map();
    this.cartItems = new Map();
  }

  async getProfile(id: string): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find((p) => p.email === email);
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const profile: Profile = {
      id,
      fullName: insertProfile.fullName,
      email: insertProfile.email,
      phone: insertProfile.phone ?? null,
      role: insertProfile.role ?? "business",
      createdAt: new Date(),
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(id: string, updates: Partial<InsertProfile>): Promise<Profile | undefined> {
    const profile = this.profiles.get(id);
    if (!profile) return undefined;
    const updated = { ...profile, ...updates };
    this.profiles.set(id, updated);
    return updated;
  }

  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find((c) => c.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      id,
      slug: insertCategory.slug,
      name: insertCategory.name,
      description: insertCategory.description ?? null,
      sortOrder: insertCategory.sortOrder ?? null,
      createdAt: new Date(),
    };
    this.categories.set(id, category);
    return category;
  }

  async getAllServices(active?: boolean): Promise<Service[]> {
    const services = Array.from(this.services.values());
    if (active !== undefined) {
      return services.filter((s) => s.active === active);
    }
    return services;
  }

  async getServicesByCategory(categoryId: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter((s) => s.categoryId === categoryId);
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    return Array.from(this.services.values()).find((s) => s.slug === slug);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = {
      id,
      categoryId: insertService.categoryId,
      slug: insertService.slug,
      name: insertService.name,
      summary: insertService.summary,
      longDescription: insertService.longDescription ?? null,
      basePriceInr: insertService.basePriceInr,
      sku: insertService.sku ?? null,
      etaDays: insertService.etaDays,
      icon: insertService.icon ?? "Package",
      active: insertService.active ?? true,
      problem: insertService.problem ?? null,
      outcome: insertService.outcome ?? null,
      includes: insertService.includes ?? null,
      prerequisites: insertService.prerequisites ?? null,
      timeline: insertService.timeline ?? null,
      faqs: insertService.faqs ?? null,
      createdAt: new Date(),
    };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: string, updates: Partial<InsertService>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    const updated = { ...service, ...updates };
    this.services.set(id, updated);
    return updated;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersBySession(sessionId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter((o) => o.sessionId === sessionId);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      id,
      userId: insertOrder.userId ?? null,
      sessionId: insertOrder.sessionId ?? null,
      status: insertOrder.status ?? "pending",
      subtotalInr: insertOrder.subtotalInr,
      gstInr: insertOrder.gstInr,
      totalInr: insertOrder.totalInr,
      razorpayOrderId: insertOrder.razorpayOrderId ?? null,
      razorpayPaymentId: insertOrder.razorpayPaymentId ?? null,
      razorpaySignature: insertOrder.razorpaySignature ?? null,
      customerName: insertOrder.customerName ?? null,
      customerEmail: insertOrder.customerEmail ?? null,
      customerPhone: insertOrder.customerPhone ?? null,
      customerAddress: insertOrder.customerAddress ?? null,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const updated = { ...order, ...updates };
    this.orders.set(id, updated);
    return updated;
  }

  async getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter((oi) => oi.orderId === orderId);
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const orderItem: OrderItem = {
      id,
      orderId: insertOrderItem.orderId,
      serviceId: insertOrderItem.serviceId,
      name: insertOrderItem.name,
      unitPriceInr: insertOrderItem.unitPriceInr,
      qty: insertOrderItem.qty ?? 1,
      totalInr: insertOrderItem.totalInr,
      createdAt: new Date(),
    };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = {
      id,
      userId: insertLead.userId ?? null,
      name: insertLead.name,
      email: insertLead.email,
      phone: insertLead.phone,
      role: insertLead.role,
      message: insertLead.message,
      kind: insertLead.kind ?? "general",
      capturedVia: insertLead.capturedVia ?? "web_form",
      metadata: insertLead.metadata ?? null,
      createdAt: new Date(),
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getCartItemsBySession(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter((ci) => ci.sessionId === sessionId);
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    const existing = Array.from(this.cartItems.values()).find(
      (ci) => ci.sessionId === insertCartItem.sessionId && ci.serviceId === insertCartItem.serviceId
    );

    if (existing) {
      existing.qty += insertCartItem.qty ?? 1;
      this.cartItems.set(existing.id, existing);
      return existing;
    }

    const id = randomUUID();
    const cartItem: CartItem = {
      id,
      sessionId: insertCartItem.sessionId,
      serviceId: insertCartItem.serviceId,
      qty: insertCartItem.qty ?? 1,
      createdAt: new Date(),
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQty(id: string, qty: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    cartItem.qty = qty;
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    const items = await this.getCartItemsBySession(sessionId);
    items.forEach((item) => this.cartItems.delete(item.id));
  }
}

export const storage = new MemStorage();
