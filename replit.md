# Stootap - Business Services Platform

## Overview

Stootap is a comprehensive business services platform designed to help students and businesses launch and grow in India. It offers over 300 services across various categories including business registration, financial compliance, digital marketing, operations, and HR. The platform features a complete e-commerce experience with catalog browsing, a shopping cart, Razorpay payment integration, and an AI concierge for guidance and lead capture. It is built as a full-stack TypeScript application using React on the frontend and Express on the backend, with a PostgreSQL database managed by Drizzle ORM.

## Recent Changes (November 1, 2025)

### Replit Environment Setup
- Successfully imported project from GitHub and configured for Replit environment
- Installed all Node.js dependencies and resolved TypeScript configuration
- Set up PostgreSQL database using Replit's built-in database (DATABASE_URL)
- Pushed database schema using Drizzle ORM and seeded with initial data (8 categories, 50 services)
- Configured workflow for development server running on port 5000 with Vite HMR

### Netlify Serverless Deployment Configuration
- Built and verified Netlify serverless functions for production deployment
- Configured `netlify/functions/api.ts` for main API routing using serverless-http
- Configured `netlify/functions/razorpay-webhook.ts` for payment webhook handling
- Set up build process with `build-functions.js` using esbuild for function bundling
- Configured deployment with autoscale target for optimal Netlify serverless performance
- All API endpoints properly configured to work as serverless functions
- Fixed TypeScript type declarations for Buffer in rawBody
- Verified build artifacts: dist/public (frontend) and netlify-functions-build (serverless functions)
- Created comprehensive deployment guide: `REPLIT_TO_NETLIFY_GUIDE.md`

### API Keys and Secrets
- RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET configured for payment processing
- OPENROUTER_API_KEY configured for AI concierge functionality using DeepSeek model
- DATABASE_URL configured for PostgreSQL database connection
- All secrets properly stored in Replit environment variables

### Verified Functionality
- All major pages loading correctly: Home, Services, Login, Register, Admin Login
- API endpoints tested and working: Categories, Services, Cart, Payment, AI Concierge
- Admin dashboard with authentication protection (redirects to login when not authenticated)
- Vite development server with HMR running on port 5000 with proxy support
- Frontend configured with `allowedHosts: true` for Replit preview proxy
- Database successfully seeded with sample data

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with **React 18** and **TypeScript**, using **Vite** for development and bundling. **Wouter** handles client-side routing, and **Tailwind CSS** with **shadcn/ui** provides a custom, premium design system. **TanStack React Query** manages server state and data fetching, while **React Context** handles UI theme and shopping cart state. Key features include responsive navigation, a service catalog with filtering, detailed service pages, a shopping cart, and user authentication flows.

### Backend Architecture

The backend utilizes **Express.js** with **TypeScript**, following a RESTful API design. It supports development with Vite's HMR and serves static files in production. API endpoints manage categories, services, leads, cart operations, and orders. Business logic includes in-memory storage (with an interface for future database migration), automatic database seeding, session-based cart management, and Zod for form validation. The application is designed for serverless deployment using Netlify Functions.

### Data Storage Solutions

**PostgreSQL** via Neon Database serves as the primary data store, with **Drizzle ORM** providing type-safe queries and schema management. The database schema includes tables for profiles, categories, services, orders, order items, leads, and cart items. Key design decisions include UUID primary keys, decimal types for monetary values, JSONB for flexible data storage, and timestamp tracking.

### Authentication and Authorization

Frontend authentication pages are implemented using **React Hook Form** and **Zod** for validation. The system is designed to integrate with **Supabase Auth** for full authentication, email verification, and role-based access control (student/business user types).

## External Dependencies

-   **Payment Processing**: **Razorpay** (for Indian payment gateway integration).
-   **AI Integration**: **OpenRouter** (for AI concierge functionality, using DeepSeek model).
-   **UI & Styling**: **Radix UI**, **Tailwind CSS**, **Lucide React**, **class-variance-authority**, **clsx**, **tailwind-merge**.
-   **Forms & Validation**: **React Hook Form**, **Zod**, **@hookform/resolvers**.
-   **Database & ORM**: **@neondatabase/serverless**, **drizzle-orm**, **drizzle-zod**, **connect-pg-simple**.
-   **Utilities**: **date-fns**, **nanoid**, **embla-carousel-react**.
-   **Hosting**: **Netlify** (for serverless deployment of frontend and backend functions).