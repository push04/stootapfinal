# Netlify Deployment Guide for Stootap

This guide provides step-by-step instructions for deploying the Stootap business services platform to Netlify.

## Prerequisites

- GitHub repository with your Stootap code
- Netlify account (sign up at https://netlify.com)
- Database (Supabase or Neon)

## Required Environment Variables

Add these environment variables in Netlify Dashboard → Site Settings → Environment variables:

### Database Configuration
```
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
```
**Description:** PostgreSQL connection string from Supabase or Neon database  
**Where to get it:** 
- Supabase: Project Settings → Database → Connection String (URI mode)
- Neon: Connection Details → Connection String

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

### Node Environment
```
NODE_ENV=production
```
**Description:** Ensures production optimizations are enabled  
**Value:** Always set to `production` for Netlify

## Deployment Steps

### 1. Prepare Your Repository

Ensure your `package.json` has the correct build scripts:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "db:push": "drizzle-kit push"
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
   - **Functions directory:** `dist` (if using Netlify Functions)

### 3. Configure Environment Variables

1. Go to Site settings → Environment variables
2. Add all required variables listed above
3. Click "Save"

### 4. Deploy Database Schema

Before first deployment, set up your database:

1. **Using Supabase:**
   - Go to SQL Editor in Supabase Dashboard
   - Run the SQL file from `supabase_schema/schema.sql`
   - Verify tables are created

2. **Using Drizzle Kit (Recommended):**
   ```bash
   # Run locally with DATABASE_URL set
   npm run db:push
   ```

### 5. Deploy Site

1. Click "Deploy site" in Netlify
2. Wait for build to complete (typically 2-5 minutes)
3. Access your site at the provided Netlify URL

## Post-Deployment

### Verify Deployment

1. Visit your site URL
2. Test main pages (Home, Services, etc.)
3. Test admin login at `/admin/login`
4. Check database connectivity

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

## Troubleshooting

### Build Fails

**Error:** "MODULE_NOT_FOUND"  
**Solution:** Ensure all dependencies are in `package.json` and run `npm install`

**Error:** "SESSION_SECRET is required"  
**Solution:** Add SESSION_SECRET environment variable

### Database Connection Fails

**Error:** "DATABASE_URL environment variable is required"  
**Solution:** Add DATABASE_URL in environment variables

**Error:** "Connection timeout"  
**Solution:** Check database URL format and ensure SSL mode is correct

### Admin Login Not Working

**Error:** "Unauthorized"  
**Solution:** Check ADMIN_USERNAME and ADMIN_PASSWORD_HASH are set correctly

## Security Checklist

- ✅ SESSION_SECRET is unique and not committed to repo
- ✅ DATABASE_URL uses SSL connection (`sslmode=require`)
- ✅ **CRITICAL:** Changed ADMIN_USERNAME and ADMIN_PASSWORD_HASH from defaults
- ✅ Admin password is strong and unique (minimum 12 characters)
- ✅ NODE_ENV=production is set
- ✅ All sensitive data is in environment variables, not code

**⚠️ READ SECURITY_NOTICE.md for complete admin security guidelines**

## Performance Optimization

### Recommended Settings

1. **Enable Asset Optimization:**
   - Site settings → Build & deploy → Post processing
   - Enable: Bundle CSS, Minify CSS, Minify JS, Compress images

2. **Configure Caching:**
   Add `netlify.toml` to repository:
   ```toml
   [[headers]]
     for = "/assets/*"
     [headers.values]
       Cache-Control = "public, max-age=31536000, immutable"
   
   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-Content-Type-Options = "nosniff"
       Referrer-Policy = "strict-origin-when-cross-origin"
   ```

3. **Enable Incremental Builds:**
   - Faster rebuild times for code changes

## Support & Resources

- **Netlify Documentation:** https://docs.netlify.com
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
**Version:** 2.0
