# Stootap - Business Services Platform

## Overview

Stootap is a comprehensive business services platform designed to help students and businesses launch and grow in India. The platform offers 300+ services across categories like business registration, financial compliance, digital marketing, operations, HR, and more. It features a complete e-commerce flow with catalog browsing, shopping cart, and Razorpay payment integration, along with an AI concierge for guidance and lead capture capabilities.

The application is built as a full-stack TypeScript solution using React on the frontend and Express on the backend, with a PostgreSQL database managed through Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (October 31, 2025)

**Latest Bug Fixes & Robustness Improvements:**
- ✅ Fixed critical React Query bug causing 404 errors ([object Object] issue)
- ✅ Added URL query parameter support for category filtering from home page tiles
- ✅ Implemented robust data validation to filter out invalid service records
- ✅ Added defensive null/undefined checks in FAQ rendering
- ✅ Enhanced error handling across Services and ServiceDetail pages
- ✅ All services now load correctly with smooth UX and no console errors

**UI/UX Enhancements:**
- ✅ Enhanced dark mode with improved contrast (background 4%, foreground 98%)
- ✅ Added Framer Motion animations to Hero, CategoryTile, and ServiceCard components
- ✅ Implemented FAQ accordion section on service detail pages
- ✅ Smooth hover effects and viewport-aware entrance animations
- ✅ Professional animations with modest durations (0.2-0.5s) and proper easing

**Replit Environment Setup:**
- ✅ Fixed all TypeScript/LSP errors by installing dependencies
- ✅ Configured Drizzle ORM with proper neon-serverless and neon-http drivers
- ✅ Set up PostgreSQL database and ran migrations successfully
- ✅ Seeded database with 8 categories and 50 services
- ✅ Configured dev workflow on port 5000 with Vite HMR
- ✅ Added .gitignore for Node.js projects
- ✅ Configured autoscale deployment for production
- ✅ Verified frontend proxy configuration (allowedHosts: true)

**Major Enhancements:**
- ✅ Migrated from in-memory storage to PostgreSQL with Drizzle ORM
- ✅ Implemented secure admin authentication with session management
- ✅ Created comprehensive admin dashboard with analytics, order management, and lead tracking
- ✅ Added complete order creation and management APIs
- ✅ Built checkout page with order processing
- ✅ Added Supabase schema export and Netlify deployment documentation
- ✅ Configured production deployment settings
- ✅ Implemented security improvements: password hashing, session regeneration, environment-based secrets

**New Features:**
- Admin Portal (accessible at `/admin/login`)
  - Username: admin
  - Password: @Stootap123 (default, configurable via env)
  - Dashboard with real-time analytics
  - Order status management
  - Lead tracking
  - Service management
- Checkout flow with order creation
- Enhanced cart persistence
- Production-ready security features

**Documentation:**
- `NETLIFY_ENVIRONMENT_VARIABLES.md` - Comprehensive guide with all required/optional environment variables
- `NETLIFY_DEPLOYMENT.md` - Complete deployment guide with all environment variables
- `supabase_schema/` - Database schema export with setup instructions
- `Stootap_Supabase_Schema.tar.gz` - Packaged schema files

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript in development mode via Vite
- **Wouter** for lightweight client-side routing (alternative to React Router)
- **Tailwind CSS** for styling with custom design system based on shadcn/ui
- **Vite** as the build tool with hot module replacement in development

**UI Component System**
- **shadcn/ui** component library (Radix UI primitives + Tailwind styling)
- **Design approach**: Premium, calm, confident aesthetic inspired by Stripe, Linear, and Notion
- **Typography**: Plus Jakarta Sans for headings, Inter Variable for body text
- **Color system**: Dual light/dark mode with HSL color tokens and CSS variables
- Custom design tokens defined in `client/src/index.css` with theme-aware variables

**State Management**
- **TanStack React Query** (v5) for server state management, data fetching, and caching
- **React Context** for theme (light/dark mode) and shopping cart state
- Local storage for session persistence (cart session ID)

