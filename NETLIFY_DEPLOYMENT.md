# Netlify Deployment Guide for Stootap

This guide provides step-by-step instructions for deploying the Stootap business services platform to Netlify as a serverless application.

## Architecture Overview

Stootap has been configured to run on Netlify using:
- **Frontend:** Vite-built React application (static files)
- **Backend:** Express app wrapped as Netlify Functions (serverless)
- **Database:** PostgreSQL with connection pooling (Supabase/Neon)
- **Sessions:** Database-backed session storage (serverless-compatible)

## Prerequisites

- GitHub repository with your Stootap code
- Netlify account (sign up at https://netlify.com)
- Database (Supabase recommended, or Neon)
- Node.js 20+ installed locally (for testing)

## Required Environment Variables

Add these environment variables in Netlify Dashboard → Site Settings → Environment variables:

### Database Configuration (Supabase Recommended)

#### Option 1: Using DATABASE_URL (Recommended)
```
DATABASE_URL=postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```
**Description:** PostgreSQL connection string from Supabase using the pooler connection  
**Where to get it:**
1. Go to your Supabase project dashboard (https://supabase.com/dashboard)
2. Click on "Project Settings" (gear icon) → "Database"
3. Under "Connection string", select "URI" tab
4. Copy the **connection pooler string (Port 6543)** - This is critical for serverless!
5. Replace `[YOUR-PASSWORD]` with your database password

**Example:**
```
DATABASE_URL=postgresql://postgres.abc123:MySecureP@ssw0rd@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**⚠️ IMPORTANT:** Must use the pooler connection (port 6543), not direct connection (port 5432), for serverless compatibility.

#### Option 2: Using Supabase Credentials
Alternatively, you can use individual Supabase credentials (the DATABASE_URL will be built automatically):
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_DB_PASSWORD=your-database-password
```
**Where to get these:**
1. **SUPABASE_URL:** Your project's API URL from Project Settings → API → Project URL
2. **SUPABASE_DB_PASSWORD:** Database password you set during project creation (or reset it in Project Settings → Database → Database Settings → Reset Database Password)

**Note:** The application will automatically construct the pooler connection string from these credentials.

### Session Management
```
SESSION_SECRET=your-random-secret-key-min-32-characters
```
**Description:** Secret key for session encryption (REQUIRED in production)  
**How to generate:** Run `openssl rand -base64 32` in terminal or use a password generator  
**Security:** Keep this secret and never commit to version control

### Admin Credentials (REQUIRED FOR PRODUCTION)
```
ADMIN_USERNAME=your_custom_admin
ADMIN_PASSWORD_HASH=<hash-of-your-secure-password>
```
**Description:** Admin dashboard login credentials  
**⚠️ SECURITY WARNING:** Default credentials (`admin` / `@Stootap123`) are for demo/dev only!  
**PRODUCTION REQUIREMENT:** You MUST change these before deploying to production  
**To generate secure password hash:** 
```bash
node -e "console.log(require('crypto').createHash('sha256').update('YOUR_SECURE_PASSWORD').digest('hex'))"
```
**Example:**
```bash
# Generate hash for password "MySecureP@ssw0rd123"
node -e "console.log(require('crypto').createHash('sha256').update('MySecureP@ssw0rd123').digest('hex'))"
# Output: e8b7f3c2d1a9...
# Then set: ADMIN_PASSWORD_HASH=e8b7f3c2d1a9...
```

### Payment Gateway (Razorpay) - Optional

```
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key
```
**Description:** Razorpay payment gateway credentials for processing payments  
**Where to get it:**
1. Sign up for Razorpay account at https://razorpay.com
2. Complete KYC verification to go live
3. Go to Account & Settings → API Keys
4. Generate API Keys (use test keys for testing: `rzp_test_...`)
5. Copy both Key ID and Key Secret

**⚠️ IMPORTANT:**
- Use test keys (`rzp_test_...`) for development/staging
- Use live keys (`rzp_live_...`) for production only
- Never commit these keys to version control

### AI Concierge (OpenRouter) - Optional

```
OPENROUTER_API_KEY=sk-or-v1-...
```
**Description:** OpenRouter API for AI concierge functionality  
**Where to get it:** Sign up at https://openrouter.ai/ and generate an API key  
**Note:** This is optional. The app works without it, but AI features will be disabled.

### Node Environment
```
NODE_ENV=production
```
**Description:** Ensures production optimizations are enabled  
**Value:** Always set to `production` for Netlify

## Deployment Steps

### 1. Prepare Your Repository

The repository is already configured with the correct build scripts:

```json
{
  "scripts": {
    "build": "npm run build:client && npm run build:functions",
    "build:client": "vite build",
    "build:functions": "node build-functions.js"
  }
}
```

### 2. Connect to Netlify

1. Log in to Netlify Dashboard
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Select your Stootap repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist/public`
   - **Functions directory:** `netlify-functions-build`

### 3. Configure Environment Variables

1. Go to Site settings → Environment variables
2. Add all required variables listed above (at minimum: DATABASE_URL, SESSION_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD_HASH)
3. Click "Save"

### 4. Deploy Database Schema

Before first deployment, set up your database. Choose **one** of these methods:

#### Method 1: Using Supabase SQL Editor (Recommended for First-Time Setup)

1. Go to your Supabase project dashboard (https://supabase.com/dashboard)
2. Click on "SQL Editor" in the left sidebar
3. Click "New query" button
4. Copy the entire content from `supabase_schema/schema.sql` in your project
5. Paste it into the SQL Editor
6. Click "Run" to execute the schema
7. Verify all tables are created:
   - Go to "Table Editor" in sidebar
   - Check that you see tables like: profiles, categories, services, orders, leads, cart_items, session (for sessions), etc.

**What this does:**
- Creates all necessary database tables
- Sets up foreign key relationships
- Creates indexes for performance
- Creates session table for database-backed sessions
- Adds default data (categories and services)

#### Method 2: Using Drizzle Kit (For Updates and Migrations)

1. Set your environment variables locally:
   ```bash
   # Add to .env file (create if it doesn't exist)
   DATABASE_URL=your-supabase-connection-string
   # OR
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_DB_PASSWORD=your-password
   ```

2. Run the Drizzle push command:
   ```bash
   npm run db:push
   ```

3. If you get conflicts or errors, use force mode:
   ```bash
   npm run db:push -- --force
   ```

4. Seed the database with initial data:
   ```bash
   npm run db:seed
   ```

**When to use this method:**
- When updating existing schema
- When adding new columns or tables
- When you've modified `shared/schema.ts`

### 5. Deploy Site

1. Click "Deploy site" in Netlify (or push to your connected branch)
2. Wait for build to complete (typically 2-5 minutes)
3. Monitor the build logs for any errors
4. Access your site at the provided Netlify URL

## Post-Deployment

### Verify Deployment

1. Visit your site URL - you should see the homepage
2. Test main pages (Home, Services, Contact)
3. Test a service detail page and add to cart
4. Test admin login at `/admin/login` using your custom credentials
5. Check database connectivity by viewing services and creating a test lead

### API Endpoint Structure

The backend API is now accessed via Netlify Functions:
- **Main API:** `/.netlify/functions/api/*`
- **Webhooks:** `/.netlify/functions/razorpay-webhook`

The `netlify.toml` includes redirects so `/api/*` automatically maps to `/.netlify/functions/api/*`. Your frontend code doesn't need to change!

### Testing Key Flows

1. **Service Catalog:**
   - Browse services ✓
   - Filter by category ✓
   - View service details ✓

2. **Shopping Cart:**
   - Add items to cart ✓
   - Update quantities ✓
   - Remove items ✓

3. **Checkout:**
   - Fill customer details ✓
   - Create order ✓
   - Process payment (if Razorpay configured) ✓

4. **Admin Dashboard:**
   - Login with custom credentials ✓
   - View analytics ✓
   - Manage orders ✓
   - View leads ✓
   - Edit services ✓

### Custom Domain Setup

1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS records:
   ```
   Type: CNAME
   Name: www (or @)
   Value: <your-site>.netlify.app
   ```
4. Enable HTTPS (automatic with Netlify)

### Monitoring & Logs

- **Build logs:** Deploys → Select deployment → View logs
- **Function logs:** Functions → View function logs
- **Real-time logs:** Use Netlify CLI: `netlify logs`
- **Function analytics:** Monitor cold starts, execution time, and errors

## Troubleshooting

### Build Fails

**Error:** "MODULE_NOT_FOUND"  
**Solution:** Ensure all dependencies are in `package.json`. Run `npm install` locally to verify.

**Error:** "SESSION_SECRET is required"  
**Solution:** Add SESSION_SECRET environment variable in Netlify UI

**Error:** "Cannot find module '@shared/schema'"  
**Solution:** This should be resolved by the build script. Check build logs and ensure `build-functions.js` ran successfully.

### Database Connection Fails

**Error:** "DATABASE_URL environment variable is required"  
**Solution:** Add DATABASE_URL in Netlify environment variables

**Error:** "Connection timeout"  
**Solution:** Ensure you're using the pooler connection (port 6543), not direct connection (port 5432)

**Error:** "too many clients"  
**Solution:** Use connection pooler URL (port 6543). This is critical for serverless!

### Admin Login Not Working

**Error:** "Unauthorized"  
**Solution:** 
1. Check ADMIN_USERNAME and ADMIN_PASSWORD_HASH are set correctly
2. Verify password hash was generated correctly
3. Check function logs for session-related errors
4. Ensure SESSION_SECRET is set

### Function Timeout

**Error:** "Function execution timed out"  
**Solution:** 
1. Optimize database queries
2. Check for slow API calls (AI, payment gateway)
3. Review function logs for bottlenecks

## Local Testing with Netlify Dev

Before deploying, test locally:

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site
netlify link

# Set environment variables locally
netlify env:import .env.local

# Run local dev server with Functions
netlify dev
```

This runs your site exactly as it will on Netlify, with Functions support.

## Security Checklist

- ✅ SESSION_SECRET is unique and not committed to repo
- ✅ DATABASE_URL uses pooler connection with SSL
- ✅ **CRITICAL:** Changed ADMIN_USERNAME and ADMIN_PASSWORD_HASH from defaults
- ✅ Admin password is strong and unique (minimum 12 characters)
- ✅ NODE_ENV=production is set
- ✅ All sensitive data is in environment variables, not code
- ✅ Netlify security headers are configured in `netlify.toml`

**⚠️ READ SECURITY_NOTICE.md for complete admin security guidelines**

## Performance & Limitations

### Netlify Functions Limits

- **Execution time:** 10 seconds (free tier), 26 seconds (Pro)
- **Memory:** 1024 MB
- **Payload size:** 6 MB

### Optimization Tips

1. **Database queries:** Use indexes, limit result sets, avoid N+1 queries
2. **Session storage:** Using database-backed sessions (not memory) for serverless compatibility
3. **Cold starts:** First request may be slower (~500ms-2s). Subsequent requests are faster.
4. **Caching:** Static assets are cached at CDN edge, API responses are not cached

### What Changed from Traditional Hosting

- ❌ No long-running Express server
- ✅ Express wrapped as serverless function
- ❌ No in-memory session storage
- ✅ Database-backed sessions via connect-pg-simple
- ❌ No persistent in-memory caching
- ✅ Database-backed storage for all data

## Support & Resources

- **Netlify Documentation:** https://docs.netlify.com
- **Netlify Functions:** https://docs.netlify.com/functions/overview/
- **Supabase Documentation:** https://supabase.com/docs
- **Drizzle ORM Documentation:** https://orm.drizzle.team

## Rollback Strategy

If deployment fails or has issues:

1. **Instant Rollback:**
   - Deploys → Find working deployment → "Publish deploy"

2. **Lock Deploys:**
   - Site settings → Build & deploy → Deploy contexts
   - Lock to specific branch or deployment

---

**Last Updated:** October 31, 2025  
**Version:** 3.0 (Netlify Functions)
