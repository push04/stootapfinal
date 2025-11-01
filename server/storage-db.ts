import { supabaseServer } from "./supabase-server";
import type {
  Profile,
  InsertProfile,
  Category,
  InsertCategory,
  Service,
  InsertService,
  Order,
  InsertOrder,
  OrderItem,
  InsertOrderItem,
  Lead,
  InsertLead,
  CartItem,
  InsertCartItem,
  Notification,
  InsertNotification,
  NotificationPreferences,
  InsertNotificationPreferences,
  Document,
  InsertDocument,
  Ticket,
  InsertTicket,
  TicketReply,
  InsertTicketReply,
  AuditLog,
  InsertAuditLog,
  SubscriptionPlan,
  InsertSubscriptionPlan,
  UserSubscription,
  InsertUserSubscription,
  SiteContent,
  InsertSiteContent,
} from "@shared/schema";
import type { IStorage } from "./storage";

export function toCamelCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj !== 'object') return obj;

  const newObj: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    newObj[camelKey] = toCamelCase(obj[key]);
  }
  return newObj;
}

export function toSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (typeof obj !== 'object') return obj;

  const newObj: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    newObj[snakeKey] = toSnakeCase(obj[key]);
  }
  return newObj;
}

export class DatabaseStorage implements IStorage {
  async getProfile(id: string): Promise<Profile | undefined> {
    const { data } = await supabaseServer
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    return toCamelCase(data) || undefined;
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const { data } = await supabaseServer
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();
    return toCamelCase(data) || undefined;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const snakeCaseProfile = toSnakeCase(profile);
    const { data, error } = await supabaseServer
      .from("profiles")
      .insert(snakeCaseProfile)
      .select()
      .single();
    if (error) throw new Error(`Failed to create profile: ${error.message}`);
    return toCamelCase(data);
  }

  async updateProfile(id: string, updates: Partial<InsertProfile>): Promise<Profile | undefined> {
    const snakeCaseUpdates = toSnakeCase(updates);
    const { data } = await supabaseServer
      .from("profiles")
      .update(snakeCaseUpdates)
      .eq("id", id)
      .select()
      .single();
    return toCamelCase(data) || undefined;
  }

  async getAllCategories(): Promise<Category[]> {
    const { data } = await supabaseServer
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    return toCamelCase(data) || [];
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const { data } = await supabaseServer
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();
    return toCamelCase(data) || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const snakeCaseCategory = toSnakeCase(category);
    const { data, error } = await supabaseServer
      .from("categories")
      .insert(snakeCaseCategory)
      .select()
      .single();
    if (error) throw new Error(`Failed to create category: ${error.message}`);
    return toCamelCase(data);
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const snakeCaseUpdates = toSnakeCase(updates);
    const { data } = await supabaseServer
      .from("categories")
      .update(snakeCaseUpdates)
      .eq("id", id)
      .select()
      .single();
    return toCamelCase(data) || undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabaseServer
      .from("categories")
      .delete()
      .eq("id", id);
    return !error;
  }

  async getAllServices(active?: boolean): Promise<Service[]> {
    let query = supabaseServer.from("services").select("*");
    
    if (active !== undefined) {
      query = query.eq("active", active);
    }
    
    const { data } = await query;
    return toCamelCase(data) || [];
  }

  async getServicesByCategory(categoryId: string): Promise<Service[]> {
    const { data } = await supabaseServer
      .from("services")
      .select("*")
      .eq("category_id", categoryId);
    return toCamelCase(data) || [];
  }

  async getService(id: string): Promise<Service | undefined> {
    const { data } = await supabaseServer
      .from("services")
      .select("*")
      .eq("id", id)
      .single();
    return toCamelCase(data) || undefined;
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const { data } = await supabaseServer
      .from("services")
      .select("*")
      .eq("slug", slug)
      .single();
    return toCamelCase(data) || undefined;
  }

  async createService(service: InsertService): Promise<Service> {
    const snakeCaseService = toSnakeCase(service);
    const { data, error } = await supabaseServer
      .from("services")
      .insert(snakeCaseService)
      .select()
      .single();
    if (error) throw new Error(`Failed to create service: ${error.message}`);
    return toCamelCase(data);
  }

  async updateService(id: string, updates: Partial<InsertService>): Promise<Service | undefined> {
    const snakeCaseUpdates = toSnakeCase(updates);
    const { data } = await supabaseServer
      .from("services")
      .update(snakeCaseUpdates)
      .eq("id", id)
      .select()
      .single();
    return toCamelCase(data) || undefined;
  }

  async deleteService(id: string): Promise<boolean> {
    const { error } = await supabaseServer
      .from("services")
      .delete()
      .eq("id", id);
    return !error;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const { data } = await supabaseServer
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();
    return toCamelCase(data) || undefined;
  }