**Key Features**
- Responsive navigation with mobile menu support
- Category browsing and service catalog with filtering
- Service detail pages with add-to-cart functionality
- Shopping cart with quantity management
- Authentication pages (Login, Register, Forgot Password, Email Verification)
- User dashboard and profile management
- Student-focused landing page with funding opportunities
- Custom 404 page with search functionality

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript running on Node.js
- RESTful API design with JSON request/response format
- Custom middleware for request logging and response interception
- Raw body preservation for webhook signature verification

**Development & Production Setup**
- Development: Vite dev server in middleware mode with HMR
- Production: Static file serving from built client assets
- TypeScript compilation via `tsx` for development, `esbuild` for production builds

**API Structure**
- `/api/categories` - Category listing
- `/api/services` - Service catalog with optional filtering (category, active status)
- `/api/services/:slug` - Individual service details
- `/api/leads` - Lead capture endpoint with validation
- `/api/cart` - Cart management (add, update, remove items)
- `/api/orders` - Order creation and retrieval

**Business Logic**
- In-memory storage implementation with interface-based design for easy database migration
- Automatic database seeding on server startup with 8 categories and 100+ services
- Session-based cart management using UUID session identifiers
- Form validation using Zod schemas

### Data Storage Solutions

**Database**
- **PostgreSQL** via Neon Database (serverless Postgres)
- **Drizzle ORM** for type-safe database queries and schema management
- Schema-first approach with TypeScript type generation

**Database Schema**
- `profiles` - User accounts with role-based access (student/business)
- `categories` - Service categories with sorting order
- `services` - Service catalog with pricing, descriptions, FAQs, and metadata
- `orders` - Order tracking with status management
- `order_items` - Line items for each order
- `leads` - Lead capture from contact forms
- `cart_items` - Shopping cart persistence

**Key Design Decisions**
- UUID primary keys for all tables using PostgreSQL's `gen_random_uuid()`
- Decimal type for monetary values (precision 10, scale 2)
- JSONB for flexible FAQ storage on services
- Timestamp tracking with `defaultNow()` for audit trails
- Soft delete pattern with `active` boolean flags on services
- Session-based cart (non-authenticated) with optional user association

### Authentication and Authorization

**Current Implementation**
- Frontend authentication pages built (Login, Register, Forgot Password, Email Verification)
- Form validation with React Hook Form and Zod
- Mock authentication flow (console logging, not yet connected to backend)
- Session storage placeholder for future Supabase Auth integration

**Planned Integration**
- **Supabase Auth** referenced in build spec for production authentication
- Role-based access control with "student" and "business" user types
- Email verification flow

### External Dependencies

**Payment Processing**
- **Razorpay** - Indian payment gateway (referenced in design spec, not yet implemented)
- Planned features: Checkout flow, Orders API, webhook handling

**AI Integration**
- **OpenRouter** - AI chat API for concierge functionality (referenced, not yet implemented)
- Planned features: Streamed chat responses, function calling

**UI & Styling**
- **Radix UI** - Unstyled, accessible component primitives (30+ packages)
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **class-variance-authority** - Variant-based component styling
- **clsx + tailwind-merge** - Conditional class name utilities

**Forms & Validation**
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **@hookform/resolvers** - Integration between React Hook Form and Zod

**Database & ORM**
- **@neondatabase/serverless** - Serverless Postgres driver
- **drizzle-orm** - TypeScript ORM
- **drizzle-zod** - Zod schema generation from Drizzle schemas
- **connect-pg-simple** - PostgreSQL session store for Express

**Developer Experience**
- **Vite** plugins for Replit integration (error overlay, cartographer, dev banner)
- **TypeScript** strict mode enabled
- **PostCSS** with Autoprefixer for CSS processing

**Utilities**
- **date-fns** - Date manipulation
- **nanoid** - Unique ID generation
- **embla-carousel-react** - Carousel/slider component

**Planned Integrations (from spec)**
- **Netlify** - Hosting platform with Next.js Runtime (spec references Next.js, but codebase uses Vite/React)
- **Netlify Forms** - Backup lead capture
- **Supabase** - Authentication, database, and file storage
- **GitHub** - Version control and deployment pipeline