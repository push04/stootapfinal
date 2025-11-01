import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";

export function validateRequest(schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        });
      }
      next(error);
    }
  };
}

export const commonSchemas = {
  // Email validation
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  
  // Password validation  - at least 8 characters
  password: z.string().min(8, "Password must be at least 8 characters"),
  
  // Name validation - 2-100 characters, letters and spaces
  fullName: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  
  // Phone validation - optional, 10-15 digits
  phone: z.string()
    .regex(/^\+?[\d\s-()]{10,15}$/, "Invalid phone number format")
    .optional()
    .nullable(),
  
  // UUID validation
  uuid: z.string().uuid("Invalid ID format"),
  
  // Positive integer
  positiveInt: z.number().int().positive(),
  
  // Role validation
  role: z.enum(["business", "admin", "customer"]),
  
  // Price validation (INR)
  priceInr: z.number().positive("Price must be positive"),
  
  // Order status
  orderStatus: z.enum(["pending", "confirmed", "processing", "completed", "cancelled"]),
  
  // Text content with max length
  shortText: z.string().max(500).trim(),
  longText: z.string().max(5000).trim(),
  
  // Slug validation
  slug: z.string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .trim(),
};

// Sanitize HTML to prevent XSS
export function sanitizeHtml(text: string): string {
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Rate limiting helper (simple in-memory implementation)
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export function rateLimit(options: {
  windowMs: number;
  maxRequests: number;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    
    if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
      rateLimitStore[key] = {
        count: 1,
        resetTime: now + options.windowMs
      };
      return next();
    }
    
    rateLimitStore[key].count++;
    
    if (rateLimitStore[key].count > options.maxRequests) {
      return res.status(429).json({
        error: "Too many requests",
        retryAfter: Math.ceil((rateLimitStore[key].resetTime - now) / 1000)
      });
    }
    
    next();
  };
}

// Clean up rate limit store periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}, 60000); // Clean up every minute
