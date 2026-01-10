import type { Express, Request } from "express";
import { storage } from "./storage";

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
    session?: any;
  }
}
import { ZodError, z } from "zod";
import { insertCompanySchema, insertJobPostSchema, insertJobApplicationSchema, type InsertCompany, type InsertJobPost, type InsertJobApplication } from "@shared/schema";
import crypto from "crypto";
import Razorpay from "razorpay";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const razorpayInstance = RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET ? new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
}) : null;

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function registerOpportunitiesRoutes(app: Express) {
  // ============ PUBLIC ROUTES ============

  // Get all active job posts
  app.get("/api/opportunities/jobs", async (req, res) => {
    try {
      const { roleType, locationType } = req.query;
      const filters: any = { status: "active" };
      if (roleType) filters.roleType = roleType;
      if (locationType) filters.locationType = locationType;

      const jobs = await storage.getAllJobPosts(filters);

      // Get company info for each job
      const jobsWithCompany = await Promise.all(jobs.map(async (job) => {
        const company = await storage.getCompany(job.companyId);
        return { ...job, company };
      }));

      res.json(jobsWithCompany);
    } catch (error) {
      console.error("Get opportunities error:", error);
      res.status(500).json({ error: "Failed to fetch opportunities" });
    }
  });

  // Get a single job post by slug
  app.get("/api/opportunities/jobs/:slug", async (req, res) => {
    try {
      const job = await storage.getJobPostBySlug(req.params.slug);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      const company = await storage.getCompany(job.companyId);
      res.json({ ...job, company });
    } catch (error) {
      console.error("Get job detail error:", error);
      res.status(500).json({ error: "Failed to fetch job details" });
    }
  });

  // ============ COMPANY ROUTES ============

  // Register a new company
  app.post("/api/opportunities/companies", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Check if user already has a company
      const existingCompany = await storage.getCompanyByUserId(req.user.id);
      if (existingCompany) {
        return res.status(400).json({ error: "You already have a registered company" });
      }

      const validated = insertCompanySchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      const company = await storage.createCompany(validated as unknown as InsertCompany);
      res.status(201).json(company);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Create company error:", error);
      res.status(500).json({ error: "Failed to create company" });
    }
  });

  // Get current user's company
  app.get("/api/opportunities/my-company", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const company = await storage.getCompanyByUserId(req.user.id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      const subscription = await storage.getCompanySubscription(company.id);
      res.json({ ...company, subscription });
    } catch (error) {
      console.error("Get my company error:", error);
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });

  // Update company profile
  app.put("/api/opportunities/my-company", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const company = await storage.getCompanyByUserId(req.user.id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      const updated = await storage.updateCompany(company.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Update company error:", error);
      res.status(500).json({ error: "Failed to update company" });
    }
  });

  // ============ JOB POST ROUTES (company only) ============

  // Get company's job posts
  app.get("/api/opportunities/my-jobs", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const company = await storage.getCompanyByUserId(req.user.id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      const jobs = await storage.getJobPostsByCompany(company.id);

      // Get application counts for each job
      const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
        const applications = await storage.getJobApplicationsByJob(job.id);
        return {
          ...job,
          applicationCount: applications.length,
        };
      }));

      res.json(jobsWithCounts);
    } catch (error) {
      console.error("Get my jobs error:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  // Create a new job post
  app.post("/api/opportunities/jobs", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const company = await storage.getCompanyByUserId(req.user.id);
      if (!company) {
        return res.status(400).json({ error: "You must register a company first" });
      }

      // Check if this is the first job post - start trial
      const existingJobs = await storage.getJobPostsByCompany(company.id);
      if (existingJobs.length === 0 && !company.trialStartDate) {
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 60); // 60-day trial
        await storage.updateCompany(company.id, {
          trialStartDate: new Date(),
          trialEndDate,
        });
      }

      const slug = generateSlug(req.body.title);

      const validated = insertJobPostSchema.parse({
        ...req.body,
        companyId: company.id,
        slug,
      });

      const job = await storage.createJobPost(validated as unknown as InsertJobPost);

      // If job is paid, it needs platform fee
      if (job.isPaid) {
        res.json({
          ...job,
          requiresPayment: true,
          paymentAmount: 199,
          message: "Paid job posted. Platform fee of ₹199 required for 6 months visibility.",
        });
      } else {
        res.status(201).json(job);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Create job error:", error);
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  // Update a job post
  app.put("/api/opportunities/jobs/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const company = await storage.getCompanyByUserId(req.user.id);
      if (!company) {
        return res.status(400).json({ error: "Company not found" });
      }

      const job = await storage.getJobPost(req.params.id);
      if (!job || job.companyId !== company.id) {
        return res.status(404).json({ error: "Job not found" });
      }

      const updated = await storage.updateJobPost(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Update job error:", error);
      res.status(500).json({ error: "Failed to update job" });
    }
  });

  // Close/delete a job post
  app.delete("/api/opportunities/jobs/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const company = await storage.getCompanyByUserId(req.user.id);
      if (!company) {
        return res.status(400).json({ error: "Company not found" });
      }

      const job = await storage.getJobPost(req.params.id);
      if (!job || job.companyId !== company.id) {
        return res.status(404).json({ error: "Job not found" });
      }

      await storage.updateJobPost(req.params.id, { status: "closed" });
      res.json({ success: true });
    } catch (error) {
      console.error("Delete job error:", error);
      res.status(500).json({ error: "Failed to close job" });
    }
  });

  // ============ APPLICATION ROUTES ============

  // Apply for a job (candidate)
  app.post("/api/opportunities/jobs/:jobId/apply", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const job = await storage.getJobPost(req.params.jobId);
      if (!job || job.status !== "active") {
        return res.status(404).json({ error: "Job not found or not active" });
      }

      // Check for existing application
      const hasApplied = await storage.checkExistingApplication(job.id, req.user.id);
      if (hasApplied) {
        return res.status(400).json({ error: "You have already applied for this job" });
      }

      const validated = insertJobApplicationSchema.parse({
        ...req.body,
        jobPostId: job.id,
        companyId: job.companyId,
        candidateId: req.user.id,
      });

      const application = await storage.createJobApplication(validated as unknown as InsertJobApplication);

      // Create notification for company
      const company = await storage.getCompany(job.companyId);
      if (company) {
        await storage.createNotification({
          userId: company.userId,
          type: "new_application",
          title: "New Application Received",
          message: `${req.body.fullName} applied for ${job.title}`,
          actionUrl: `/company/jobs/${job.id}/applications`,
        } as any);
      }

      res.status(201).json({
        success: true,
        message: "Application submitted successfully. Company will contact if shortlisted.",
        applicationId: application.id,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Apply error:", error);
      res.status(500).json({ error: "Failed to submit application" });
    }
  });

  // Get my applications (candidate)
  app.get("/api/opportunities/my-applications", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const applications = await storage.getJobApplicationsByCandidate(req.user.id);

      // Get job and company info for each application
      const applicationsWithDetails = await Promise.all(applications.map(async (app) => {
        const job = await storage.getJobPost(app.jobPostId);
        const company = job ? await storage.getCompany(job.companyId) : null;
        return {
          ...app,
          job: job ? {
            id: job.id,
            title: job.title,
            slug: job.slug,
            roleType: job.roleType,
            locationType: job.locationType,
          } : null,
          company: company ? {
            id: company.id,
            companyName: company.companyName,
            logoUrl: company.logoUrl,
          } : null,
        };
      }));

      res.json(applicationsWithDetails);
    } catch (error) {
      console.error("Get my applications error:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // Get applications for a job (company)
  app.get("/api/opportunities/jobs/:jobId/applications", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const company = await storage.getCompanyByUserId(req.user.id);
      if (!company) {
        return res.status(400).json({ error: "Company not found" });
      }

      const job = await storage.getJobPost(req.params.jobId);
      if (!job || job.companyId !== company.id) {
        return res.status(404).json({ error: "Job not found" });
      }

      const applications = await storage.getJobApplicationsByJob(job.id);
      res.json(applications);
    } catch (error) {
      console.error("Get job applications error:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // Update application status (company)
  app.patch("/api/opportunities/applications/:id/status", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { status } = req.body;
      const validStatuses = ["applied", "shortlisted", "interview", "offered", "rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const application = await storage.getJobApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      const company = await storage.getCompanyByUserId(req.user.id);
      if (!company || application.companyId !== company.id) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const updated = await storage.updateJobApplication(req.params.id, { status });

      // Notify candidate
      await storage.createNotification({
        userId: application.candidateId,
        type: "application_status",
        title: "Application Status Updated",
        message: `Your application status has been updated to: ${status}`,
        actionUrl: "/dashboard/applications",
      } as any);

      res.json(updated);
    } catch (error) {
      console.error("Update application status error:", error);
      res.status(500).json({ error: "Failed to update application status" });
    }
  });

  // ============ SAVED JOBS/COMPANIES ============

  // Save a job
  app.post("/api/opportunities/jobs/:jobId/save", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const saved = await storage.saveJob({
        userId: req.user.id,
        jobPostId: req.params.jobId,
      });
      res.json(saved);
    } catch (error) {
      console.error("Save job error:", error);
      res.status(500).json({ error: "Failed to save job" });
    }
  });

  // Unsave a job
  app.delete("/api/opportunities/jobs/:jobId/save", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      await storage.unsaveJob(req.user.id, req.params.jobId);
      res.json({ success: true });
    } catch (error) {
      console.error("Unsave job error:", error);
      res.status(500).json({ error: "Failed to unsave job" });
    }
  });

  // Check if job is saved
  app.get("/api/opportunities/jobs/:jobId/saved", async (req, res) => {
    try {
      if (!req.user) {
        return res.json({ saved: false });
      }

      const saved = await storage.isJobSaved(req.user.id, req.params.jobId);
      res.json({ saved });
    } catch (error) {
      console.error("Check saved job error:", error);
      res.json({ saved: false });
    }
  });

  // Get saved jobs
  app.get("/api/opportunities/saved-jobs", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const savedJobs = await storage.getSavedJobs(req.user.id);

      // Get job details
      const jobsWithDetails = await Promise.all(savedJobs.map(async (saved) => {
        const job = await storage.getJobPost(saved.jobPostId);
        const company = job ? await storage.getCompany(job.companyId) : null;
        return {
          ...saved,
          job,
          company: company ? {
            id: company.id,
            companyName: company.companyName,
            logoUrl: company.logoUrl,
          } : null,
        };
      }));

      res.json(jobsWithDetails);
    } catch (error) {
      console.error("Get saved jobs error:", error);
      res.status(500).json({ error: "Failed to fetch saved jobs" });
    }
  });

  // ============ PAYMENT ROUTES ============

  // Create payment order for paid job platform fee
  app.post("/api/opportunities/jobs/:jobId/pay", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      if (!razorpayInstance) {
        return res.status(503).json({ error: "Payment gateway not configured" });
      }

      const job = await storage.getJobPost(req.params.jobId);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      const company = await storage.getCompanyByUserId(req.user.id);
      if (!company || job.companyId !== company.id) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const amount = 199; // Platform fee in INR
      const options = {
        amount: amount * 100, // Razorpay expects paise
        currency: "INR",
        receipt: `job_${job.id}`,
        notes: {
          jobId: job.id,
          companyId: company.id,
          type: "platform_fee",
        },
      };

      const order = await razorpayInstance.orders.create(options);

      // Create payment record
      await storage.createJobPostPayment({
        jobPostId: job.id,
        companyId: company.id,
        amountInr: amount.toString(),
        paymentType: "platform_fee",
        status: "pending",
        razorpayOrderId: order.id,
      } as any);

      res.json(order);
    } catch (error) {
      console.error("Create job payment error:", error);
      res.status(500).json({ error: "Failed to create payment order" });
    }
  });

  // Verify job platform fee payment
  app.post("/api/opportunities/jobs/:jobId/verify-payment", async (req, res) => {
    try {
      if (!req.user || !RAZORPAY_KEY_SECRET) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(sign)
        .digest("hex");

      if (razorpay_signature !== expectedSign) {
        return res.status(400).json({ error: "Invalid payment signature" });
      }

      const job = await storage.getJobPost(req.params.jobId);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      // Update payment record
      const payment = await storage.getJobPostPayment(job.id);
      if (payment) {
        const featuredUntil = new Date();
        featuredUntil.setMonth(featuredUntil.getMonth() + 6); // 6 months visibility

        await storage.updateJobPostPayment(payment.id, {
          status: "paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          validUntil: featuredUntil,
        } as any);

        // Update job as paid and featured
        await storage.updateJobPost(job.id, {
          platformFeePaid: true,
          featuredUntil,
          visibility: "featured",
        });
      }

      res.json({ success: true, message: "Payment verified. Job is now featured for 6 months." });
    } catch (error) {
      console.error("Verify job payment error:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  // Create company subscription payment
  app.post("/api/opportunities/subscription/pay", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      if (!razorpayInstance) {
        return res.status(503).json({ error: "Payment gateway not configured" });
      }

      const company = await storage.getCompanyByUserId(req.user.id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      const amount = 4999; // Annual subscription in INR
      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `sub_${company.id}`,
        notes: {
          companyId: company.id,
          type: "company_subscription",
        },
      };

      const order = await razorpayInstance.orders.create(options);

      // Create subscription record
      await storage.createCompanySubscription({
        companyId: company.id,
        planType: "featured",
        status: "pending",
        priceInr: amount.toString(),
        razorpayOrderId: order.id,
      } as any);

      res.json(order);
    } catch (error) {
      console.error("Create subscription payment error:", error);
      res.status(500).json({ error: "Failed to create payment order" });
    }
  });

  // ============ ADMIN ROUTES ============

  // Get all companies (admin)
  app.get("/api/admin/opportunities/companies", async (req, res) => {
    try {
      // Simple admin check - you may want more robust admin verification
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const companies = await storage.getAllCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Admin get companies error:", error);
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  // Verify/unverify company (admin)
  app.patch("/api/admin/opportunities/companies/:id/verify", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { verified } = req.body;
      const updated = await storage.updateCompany(req.params.id, { verified });
      res.json(updated);
    } catch (error) {
      console.error("Admin verify company error:", error);
      res.status(500).json({ error: "Failed to update company" });
    }
  });

  // Disable company (admin)
  app.patch("/api/admin/opportunities/companies/:id/status", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { status } = req.body;
      const updated = await storage.updateCompany(req.params.id, { status });
      res.json(updated);
    } catch (error) {
      console.error("Admin update company status error:", error);
      res.status(500).json({ error: "Failed to update company" });
    }
  });

  // Get all job posts (admin)
  app.get("/api/admin/opportunities/jobs", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const jobs = await storage.getAllJobPosts();
      const jobsWithCompany = await Promise.all(jobs.map(async (job) => {
        const company = await storage.getCompany(job.companyId);
        return { ...job, company };
      }));
      res.json(jobsWithCompany);
    } catch (error) {
      console.error("Admin get jobs error:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  // Disable job (admin)
  app.patch("/api/admin/opportunities/jobs/:id/status", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { status } = req.body;
      const updated = await storage.updateJobPost(req.params.id, { status });
      res.json(updated);
    } catch (error) {
      console.error("Admin update job status error:", error);
      res.status(500).json({ error: "Failed to update job" });
    }
  });

  // Update job fee status (admin)
  app.patch("/api/admin/opportunities/jobs/:id/fee-status", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { platformFeePaid } = req.body;
      const updated = await storage.updateJobPost(req.params.id, { platformFeePaid });
      res.json(updated);
    } catch (error) {
      console.error("Admin update job fee status error:", error);
      res.status(500).json({ error: "Failed to update job fee status" });
    }
  });

  // Create job post (admin)
  app.post("/api/admin/opportunities/jobs", async (req, res) => {
    try {
      const { title, companyId, roleType, isPaid, salaryMin, salaryMax, experienceLevel, locationType, city, description } = req.body;

      if (!title || !companyId || !description) {
        return res.status(400).json({ error: "Title, company, and description are required" });
      }

      const company = await storage.getCompany(companyId);
      if (!company) {
        return res.status(400).json({ error: "Company not found" });
      }

      const slug = generateSlug(title);

      const jobData = {
        companyId,
        title,
        slug,
        roleType: roleType || "full_time",
        isPaid: isPaid !== false,
        salaryMin: salaryMin ? parseFloat(salaryMin) : null,
        salaryMax: salaryMax ? parseFloat(salaryMax) : null,
        experienceLevel: experienceLevel || "entry",
        locationType: locationType || "onsite",
        city: city || null,
        description,
        status: "active",
        visibility: "standard",
        platformFeePaid: true,
      };

      const job = await storage.createJobPost(jobData as any);
      res.status(201).json(job);
    } catch (error) {
      console.error("Admin create job error:", error);
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  // Update job (admin)
  app.patch("/api/admin/opportunities/jobs/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const updated = await storage.updateJobPost(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Admin update job error:", error);
      res.status(500).json({ error: "Failed to update job" });
    }
  });

  // Delete job (admin)
  app.delete("/api/admin/opportunities/jobs/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      await storage.deleteJobPost(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Admin delete job error:", error);
      res.status(500).json({ error: "Failed to delete job" });
    }
  });

  // Alias for fee endpoint
  app.patch("/api/admin/opportunities/jobs/:id/fee", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { platformFeePaid } = req.body;
      const updated = await storage.updateJobPost(req.params.id, { platformFeePaid });
      res.json(updated);
    } catch (error) {
      console.error("Admin update job fee error:", error);
      res.status(500).json({ error: "Failed to update job fee" });
    }
  });

  // Create company (admin)
  app.post("/api/admin/opportunities/companies", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { companyName, contactName, contactEmail, phone, businessType, industry, website, location, description } = req.body;

      if (!companyName || !contactName || !contactEmail) {
        return res.status(400).json({ error: "Company name, contact name, and email are required" });
      }

      const companyData = {
        userId: req.user.id || "admin",
        companyName,
        contactName,
        contactEmail,
        phone: phone || null,
        businessType: businessType || "llp",
        industry: industry || null,
        website: website || null,
        location: location || null,
        description: description || null,
        verified: true,
        status: "active",
      };

      const company = await storage.createCompany(companyData as any);
      res.status(201).json(company);
    } catch (error) {
      console.error("Admin create company error:", error);
      res.status(500).json({ error: "Failed to create company" });
    }
  });

  // Update company (admin)
  app.patch("/api/admin/opportunities/companies/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const updated = await storage.updateCompany(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Admin update company error:", error);
      res.status(500).json({ error: "Failed to update company" });
    }
  });

  // Delete company (admin)
  app.delete("/api/admin/opportunities/companies/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Delete associated jobs first
      const jobs = await storage.getJobPostsByCompany(req.params.id);
      for (const job of jobs) {
        await storage.deleteJobPost(job.id);
      }

      await storage.deleteCompany(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Admin delete company error:", error);
      res.status(500).json({ error: "Failed to delete company" });
    }
  });
}
