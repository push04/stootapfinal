import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role").notNull().default("business"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  summary: text("summary").notNull(),
  longDescription: text("long_description"),
  basePriceInr: decimal("base_price_inr", { precision: 10, scale: 2 }).notNull(),
  sku: text("sku"),
  etaDays: integer("eta_days").notNull(),
  icon: text("icon").default("Package"),
  active: boolean("active").default(true),
  problem: text("problem"),
  outcome: text("outcome"),
  includes: text("includes"),
  prerequisites: text("prerequisites"),
  timeline: text("timeline"),
  faqs: jsonb("faqs"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  sessionId: text("session_id"),
  status: text("status").notNull().default("pending"),
  subtotalInr: decimal("subtotal_inr", { precision: 10, scale: 2 }).notNull(),
  gstInr: decimal("gst_inr", { precision: 10, scale: 2 }).notNull(),
  totalInr: decimal("total_inr", { precision: 10, scale: 2 }).notNull(),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpaySignature: text("razorpay_signature"),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  customerAddress: text("customer_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  serviceId: varchar("service_id").notNull(),
  name: text("name").notNull(),
  unitPriceInr: decimal("unit_price_inr", { precision: 10, scale: 2 }).notNull(),
  qty: integer("qty").notNull().default(1),
  totalInr: decimal("total_inr", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  role: text("role").notNull(),
  message: text("message").notNull(),
  kind: text("kind").default("general"),
  capturedVia: text("captured_via").default("web_form"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  serviceId: varchar("service_id").notNull(),
  qty: integer("qty").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  actionUrl: text("action_url"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationPreferences = pgTable("notification_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  emailOrderPaid: boolean("email_order_paid").default(true),
  emailSubscriptionActivated: boolean("email_subscription_activated").default(true),
  emailInvoiceAvailable: boolean("email_invoice_available").default(true),
  emailTicketReply: boolean("email_ticket_reply").default(true),
  inAppOrderPaid: boolean("in_app_order_paid").default(true),
  inAppSubscriptionActivated: boolean("in_app_subscription_activated").default(true),
  inAppInvoiceAvailable: boolean("in_app_invoice_available").default(true),
  inAppTicketReply: boolean("in_app_ticket_reply").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  uploadedBy: varchar("uploaded_by").notNull(),
  uploaderRole: text("uploader_role").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  version: integer("version").default(1),
  category: text("category").notNull(),
  notes: text("notes"),
  scanStatus: text("scan_status").default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tickets = pgTable("tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  orderId: varchar("order_id"),
  category: text("category").notNull(),
  subject: text("subject").notNull(),
  status: text("status").notNull().default("open"),
  priority: text("priority").default("medium"),
  assignedTo: varchar("assigned_to"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ticketReplies = pgTable("ticket_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: varchar("ticket_id").notNull(),
  userId: varchar("user_id").notNull(),
  userRole: text("user_role").notNull(),
  message: text("message").notNull(),
  isInternal: boolean("is_internal").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: varchar("resource_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  priceInr: decimal("price_inr", { precision: 10, scale: 2 }).notNull(),
  billingInterval: text("billing_interval").notNull(),
  features: jsonb("features"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  planId: varchar("plan_id").notNull(),
  status: text("status").notNull().default("active"),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  razorpaySubscriptionId: text("razorpay_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteContent = pgTable("site_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  section: text("section").notNull(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  type: text("type").notNull().default("text"),
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============ OPPORTUNITIES & COMPANY LISTINGS ============

export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  phone: text("phone"),
  businessType: text("business_type").notNull(),
  websiteUrl: text("website_url"),
  gstin: text("gstin"),
  description: text("description"),
  city: text("city"),
  state: text("state"),
  registrationDocUrl: text("registration_doc_url"),
  logoUrl: text("logo_url"),
  verified: boolean("verified").default(false),
  status: text("status").notNull().default("active"),
  trialStartDate: timestamp("trial_start_date"),
  trialEndDate: timestamp("trial_end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const companySubscriptions = pgTable("company_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull(),
  planType: text("plan_type").notNull().default("featured"),
  status: text("status").notNull().default("trial"),
  priceInr: decimal("price_inr", { precision: 10, scale: 2 }).notNull().default("4999"),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpaySignature: text("razorpay_signature"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobPosts = pgTable("job_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  roleType: text("role_type").notNull(),
  isPaid: boolean("is_paid").notNull().default(false),
  salaryMin: decimal("salary_min", { precision: 10, scale: 2 }),
  salaryMax: decimal("salary_max", { precision: 10, scale: 2 }),
  experienceLevel: text("experience_level").notNull(),
  locationType: text("location_type").notNull(),
  city: text("city"),
  workingDays: text("working_days"),
  workingHours: text("working_hours"),
  isFlexible: boolean("is_flexible").default(false),
  description: text("description").notNull(),
  responsibilities: text("responsibilities"),
  requiredSkills: jsonb("required_skills"),
  preferredQualifications: text("preferred_qualifications"),
  numberOfOpenings: integer("number_of_openings").default(1),
  applicationDeadline: timestamp("application_deadline"),
  documentsRequired: jsonb("documents_required"),
  visibility: text("visibility").notNull().default("standard"),
  status: text("status").notNull().default("active"),
  platformFeePaid: boolean("platform_fee_paid").default(false),
  featuredUntil: timestamp("featured_until"),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const jobPostPayments = pgTable("job_post_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobPostId: varchar("job_post_id").notNull(),
  companyId: varchar("company_id").notNull(),
  amountInr: decimal("amount_inr", { precision: 10, scale: 2 }).notNull().default("199"),
  paymentType: text("payment_type").notNull().default("platform_fee"),
  status: text("status").notNull().default("pending"),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpaySignature: text("razorpay_signature"),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobApplications = pgTable("job_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobPostId: varchar("job_post_id").notNull(),
  companyId: varchar("company_id").notNull(),
  candidateId: varchar("candidate_id").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  collegeName: text("college_name"),
  experienceSummary: text("experience_summary"),
  preferredHours: text("preferred_hours"),
  availableStartDate: timestamp("available_start_date"),
  cvUrl: text("cv_url").notNull(),
  coverNote: text("cover_note"),
  bankDetailsConsent: boolean("bank_details_consent").default(false),
  bankAccountNumber: text("bank_account_number"),
  bankIfscCode: text("bank_ifsc_code"),
  status: text("status").notNull().default("applied"),
  companyNotes: text("company_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const savedJobs = pgTable("saved_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  jobPostId: varchar("job_post_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedCompanies = pgTable("saved_companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  companyId: varchar("company_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cvDownloadLogs = pgTable("cv_download_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull(),
  downloadedBy: varchar("downloaded_by").notNull(),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
});

export const insertProfileSchema = createInsertSchema(profiles);
export const insertCategorySchema = createInsertSchema(categories);
export const insertServiceSchema = createInsertSchema(services);
export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const insertLeadSchema = createInsertSchema(leads);
export const insertCartItemSchema = createInsertSchema(cartItems).extend({
  qty: z.number().int().positive().default(1),
  sessionId: z.string().min(1),
  serviceId: z.string().min(1),
});
export const insertNotificationSchema = createInsertSchema(notifications);
export const insertNotificationPreferencesSchema = createInsertSchema(notificationPreferences);
export const insertDocumentSchema = createInsertSchema(documents);
export const insertTicketSchema = createInsertSchema(tickets);
export const insertTicketReplySchema = createInsertSchema(ticketReplies);
export const insertAuditLogSchema = createInsertSchema(auditLogs);
export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans);
export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions);
export const insertSiteContentSchema = createInsertSchema(siteContent);

// Opportunities & Company Listings schemas
export const insertCompanySchema = createInsertSchema(companies);
export const insertCompanySubscriptionSchema = createInsertSchema(companySubscriptions);
export const insertJobPostSchema = createInsertSchema(jobPosts);
export const insertJobPostPaymentSchema = createInsertSchema(jobPostPayments);
export const insertJobApplicationSchema = createInsertSchema(jobApplications);
export const insertSavedJobSchema = createInsertSchema(savedJobs);
export const insertSavedCompanySchema = createInsertSchema(savedCompanies);
export const insertCvDownloadLogSchema = createInsertSchema(cvDownloadLogs);

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;
export type TicketReply = typeof ticketReplies.$inferSelect;
export type InsertTicketReply = typeof ticketReplies.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;
export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = typeof siteContent.$inferInsert;
export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreferences = typeof notificationPreferences.$inferInsert;

// Opportunities & Company Listings types
export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;
export type CompanySubscription = typeof companySubscriptions.$inferSelect;
export type InsertCompanySubscription = typeof companySubscriptions.$inferInsert;
export type JobPost = typeof jobPosts.$inferSelect;
export type InsertJobPost = typeof jobPosts.$inferInsert;
export type JobPostPayment = typeof jobPostPayments.$inferSelect;
export type InsertJobPostPayment = typeof jobPostPayments.$inferInsert;
export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = typeof jobApplications.$inferInsert;
export type SavedJob = typeof savedJobs.$inferSelect;
export type InsertSavedJob = typeof savedJobs.$inferInsert;
export type SavedCompany = typeof savedCompanies.$inferSelect;
export type InsertSavedCompany = typeof savedCompanies.$inferInsert;
export type CvDownloadLog = typeof cvDownloadLogs.$inferSelect;
export type InsertCvDownloadLog = typeof cvDownloadLogs.$inferInsert;
