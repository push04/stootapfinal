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
} from "@shared/schema";
import type { IStorage } from "./storage";

// Helper to convert snake_case to camelCase
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

// Helper to convert camelCase to snake_case
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
    const { data } = await supabaseServer.from("profiles").select("*").eq("id", id).single();
    return toCamelCase(data) || undefined;
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const { data } = await supabaseServer.from("profiles").select("*").eq("email", email).single();
    return toCamelCase(data) || undefined;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const snakeCaseProfile = toSnakeCase(profile);
    const { data, error } = await supabaseServer.from("profiles").insert(snakeCaseProfile).select().single();
    if (error) throw new Error(`Failed to create profile: ${error.message}`);
    return toCamelCase(data);
  }

  async updateProfile(id: string, updates: Partial<InsertProfile>): Promise<Profile | undefined> {
    const snakeCaseUpdates = toSnakeCase(updates);
    const { data } = await supabaseServer.from("profiles").update(snakeCaseUpdates).eq("id", id).select().single();
    return toCamelCase(data) || undefined;
  }

  async getAllCategories(): Promise<Category[]> {
    const { data } = await supabaseServer.from("categories").select("*").order("sort_order", { ascending: true });
    return toCamelCase(data) || [];
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const { data } = await supabaseServer.from("categories").select("*").eq("slug", slug).single();
    return toCamelCase(data) || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const snakeCaseCategory = toSnakeCase(category);
    const { data, error } = await supabaseServer.from("categories").insert(snakeCaseCategory).select().single();
    if (error) throw new Error(`Failed to create category: ${error.message}`);
    return toCamelCase(data);
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const snakeCaseUpdates = toSnakeCase(updates);
    const { data } = await supabaseServer.from("categories").update(snakeCaseUpdates).eq("id", id).select().single();
    return toCamelCase(data) || undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabaseServer.from("categories").delete().eq("id", id);
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
    const { data } = await supabaseServer.from("services").select("*").eq("category_id", categoryId);
    return toCamelCase(data) || [];
  }

  async getService(id: string): Promise<Service | undefined> {
    const { data } = await supabaseServer.from("services").select("*").eq("id", id).single();
    return toCamelCase(data) || undefined;
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const { data } = await supabaseServer.from("services").select("*").eq("slug", slug).single();
    return toCamelCase(data) || undefined;
  }

  async createService(service: InsertService): Promise<Service> {
    const snakeCaseService = toSnakeCase(service);
    const { data, error } = await supabaseServer.from("services").insert(snakeCaseService).select().single();
    if (error) throw new Error(`Failed to create service: ${error.message}`);
    return toCamelCase(data);
  }

  async updateService(id: string, updates: Partial<InsertService>): Promise<Service | undefined> {
    const snakeCaseUpdates = toSnakeCase(updates);
    const { data } = await supabaseServer.from("services").update(snakeCaseUpdates).eq("id", id).select().single();
    return toCamelCase(data) || undefined;
  }

  async deleteService(id: string): Promise<boolean> {
    const { error } = await supabaseServer.from("services").delete().eq("id", id);
    return !error;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const { data } = await supabaseServer.from("orders").select("*").eq("id", id).single();
    return toCamelCase(data) || undefined;
  }

  async getOrdersBySession(sessionId: string): Promise<Order[]> {
    const { data } = await supabaseServer.from("orders").select("*").eq("session_id", sessionId).order("created_at", { ascending: false });
    return toCamelCase(data) || [];
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const { data } = await supabaseServer.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    return toCamelCase(data) || [];
  }

  async getAllOrders(): Promise<Order[]> {
    const { data } = await supabaseServer.from("orders").select("*").order("created_at", { ascending: false});
    return toCamelCase(data) || [];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const snakeCaseOrder = toSnakeCase(order);
    const { data, error } = await supabaseServer.from("orders").insert(snakeCaseOrder).select().single();
    if (error) throw new Error(`Failed to create order: ${error.message}`);
    return toCamelCase(data);
  }

  async updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const snakeCaseUpdates = toSnakeCase(updates);
    const { data } = await supabaseServer.from("orders").update(snakeCaseUpdates).eq("id", id).select().single();
    return toCamelCase(data) || undefined;
  }

  async getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    const { data } = await supabaseServer.from("order_items").select("*").eq("order_id", orderId);
    return toCamelCase(data) || [];
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const snakeCaseOrderItem = toSnakeCase(orderItem);
    const { data, error } = await supabaseServer.from("order_items").insert(snakeCaseOrderItem).select().single();
    if (error) throw new Error(`Failed to create order item: ${error.message}`);
    return toCamelCase(data);
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const snakeCaseLead = toSnakeCase(lead);
    const { data, error } = await supabaseServer.from("leads").insert(snakeCaseLead).select().single();
    if (error) throw new Error(`Failed to create lead: ${error.message}`);
    return toCamelCase(data);
  }

  async getAllLeads(): Promise<Lead[]> {
    const { data } = await supabaseServer.from("leads").select("*").order("created_at", { ascending: false });
    return toCamelCase(data) || [];
  }

  async getCartItemsBySession(sessionId: string): Promise<CartItem[]> {
    const { data } = await supabaseServer.from("cart_items").select("*").eq("session_id", sessionId);
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
    const { data, error } = await supabaseServer.from("cart_items").insert(snakeCaseCartItem).select().single();
    if (error) throw new Error(`Failed to add to cart: ${error.message}`);
    return toCamelCase(data);
  }

  async updateCartItemQty(id: string, qty: number): Promise<CartItem | undefined> {
    const { data } = await supabaseServer.from("cart_items").update({ qty }).eq("id", id).select().single();
    return toCamelCase(data) || undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const { error } = await supabaseServer.from("cart_items").delete().eq("id", id);
    return !error;
  }

  async clearCart(sessionId: string): Promise<void> {
    await supabaseServer.from("cart_items").delete().eq("session_id", sessionId);
  }
}

export const storage = new DatabaseStorage();
