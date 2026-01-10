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
  type Notification,
  type InsertNotification,
  type Company,
  type InsertCompany,
  type JobPost,
  type InsertJobPost,
  type JobApplication,
  type InsertJobApplication,
  type JobPostPayment,
  type InsertJobPostPayment,
  type CompanySubscription,
  type InsertCompanySubscription,
  type SavedJob,
  type SavedCompany,
  profiles,
  categories,
  services,
  orders,
  orderItems,
  leads,
  cartItems,
  notifications,
  companies,
  jobPosts,
  jobApplications,
  jobPostPayments,
  companySubscriptions,
  savedJobs,
  savedCompanies
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
}

export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export interface IStorage {
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;

  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  getAllServices(active?: boolean): Promise<Service[]>;
  getServicesByCategory(categoryId: string): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;

  getOrder(id: string): Promise<Order | undefined>;
  getOrdersBySession(sessionId: string): Promise<Order[]>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
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

  getAllProfiles(): Promise<Profile[]>;
  deleteProfile(id: string): Promise<boolean>;

  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUserId(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<Notification | undefined>;
  deleteNotification(id: string): Promise<boolean>;

  // Opportunities & Company Listings
  getAllCompanies(): Promise<Company[]>;
  getCompany(id: string): Promise<Company | undefined>;
  getCompanyByUserId(userId: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, company: Partial<InsertCompany>): Promise<Company | undefined>;
  deleteCompany(id: string): Promise<boolean>;

  getAllJobPosts(filters?: any): Promise<JobPost[]>;
  getJobPost(id: string): Promise<JobPost | undefined>;
  getJobPostBySlug(slug: string): Promise<JobPost | undefined>;
  getJobPostsByCompany(companyId: string): Promise<JobPost[]>;
  createJobPost(jobPost: InsertJobPost): Promise<JobPost>;
  updateJobPost(id: string, jobPost: Partial<InsertJobPost>): Promise<JobPost | undefined>;
  deleteJobPost(id: string): Promise<boolean>;

  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  getJobApplication(id: string): Promise<JobApplication | undefined>;
  getJobApplicationsByJob(jobPostId: string): Promise<JobApplication[]>;
  getJobApplicationsByCandidate(candidateId: string): Promise<JobApplication[]>;
  checkExistingApplication(jobPostId: string, candidateId: string): Promise<boolean>;
  updateJobApplication(id: string, updates: Partial<InsertJobApplication>): Promise<JobApplication | undefined>;

  saveJob(data: any): Promise<SavedJob>;
  unsaveJob(userId: string, jobPostId: string): Promise<void>;
  isJobSaved(userId: string, jobPostId: string): Promise<boolean>;
  getSavedJobs(userId: string): Promise<SavedJob[]>;

  createJobPostPayment(payment: InsertJobPostPayment): Promise<JobPostPayment>;
  getJobPostPayment(jobPostId: string): Promise<JobPostPayment | undefined>;
  updateJobPostPayment(id: string, updates: Partial<InsertJobPostPayment>): Promise<JobPostPayment | undefined>;

  createCompanySubscription(subscription: InsertCompanySubscription): Promise<CompanySubscription>;
  getCompanySubscription(companyId: string): Promise<CompanySubscription | undefined>;

  // Stubs for compatibility
  getUserNotifications(userId: string): Promise<any[]>;
  getUnreadNotifications(userId: string): Promise<any[]>;
  markNotificationRead(id: string): Promise<any>;
  markAllNotificationsRead(userId: string): Promise<void>;
  getUserTickets(userId: string): Promise<any[]>;
  getAllTickets(): Promise<any[]>;
  createTicket(data: any): Promise<any>;
  getTicketReplies(ticketId: string): Promise<any[]>;
  createTicketReply(data: any): Promise<any>;
  updateTicket(id: string, data: any): Promise<any>;
  getOrderDocuments(orderId: string): Promise<any[]>;
  createDocument(data: any): Promise<any>;
  getAuditLogs(limit?: number): Promise<any[]>;
  createAuditLog(data: any): Promise<any>;
  getAllSiteContent(): Promise<any[]>;
  getSiteContentBySection(section: string): Promise<any[]>;
  getSiteContentByKey(key: string): Promise<any>;
  createSiteContent(data: any): Promise<any>;
  updateSiteContent(id: string, data: any): Promise<any>;
  updateSiteContentByKey(key: string, data: any): Promise<any>;
  deleteSiteContent(id: string): Promise<boolean>;
}

export class DrizzleStorage implements IStorage {
  async getProfile(id: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile;
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.email, email));
    return profile;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(insertProfile).returning();
    return profile;
  }

  async updateProfile(id: string, updates: Partial<InsertProfile>): Promise<Profile | undefined> {
    const [profile] = await db
      .update(profiles)
      .set(updates)
      .where(eq(profiles.id, id))
      .returning();
    return profile;
  }

  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.sortOrder);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning();
    return category;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning();
    return !!deleted;
  }

  async getAllServices(active?: boolean): Promise<Service[]> {
    if (active !== undefined) {
      return await db.select().from(services).where(eq(services.active, active));
    }
    return await db.select().from(services);
  }

  async getServicesByCategory(categoryId: string): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.categoryId, categoryId));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.slug, slug));
    return service;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }

  async updateService(id: string, updates: Partial<InsertService>): Promise<Service | undefined> {
    const [service] = await db
      .update(services)
      .set(updates)
      .where(eq(services.id, id))
      .returning();
    return service;
  }

  async deleteService(id: string): Promise<boolean> {
    const [deleted] = await db.delete(services).where(eq(services.id, id)).returning();
    return !!deleted;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersBySession(sessionId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.sessionId, sessionId));
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const [order] = await db.update(orders).set(updates).where(eq(orders.id, id)).returning();
    return order;
  }

  async getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const [item] = await db.insert(orderItems).values(insertOrderItem).returning();
    return item;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getCartItemsBySession(sessionId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item exists in cart
    const [existing] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.sessionId, insertCartItem.sessionId),
          eq(cartItems.serviceId, insertCartItem.serviceId)
        )
      );

    if (existing) {
      const [updated] = await db
        .update(cartItems)
        .set({ qty: existing.qty + (insertCartItem.qty || 1) })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated;
    }

    const [item] = await db.insert(cartItems).values(insertCartItem).returning();
    return item;
  }

  async updateCartItemQty(id: string, qty: number): Promise<CartItem | undefined> {
    const [item] = await db
      .update(cartItems)
      .set({ qty })
      .where(eq(cartItems.id, id))
      .returning();
    return item;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const [deleted] = await db.delete(cartItems).where(eq(cartItems.id, id)).returning();
    return !!deleted;
  }

  async clearCart(sessionId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
  }

  async getAllProfiles(): Promise<Profile[]> {
    return await db.select().from(profiles).orderBy(desc(profiles.createdAt));
  }

  async deleteProfile(id: string): Promise<boolean> {
    const [deleted] = await db.delete(profiles).where(eq(profiles.id, id)).returning();
    return !!deleted;
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(insertNotification).returning();
    return notification;
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    const [notification] = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }

  async deleteNotification(id: string): Promise<boolean> {
    const [deleted] = await db.delete(notifications).where(eq(notifications.id, id)).returning();
    return !!deleted;
  }

  // --- Companies ---
  async getAllCompanies(): Promise<Company[]> {
    return await db.select().from(companies);
  }

  async getCompany(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  async getCompanyByUserId(userId: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.userId, userId));
    return company;
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const [company] = await db.insert(companies).values(insertCompany).returning();
    return company;
  }

  async updateCompany(id: string, updates: Partial<Company>): Promise<Company | undefined> {
    const [company] = await db.update(companies).set(updates).where(eq(companies.id, id)).returning();
    return company;
  }

  async deleteCompany(id: string): Promise<boolean> {
    // First delete all job posts for this company (which also deletes their applications via deleteJobPost)
    const companyJobs = await db.select().from(jobPosts).where(eq(jobPosts.companyId, id));
    for (const job of companyJobs) {
      await this.deleteJobPost(job.id);
    }
    // Then delete the company
    const [deleted] = await db.delete(companies).where(eq(companies.id, id)).returning();
    return !!deleted;
  }

  // --- Job Posts ---
  async getAllJobPosts(filters?: any): Promise<JobPost[]> {
    let query = db.select().from(jobPosts);
    if (filters) {
      // Apply filters if needed
    }
    return await query.orderBy(desc(jobPosts.createdAt));
  }

  async getJobPost(id: string): Promise<JobPost | undefined> {
    const [job] = await db.select().from(jobPosts).where(eq(jobPosts.id, id));
    return job;
  }

  async getJobPostBySlug(slug: string): Promise<JobPost | undefined> {
    const [job] = await db.select().from(jobPosts).where(eq(jobPosts.slug, slug));
    return job;
  }

  async getJobPostsByCompany(companyId: string): Promise<JobPost[]> {
    return await db.select().from(jobPosts).where(eq(jobPosts.companyId, companyId));
  }

  async createJobPost(insertJob: InsertJobPost): Promise<JobPost> {
    const [job] = await db.insert(jobPosts).values(insertJob).returning();
    return job;
  }

  async updateJobPost(id: string, updates: Partial<JobPost>): Promise<JobPost | undefined> {
    const [job] = await db.update(jobPosts).set(updates).where(eq(jobPosts.id, id)).returning();
    return job;
  }

  async deleteJobPost(id: string): Promise<boolean> {
    // First delete related applications
    await db.delete(jobApplications).where(eq(jobApplications.jobPostId, id));
    // Then delete the job post
    const [deleted] = await db.delete(jobPosts).where(eq(jobPosts.id, id)).returning();
    return !!deleted;
  }

  // --- Job Applications ---
  async createJobApplication(insertApp: InsertJobApplication): Promise<JobApplication> {
    const [app] = await db.insert(jobApplications).values(insertApp).returning();
    return app;
  }

  async getJobApplication(id: string): Promise<JobApplication | undefined> {
    const [app] = await db.select().from(jobApplications).where(eq(jobApplications.id, id));
    return app;
  }

  async getJobApplicationsByJob(jobPostId: string): Promise<JobApplication[]> {
    return await db.select().from(jobApplications).where(eq(jobApplications.jobPostId, jobPostId));
  }

  async getJobApplicationsByCandidate(candidateId: string): Promise<JobApplication[]> {
    return await db.select().from(jobApplications).where(eq(jobApplications.candidateId, candidateId));
  }

  async checkExistingApplication(jobPostId: string, candidateId: string): Promise<boolean> {
    const [app] = await db.select().from(jobApplications)
      .where(and(eq(jobApplications.jobPostId, jobPostId), eq(jobApplications.candidateId, candidateId)));
    return !!app;
  }

  async updateJobApplication(id: string, updates: Partial<JobApplication>): Promise<JobApplication | undefined> {
    const [app] = await db.update(jobApplications).set(updates).where(eq(jobApplications.id, id)).returning();
    return app;
  }

  // --- Saved Jobs (Simple Implementation) ---
  async saveJob(data: any): Promise<SavedJob> {
    const [saved] = await db.insert(savedJobs).values(data).returning();
    return saved;
  }

  async unsaveJob(userId: string, jobPostId: string): Promise<void> {
    await db.delete(savedJobs).where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobPostId, jobPostId)));
  }

  async isJobSaved(userId: string, jobPostId: string): Promise<boolean> {
    const [saved] = await db.select().from(savedJobs).where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobPostId, jobPostId)));
    return !!saved;
  }

  async getSavedJobs(userId: string): Promise<SavedJob[]> {
    return await db.select().from(savedJobs).where(eq(savedJobs.userId, userId));
  }

  // --- Payments ---
  async createJobPostPayment(payment: InsertJobPostPayment): Promise<JobPostPayment> {
    const [p] = await db.insert(jobPostPayments).values(payment).returning();
    return p;
  }

  async getJobPostPayment(jobPostId: string): Promise<JobPostPayment | undefined> {
    const [p] = await db.select().from(jobPostPayments).where(eq(jobPostPayments.jobPostId, jobPostId));
    return p;
  }

  async updateJobPostPayment(id: string, updates: Partial<JobPostPayment>): Promise<JobPostPayment | undefined> {
    const [p] = await db.update(jobPostPayments).set(updates).where(eq(jobPostPayments.id, id)).returning();
    return p;
  }

  async createCompanySubscription(subscription: InsertCompanySubscription): Promise<CompanySubscription> {
    const [sub] = await db.insert(companySubscriptions).values(subscription).returning();
    return sub;
  }

  async getCompanySubscription(companyId: string): Promise<CompanySubscription | undefined> {
    const [sub] = await db.select().from(companySubscriptions).where(eq(companySubscriptions.companyId, companyId));
    return sub;
  }

  // Stubs for compatibility
  async getUserNotifications(userId: string): Promise<any[]> { return []; }
  async getUnreadNotifications(userId: string): Promise<any[]> { return []; }
  async markNotificationRead(id: string): Promise<any> { return { id }; }
  async markAllNotificationsRead(userId: string): Promise<void> { }
  async getUserTickets(userId: string): Promise<any[]> { return []; }
  async getAllTickets(): Promise<any[]> { return []; }
  async createTicket(data: any): Promise<any> { return { id: "stub" }; }
  async getTicketReplies(ticketId: string): Promise<any[]> { return []; }
  async createTicketReply(data: any): Promise<any> { return { id: "stub" }; }
  async updateTicket(id: string, data: any): Promise<any> { return { id: "stub" }; }
  async getOrderDocuments(orderId: string): Promise<any[]> { return []; }
  async createDocument(data: any): Promise<any> { return { id: "stub" }; }
  async getAuditLogs(limit?: number): Promise<any[]> { return []; }
  async createAuditLog(data: any): Promise<any> { return { id: "stub" }; }
  async getAllSiteContent(): Promise<any[]> { return []; }
  async getSiteContentBySection(section: string): Promise<any[]> { return []; }
  async getSiteContentByKey(key: string): Promise<any> { return {}; }
  async createSiteContent(data: any): Promise<any> { return { id: "stub" }; }
  async updateSiteContent(id: string, data: any): Promise<any> { return { id: "stub" }; }
  async updateSiteContentByKey(key: string, data: any): Promise<any> { return { id: "stub" }; }
  async deleteSiteContent(id: string): Promise<boolean> { return true; }
}

export const storage = new DrizzleStorage();