  async getOrdersBySession(sessionId: string): Promise<Order[]> {
    const { data } = await supabaseServer
      .from("orders")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false });
    return toCamelCase(data) || [];
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const { data } = await supabaseServer
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return toCamelCase(data) || [];
  }

  async getAllOrders(): Promise<Order[]> {
    const { data } = await supabaseServer
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false});
    return toCamelCase(data) || [];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const snakeCaseOrder = toSnakeCase(order);
    const { data, error } = await supabaseServer
      .from("orders")
      .insert(snakeCaseOrder)
      .select()
      .single();
    if (error) throw new Error(`Failed to create order: ${error.message}`);
    return toCamelCase(data);
  }

  async updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const snakeCaseUpdates = toSnakeCase(updates);
    const { data } = await supabaseServer
      .from("orders")
      .update(snakeCaseUpdates)
      .eq("id", id)
      .select()
      .single();
    return toCamelCase(data) || undefined;
  }

  async getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    const { data } = await supabaseServer
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);
    return toCamelCase(data) || [];
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const snakeCaseOrderItem = toSnakeCase(orderItem);
    const { data, error } = await supabaseServer
      .from("order_items")
      .insert(snakeCaseOrderItem)
      .select()
      .single();
    if (error) throw new Error(`Failed to create order item: ${error.message}`);
    return toCamelCase(data);
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const snakeCaseLead = toSnakeCase(lead);
    const { data, error } = await supabaseServer
      .from("leads")
      .insert(snakeCaseLead)
      .select()
      .single();
    if (error) throw new Error(`Failed to create lead: ${error.message}`);
    return toCamelCase(data);
  }

  async getAllLeads(): Promise<Lead[]> {
    const { data } = await supabaseServer
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    return toCamelCase(data) || [];
  }

  async getCartItemsBySession(sessionId: string): Promise<CartItem[]> {
    const { data } = await supabaseServer
      .from("cart_items")
      .select("*")
      .eq("session_id", sessionId);
    return toCamelCase(data) || [];
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const snakeCaseCartItem = toSnakeCase(cartItem);
    
    // Check if item already exists in cart
    const { data: existing } = await supabaseServer
      .from("cart_items")
      .select("*")
      .eq("session_id", snakeCaseCartItem.session_id)
      .eq("service_id", snakeCaseCartItem.service_id)
      .single();

    if (existing) {
      // Update quantity if exists
      const { data, error } = await supabaseServer
        .from("cart_items")
        .update({ qty: existing.qty + (snakeCaseCartItem.qty ?? 1) })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw new Error(`Failed to update cart: ${error.message}`);
      return toCamelCase(data);
    }

    // Insert new cart item
    const { data, error } = await supabaseServer
      .from("cart_items")
      .insert(snakeCaseCartItem)
      .select()
      .single();
    if (error) throw new Error(`Failed to add to cart: ${error.message}`);
    return toCamelCase(data);
  }

  async updateCartItemQty(id: string, qty: number): Promise<CartItem | undefined> {
    const { data } = await supabaseServer
      .from("cart_items")
      .update({ qty })
      .eq("id", id)
      .select()
      .single();
    return toCamelCase(data) || undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const { error } = await supabaseServer
      .from("cart_items")
      .delete()
      .eq("id", id);
    return !error;
  }

  async clearCart(sessionId: string): Promise<void> {
    await supabaseServer
      .from("cart_items")
      .delete()
      .eq("session_id", sessionId);
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const { data, error } = await supabaseServer
      .from("notifications")
      .insert(notification)
      .select()
      .single();
    if (error) throw new Error(`Failed to create notification: ${error.message}`);
    return data;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    const { data } = await supabaseServer
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return data || [];
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    const { data } = await supabaseServer
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .eq("read", false)
      .order("created_at", { ascending: false });
    return data || [];
  }

  async markNotificationRead(id: string): Promise<Notification | undefined> {
    const { data } = await supabaseServer
      .from("notifications")
      .update({ read: true })
      .eq("id", id)
      .select()
      .single();
    return data || undefined;
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    await supabaseServer
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId);
  }

  async getUserNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined> {
    const { data } = await supabaseServer
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();
    return data || undefined;
  }

  async createNotificationPreferences(prefs: InsertNotificationPreferences): Promise<NotificationPreferences> {
    const { data, error } = await supabaseServer
      .from("notification_preferences")
      .insert(prefs)
      .select()
      .single();
    if (error) throw new Error(`Failed to create notification preferences: ${error.message}`);
    return data;
  }

  async updateNotificationPreferences(userId: string, updates: Partial<InsertNotificationPreferences>): Promise<NotificationPreferences | undefined> {
    const { data } = await supabaseServer
      .from("notification_preferences")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();
    return data || undefined;
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const { data, error } = await supabaseServer
      .from("documents")
      .insert(document)
      .select()
      .single();
    if (error) throw new Error(`Failed to create document: ${error.message}`);
    return data;
  }

  async getOrderDocuments(orderId: string): Promise<Document[]> {
    const { data } = await supabaseServer
      .from("documents")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });
    return data || [];
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const { data } = await supabaseServer
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();
    return data || undefined;
  }

  async updateDocument(id: string, updates: Partial<InsertDocument>): Promise<Document | undefined> {
    const { data } = await supabaseServer
      .from("documents")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return data || undefined;
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const { data, error } = await supabaseServer
      .from("tickets")
      .insert(ticket)
      .select()
      .single();
    if (error) throw new Error(`Failed to create ticket: ${error.message}`);
    return data;
  }

  async getTicket(id: string): Promise<Ticket | undefined> {
    const { data } = await supabaseServer
      .from("tickets")
      .select("*")
      .eq("id", id)
      .single();
    return data || undefined;
  }

  async getUserTickets(userId: string): Promise<Ticket[]> {
    const { data } = await supabaseServer
      .from("tickets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return data || [];
  }

  async getAllTickets(): Promise<Ticket[]> {
    const { data} = await supabaseServer
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  }

  async updateTicket(id: string, updates: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const { data } = await supabaseServer
      .from("tickets")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    return data || undefined;
  }

  async createTicketReply(reply: InsertTicketReply): Promise<TicketReply> {
    const { data, error } = await supabaseServer
      .from("ticket_replies")
      .insert(reply)
      .select()
      .single();
    if (error) throw new Error(`Failed to create ticket reply: ${error.message}`);
    return data;
  }

  async getTicketReplies(ticketId: string): Promise<TicketReply[]> {
    const { data } = await supabaseServer
      .from("ticket_replies")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
    return data || [];
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const { data, error } = await supabaseServer
      .from("audit_logs")
      .insert(log)
      .select()
      .single();
    if (error) throw new Error(`Failed to create audit log: ${error.message}`);
    return data;
  }

  async getAuditLogs(limit = 100): Promise<AuditLog[]> {
    const { data } = await supabaseServer
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    return data || [];
  }

  async getUserAuditLogs(userId: string, limit = 50): Promise<AuditLog[]> {
    const { data } = await supabaseServer
      .from("audit_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    return data || [];
  }

  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const { data, error } = await supabaseServer
      .from("subscription_plans")
      .insert(plan)
      .select()
      .single();
    if (error) throw new Error(`Failed to create subscription plan: ${error.message}`);
    return data;
  }

  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const { data } = await supabaseServer
      .from("subscription_plans")
      .select("*")
      .eq("active", true);
    return data || [];
  }

  async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined> {
    const { data } = await supabaseServer
      .from("subscription_plans")
      .select("*")
      .eq("id", id)
      .single();
    return data || undefined;
  }

  async createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription> {
    const { data, error } = await supabaseServer
      .from("user_subscriptions")
      .insert(subscription)
      .select()
      .single();
    if (error) throw new Error(`Failed to create user subscription: ${error.message}`);
    return data;
  }

  async getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
    const { data } = await supabaseServer
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return data || [];
  }

  async updateUserSubscription(id: string, updates: Partial<InsertUserSubscription>): Promise<UserSubscription | undefined> {
    const { data } = await supabaseServer
      .from("user_subscriptions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return data || undefined;
  }

  async getAllSiteContent(): Promise<SiteContent[]> {
    const { data } = await supabaseServer
      .from("site_content")
      .select("*")
      .order("section", { ascending: true })
      .order("sort_order", { ascending: true });
    return data || [];
  }

  async getSiteContentBySection(section: string): Promise<SiteContent[]> {
    const { data } = await supabaseServer
      .from("site_content")
      .select("*")
      .eq("section", section)
      .order("sort_order", { ascending: true });
    return data || [];
  }

  async getSiteContentByKey(key: string): Promise<SiteContent | undefined> {
    const { data } = await supabaseServer
      .from("site_content")
      .select("*")
      .eq("key", key)
      .single();
    return data || undefined;
  }

  async createSiteContent(content: InsertSiteContent): Promise<SiteContent> {
    const { data, error } = await supabaseServer
      .from("site_content")
      .insert(content)
      .select()
      .single();
    if (error) throw new Error(`Failed to create site content: ${error.message}`);
    return data;
  }

  async updateSiteContent(id: string, updates: Partial<InsertSiteContent>): Promise<SiteContent | undefined> {
    const updated = { ...updates, updated_at: new Date().toISOString() };
    const { data } = await supabaseServer
      .from("site_content")
      .update(updated)
      .eq("id", id)
      .select()
      .single();
    return data || undefined;
  }

  async updateSiteContentByKey(key: string, value: string): Promise<SiteContent | undefined> {
    const updated = { value, updated_at: new Date().toISOString() };
    const { data } = await supabaseServer
      .from("site_content")
      .update(updated)
      .eq("key", key)
      .select()
      .single();
    return data || undefined;
  }

  async deleteSiteContent(id: string): Promise<boolean> {
    const { error } = await supabaseServer
      .from("site_content")
      .delete()
      .eq("id", id);
    return !error;
  }
}

export const storage = new DatabaseStorage();
