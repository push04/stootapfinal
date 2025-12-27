# Stootap - Complete Deployment Guide

**Last Updated:** November 1, 2025  
**Version:** 4.0 (Serverless-Ready)

---

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Variables](#environment-variables)
4. [Supabase Setup](#supabase-setup)
5. [Local Development](#local-development)
6. [Netlify Deployment](#netlify-deployment)
7. [Post-Deployment](#post-deployment)
8. [Troubleshooting](#troubleshooting)
9. [Security Checklist](#security-checklist)

---

## Overview

Stootap is a business services platform built with:
- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend:** Express.js (serverless-ready via Netlify Functions)
- **Database:** Supabase (PostgreSQL with REST API)
- **Authentication:** Supabase Auth
- **Payments:** Razorpay
- **AI:** OpenRouter (DeepSeek model)

**Deployment Targets:**
- ✅ Replit (Development)
- ✅ Netlify (Production - Serverless)
- ✅ Other platforms (with minor adjustments)

---

## Prerequisites

### Required Accounts
1. **Supabase Account** - https://supabase.com (Free tier available)
2. **Netlify Account** - https://netlify.com (Free tier available)

### Optional (for full features)
3. **Razorpay Account** - https://razorpay.com (Payment gateway)
4. **OpenRouter Account** - https://openrouter.ai (AI features)

### Development Tools
- Node.js 20+ (LTS recommended)
- npm or yarn
- Git

---

## Environment Variables

### Required for All Environments

#### Supabase Configuration (REQUIRED)
```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to get these:**
1. Go to https://supabase.com/dashboard
2. Select your project (or create one)
3. Click **Settings** (gear icon) → **API**
4. Copy **Project URL** → use as `SUPABASE_URL`
5. Copy **anon/public key** → use as `SUPABASE_ANON_KEY`

**⚠️ Important:** The anon key is safe to expose publicly - it's used for client-side operations with Row Level Security.

#### Session Security (REQUIRED for Production)
```bash
SESSION_SECRET=your-random-64-character-secret-here
```

**How to generate:**
```bash
openssl rand -base64 64
```

Or use an online password generator with at least 64 characters.

### Optional Environment Variables

#### Razorpay (Payment Processing)
```bash
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

**How to get these:**
1. Sign up at https://razorpay.com
2. Go to **Settings** → **API Keys**
3. Generate **Test Keys** (for development) or **Live Keys** (for production)
4. Copy **Key ID** → `RAZORPAY_KEY_ID`
5. Copy **Key Secret** → `RAZORPAY_KEY_SECRET`

**⚠️ Important:** 
- Use `rzp_test_` keys for testing
- Use `rzp_live_` keys for production only
- Never commit these to version control

#### OpenRouter (AI Concierge)
```bash
OPENROUTER_API_KEY=sk-or-v1-1234567890abcdef...
```

**How to get this:**
1. Sign up at https://openrouter.ai
2. Go to **Keys** → **Create Key**
3. Copy the generated key → `OPENROUTER_API_KEY`

**Note:** The app works without this - AI features will be disabled if not provided.

#### Admin Credentials (Optional - defaults provided)
```bash
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD_HASH=<sha256-hash-of-password>
```

**Default credentials (CHANGE IN PRODUCTION!):**
- Username: `admin`
- Password: `@Stootap123`

**To set custom admin credentials:**
```bash
# Generate password hash
node -e "console.log(require('crypto').createHash('sha256').update('YourSecurePassword123!').digest('hex'))"

# Use the output as ADMIN_PASSWORD_HASH
```

---

## Supabase Setup

### Step 1: Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click **New Project**
3. Fill in details:
   - **Name:** Stootap (or your choice)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your users
4. Wait for project to initialize (~2 minutes)

### Step 2: Run Database Schema
1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `supabase_schema/schema.sql` from this repo
4. Copy the entire contents and paste into the SQL Editor
5. Click **Run** or press `Ctrl+Enter`

**What this creates:**
- All database tables (profiles, categories, services, orders, etc.)
- Indexes for performance
- Default data (categories and services)

### Step 3: Verify Tables Created
1. Click **Table Editor** (left sidebar)
2. You should see these tables:
   - profiles
   - categories
   - services
   - orders
   - order_items
   - leads
   - cart_items
   - notifications
   - notification_preferences
   - tickets
   - ticket_replies
   - documents
   - audit_logs
   - subscription_plans
   - user_subscriptions
   - site_content

### Step 4: Configure Supabase Auth
1. Click **Authentication** → **Providers**
2. Enable **Email** provider
3. **Disable** "Confirm email" (or set up email templates)
4. Click **Save**

**Email Confirmation Settings:**
- **Disabled:** Users can login immediately after signup
- **Enabled:** Users must verify email before login (requires email template setup)

### Step 5: Get API Keys
1. Click **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`

---

## Local Development

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd stootap
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the root:
```bash
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SESSION_SECRET=your_random_session_secret

# Optional
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret
OPENROUTER_API_KEY=sk-or-v1-your_key
```

### 4. Run Development Server
```bash
npm run dev
```

The app will start on http://localhost:5000

### 5. Test Features
- ✅ Homepage loads
- ✅ Browse services
- ✅ Add to cart
- ✅ User registration/login
- ✅ View profile
- ✅ Admin dashboard (http://localhost:5000/admin/login)

---

## Netlify Deployment

### Method 1: Netlify UI (Recommended)

#### 1. Connect Repository
1. Log in to https://netlify.com
2. Click **Add new site** → **Import an existing project**
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Select your Stootap repository
5. Configure build settings:

```
Build command: npm run build
Publish directory: dist/public
Functions directory: netlify-functions-build
```

#### 2. Set Environment Variables
1. Go to **Site settings** → **Environment variables**
2. Click **Add a variable**
3. Add ALL required variables:

```bash
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SESSION_SECRET=your_production_session_secret
NODE_ENV=production

# Optional (for full features)
RAZORPAY_KEY_ID=rzp_live_your_key  # Use live keys!
RAZORPAY_KEY_SECRET=your_live_secret
OPENROUTER_API_KEY=sk-or-v1-your_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD_HASH=your_password_hash
```

**⚠️ CRITICAL:**
- Change `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` from defaults
- Use Razorpay **live keys** (`rzp_live_`) for production
- Use a strong, unique `SESSION_SECRET`

#### 3. Deploy
1. Click **Deploy site**
2. Wait for build to complete (~2-5 minutes)
3. Visit your site at `https://your-site.netlify.app`

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to site
netlify link

# Set environment variables
netlify env:set SUPABASE_URL "https://your-project.supabase.co"
netlify env:set SUPABASE_ANON_KEY "your_anon_key"
netlify env:set SESSION_SECRET "your_session_secret"
netlify env:set NODE_ENV "production"
# ... add other variables

# Deploy
netlify deploy --prod
```

### Build Process Explained

When you run `npm run build`, it executes:
1. **Client Build:** `vite build` → Creates static files in `dist/public`
2. **Functions Build:** `node build-functions.js` → Bundles serverless functions

**What gets deployed:**
- `dist/public/` → Frontend static files (served by Netlify CDN)
- `netlify-functions-build/` → Backend API as serverless functions

---

## Post-Deployment

### 1. Verify Deployment
Visit your site and test:
- ✅ Homepage loads
- ✅ Browse services
- ✅ User registration works
- ✅ Login works
- ✅ Profile page accessible
- ✅ Admin dashboard (with your custom credentials)
- ✅ Add to cart and checkout
- ✅ Payment gateway (if Razorpay configured)

### 2. Custom Domain (Optional)
1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Follow DNS configuration instructions
4. Netlify provides free SSL certificate

### 3. Enable Analytics (Optional)
1. Go to **Site settings** → **Analytics**
2. Enable Netlify Analytics for visitor tracking

### 4. Set Up Monitoring
1. Monitor **Functions** tab for errors
2. Check **Deploy** logs for build issues
3. Set up error notifications in **Site settings** → **Notifications**

---

## Troubleshooting

### Build Fails

**Error:** `MODULE_NOT_FOUND`
**Solution:** Ensure all dependencies are in `package.json`. Run `npm install` locally to verify.

**Error:** `SESSION_SECRET is required`
**Solution:** Add `SESSION_SECRET` environment variable in Netlify UI.

**Error:** `Cannot find module '@shared/schema'`
**Solution:** This should be auto-resolved by build script. Check `build-functions.js` ran successfully.

### Database Connection Fails

**Error:** `SUPABASE_URL environment variable is required`
**Solution:** Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` in Netlify environment variables.

**Error:** `Failed to fetch from Supabase`
**Solution:** 
1. Verify Supabase project is active
2. Check API keys are correct
3. Verify tables exist (run schema.sql)

### Authentication Not Working

**Error:** "Invalid login credentials"
**Solution:**
1. Verify Supabase Auth is enabled
2. Check email confirmation settings
3. Try registering a new account
4. Check Supabase Dashboard → Authentication → Users

**Error:** "User not redirected after login"
**Solution:**
1. Check browser console for errors
2. Verify `SUPABASE_ANON_KEY` is set correctly
3. Make sure Supabase Auth provider (Email) is enabled

### Admin Login Not Working

**Error:** "Unauthorized"
**Solution:**
1. Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` are set correctly
2. Regenerate password hash:
   ```bash
   node -e "console.log(require('crypto').createHash('sha256').update('YourPassword').digest('hex'))"
   ```
3. Set environment variables in Netlify

### Payment Errors

**Error:** "Razorpay not configured"
**Solution:** Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` environment variables.

**Error:** "Payment failed"
**Solution:**
1. Verify Razorpay account is active
2. Check using test keys in development
3. Verify webhook URL is configured (if using webhooks)

### Function Timeout

**Error:** "Function execution timed out"
**Solution:**
1. Optimize slow database queries
2. Check for infinite loops in code
3. Reduce API call complexity
4. Consider upgrading Netlify plan (Pro: 26s timeout vs Free: 10s)

---

## Security Checklist

### Pre-Production Checklist
- ✅ Changed `ADMIN_USERNAME` from default `admin`
- ✅ Changed `ADMIN_PASSWORD_HASH` from default
- ✅ Generated unique `SESSION_SECRET` (64+ characters)
- ✅ Using Razorpay **live keys** (not test keys)
- ✅ Verified Supabase RLS policies (if enabled)
- ✅ Set `NODE_ENV=production`
- ✅ All secrets stored in environment variables (not code)
- ✅ Tested all critical user flows

### Ongoing Security
- 🔒 Monitor Netlify Function logs for suspicious activity
- 🔒 Regularly update dependencies (`npm audit`)
- 🔒 Review Supabase Dashboard → Authentication for unusual patterns
- 🔒 Rotate API keys periodically
- 🔒 Enable Netlify DDoS protection (Pro plan)

---

## Architecture Notes

### Serverless Compatibility
This app is designed for serverless deployment:
- ✅ **No in-memory sessions** - Uses database-backed sessions (if needed)
- ✅ **Stateless functions** - Each request is independent
- ✅ **No long-running processes** - All operations complete within function timeout
- ✅ **Connection pooling** - Supabase handles database connections via REST API

### API Endpoints on Netlify
All `/api/*` routes are mapped to `/.netlify/functions/api/*` automatically via `netlify.toml`.

**Example:**
- `POST /api/auth/login` → `/.netlify/functions/api` (handled by Express router)

### Cold Starts
First request after inactivity may take 1-2 seconds (cold start). Subsequent requests are fast.

---

## Support Resources

- **Netlify Docs:** https://docs.netlify.com
- **Supabase Docs:** https://supabase.com/docs
- **Razorpay Docs:** https://razorpay.com/docs
- **OpenRouter Docs:** https://openrouter.ai/docs

---

## Quick Reference: All Secret Keys

| Secret Key | Required? | Used For | Where to Get |
|------------|-----------|----------|--------------|
| `SUPABASE_URL` | ✅ Required | Database & Auth | Supabase Dashboard → API |
| `SUPABASE_ANON_KEY` | ✅ Required | Client auth | Supabase Dashboard → API |
| `SESSION_SECRET` | ✅ Required | Session security | Generate: `openssl rand -base64 64` |
| `RAZORPAY_KEY_ID` | Optional | Payments | Razorpay Dashboard → API Keys |
| `RAZORPAY_KEY_SECRET` | Optional | Payments | Razorpay Dashboard → API Keys |
| `OPENROUTER_API_KEY` | Optional | AI features | OpenRouter Dashboard → Keys |
| `ADMIN_USERNAME` | Optional | Admin access | Your choice (default: `admin`) |
| `ADMIN_PASSWORD_HASH` | Optional | Admin security | Generate SHA-256 hash |
| `NODE_ENV` | Required | Environment | Set to `production` |

---

## Changelog

**v4.0** - November 1, 2025
- Simplified Supabase setup (URL + anon key only)
- Added comprehensive secret management guide
- Enhanced security checklist
- Updated for serverless-first architecture

**v3.0** - October 31, 2025
- Added Netlify Functions support
- Serverless deployment configuration
- Database-backed sessions

**v2.0** - Earlier
- Initial Replit deployment
- Supabase integration
- User authentication

---

**Ready to Deploy? Follow these steps in order:**
1. ✅ Set up Supabase project and run schema.sql
2. ✅ Get all API keys (Supabase, Razorpay, OpenRouter)
3. ✅ Set environment variables in Netlify
4. ✅ Deploy via Netlify UI or CLI
5. ✅ Test all critical flows
6. ✅ Set custom domain (optional)
7. ✅ Go live! 🚀
