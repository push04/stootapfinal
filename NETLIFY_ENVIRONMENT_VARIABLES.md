# Netlify Environment Variables - Stootap Deployment Guide

This document lists all environment variables required for deploying Stootap to Netlify.

## 🔒 Required Environment Variables

### Database Configuration
```
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
```
**Description:** PostgreSQL connection string for your database  
**Source:** Neon Database or other PostgreSQL provider  
**Example:** `postgresql://user:pass@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`

---

### Session Management
```
SESSION_SECRET=your-random-secure-string-min-32-characters
```
**Description:** Secret key for encrypting user sessions  
**⚠️ SECURITY:** Must be a long, random string (minimum 32 characters)  
**Generate with:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**Example:** `a7f4b3c2d9e8f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6`

---

### Admin Authentication
```
ADMIN_USERNAME=your_custom_admin
ADMIN_PASSWORD_HASH=your-password-hash-here
```
**Description:** Admin dashboard login credentials  
**⚠️ SECURITY WARNING:** Default credentials (`admin` / `@Stootap123`) are for development only!  
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

**Default values (dev only):**
- Username: `admin`
- Password: `@Stootap123`
- Hash: `ba09c85f7c68ee7f3e9c8d2b4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4`

---

## 🔌 Optional - Payment Integration (Razorpay)

If you want to enable payment processing:

```
RAZORPAY_KEY_ID=rzp_test_... or rzp_live_...
RAZORPAY_KEY_SECRET=your-razorpay-secret-key
```
**Description:** Razorpay payment gateway credentials  
**Source:** [Razorpay Dashboard](https://dashboard.razorpay.com/)  
**Note:** Use `rzp_test_` prefix for testing, `rzp_live_` for production

---

## 🤖 Optional - AI Features (OpenRouter)

If you want to enable AI concierge features:

```
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```
**Description:** OpenRouter API for AI chat functionality  
**Source:** [OpenRouter](https://openrouter.ai/)  
**Default Base URL:** `https://openrouter.ai/api/v1`

---

## 📊 Optional - Analytics

```
NEXT_PUBLIC_ANALYTICS=off
```
**Description:** Enable/disable analytics  
**Options:** `off`, `netlify`, `plausible`  
**Default:** `off`

---

## 🚀 How to Set Environment Variables in Netlify

### Method 1: Netlify UI (Recommended)

1. Go to your Netlify site dashboard
2. Navigate to **Site settings → Environment variables**
3. Click **Add a variable**
4. Enter the variable name and value
5. Click **Save**
6. Deploy your site

### Method 2: Netlify CLI

```bash
# Set a single variable
netlify env:set DATABASE_URL "your-database-url"

# Set multiple variables from .env file
netlify env:import .env.production
```

### Method 3: netlify.toml (Not Recommended for Secrets)

**⚠️ WARNING:** Never commit secrets to your repository!

```toml
[context.production.environment]
  # Only use for non-sensitive values
  NEXT_PUBLIC_ANALYTICS = "netlify"
```

---

## ✅ Minimal Configuration (Required to Deploy)

For a basic deployment, you only need:

```bash
DATABASE_URL=postgresql://...
SESSION_SECRET=your-random-32-char-string
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD_HASH=your-password-hash
```

---

## 🔍 Verification Checklist

Before deploying to production, verify:

- [x] DATABASE_URL is set and points to production database
- [x] SESSION_SECRET is a long random string (not default)
- [x] ADMIN_PASSWORD_HASH is changed from default
- [x] ADMIN_USERNAME is changed from "admin"
- [x] No secrets are committed to Git repository
- [x] All environment variables are set in Netlify UI
- [x] Test deployment works with environment variables

---

## 🛠️ Troubleshooting

### Database Connection Errors
- Verify DATABASE_URL format includes `?sslmode=require`
- Check database allows connections from Netlify's IP ranges
- Ensure connection string has correct username/password

### Admin Login Not Working
- Verify ADMIN_PASSWORD_HASH matches your password
- Check SESSION_SECRET is set correctly
- Clear browser cookies and try again

### Build Failures
- Check all required environment variables are set
- Review Netlify build logs for specific errors
- Ensure DATABASE_URL is accessible during build time

---

## 📝 Notes

- Environment variables are available at build time and runtime
- Changes to environment variables require a new deployment
- Netlify encrypts and secures all environment variables
- Use different databases for development and production
- Never share or commit your SESSION_SECRET or password hashes

---

## 🔗 Additional Resources

- [Netlify Environment Variables Documentation](https://docs.netlify.com/environment-variables/overview/)
- [Neon Database Setup](https://neon.tech/docs/introduction)
- [Razorpay Integration Guide](https://razorpay.com/docs/)
- [OpenRouter API Documentation](https://openrouter.ai/docs)

---

**Last Updated:** October 31, 2025
