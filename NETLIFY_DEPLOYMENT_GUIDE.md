# Netlify Deployment Guide for Stootap

## Pre-Deployment Checklist

- [ ] Supabase database tables created (see SUPABASE_SETUP_GUIDE.md)
- [ ] All environment variables ready
- [ ] GitHub repository connected to Netlify
- [ ] Build command tested locally

## Step 1: Create Netlify Site

1. Go to https://netlify.com
2. Click **Add new site** → **Import an existing project**
3. Choose your Git provider (GitHub)
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
   - **Functions directory**: `netlify-functions-build`

## Step 2: Set Environment Variables

Go to **Site settings** → **Environment variables** and add:

### Required Variables

```
# Supabase Server-Side
SUPABASE_URL=https://mwtzmkqgflwovdopmwgo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Supabase Client-Side
VITE_PUBLIC_SUPABASE_URL=https://mwtzmkqgflwovdopmwgo.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Session Security
SESSION_SECRET=<generate-a-strong-random-string-here>
```

### Optional Variables (for full functionality)

```
# Admin Panel
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<sha256-hash-of-your-password>

# AI Concierge
OPENROUTER_API_KEY=<your-openrouter-api-key>

# Payment Gateway
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
```

## Step 3: Deploy

1. Click **Deploy site**
2. Wait for build to complete (usually 2-3 minutes)
3. Your site will be live at: `https://<your-site-name>.netlify.app`

## Step 4: Test Deployment

Test these critical features:

1. **Homepage**: Should load with hero section
2. **Services Page**: Should show categories and services (if database is seeded)
3. **User Registration**: Create a new account
4. **User Login**: Sign in with your account
5. **Profile Page**: Should show your user information
6. **Admin Login**: Go to `/admin/login` and sign in
7. **Admin Dashboard**: Should show analytics and data
8. **Deep Links**: Visit `/services` or `/profile` directly (should not 404)

## Step 5: Custom Domain (Optional)

1. Go to **Domain management** → **Add custom domain**
2. Enter your domain name
3. Follow Netlify's DNS configuration instructions
4. Wait for SSL certificate to provision (automatic)

## Troubleshooting

### Build Fails

**Error**: `MODULE_NOT_FOUND` or `Cannot find package`
- **Fix**: Run `npm install` locally, commit `package-lock.json`

**Error**: TypeScript errors during build
- **Fix**: Run `npm run check` locally and fix all errors

### Services Not Loading on Production

**Error**: "Failed to load services"
- **Cause**: Database tables not created or environment variables missing
- **Fix**:
  1. Verify tables exist in Supabase
  2. Check all environment variables are set in Netlify
  3. Check Netlify function logs for errors

### Routes Return 404

**Error**: Direct URLs like `/services` return 404
- **Cause**: SPA fallback not working
- **Fix**: Verify `netlify.toml` has the `/*` → `/index.html` redirect

### Authentication Not Working

**Error**: Login/register fails
- **Cause**: Supabase environment variables incorrect
- **Fix**: 
  1. Verify `VITE_PUBLIC_SUPABASE_URL` and `VITE_PUBLIC_SUPABASE_ANON_KEY` are correct
  2. Check browser console for Supabase errors

### Admin Panel Not Working

**Error**: Admin login fails or returns 401
- **Cause**: Admin credentials incorrect or SESSION_SECRET missing
- **Fix**:
  1. Set SESSION_SECRET in Netlify environment variables
  2. Generate ADMIN_PASSWORD_HASH using: `node -e "console.log(require('crypto').createHash('sha256').update('YOUR_PASSWORD').digest('hex'))"`
  3. Set ADMIN_USERNAME and ADMIN_PASSWORD_HASH in Netlify

## Viewing Logs

1. Go to Netlify Dashboard → **Functions**
2. Click on **api** function
3. View function logs to debug issues
4. Filter by error level to find problems

## Performance Optimization

Already configured:
- ✅ Static asset caching (1 year)
- ✅ No-cache for index.html
- ✅ Security headers
- ✅ Serverless functions with esbuild bundling
- ✅ SPA routing

## Security Notes

- **Never commit** `SUPABASE_SERVICE_ROLE_KEY` to Git
- **Never expose** `SESSION_SECRET` in client code
- **Always use** HTTPS in production (Netlify provides this)
- **Enable** Supabase RLS rules for additional security (optional)

## Cost Estimate (Netlify Free Tier)

- **Build minutes**: 300/month (more than enough)
- **Bandwidth**: 100GB/month
- **Function invocations**: 125k/month
- **Function runtime**: 100 hours/month

For most small-medium businesses, the free tier should be sufficient.

## Support

If you encounter issues:
1. Check Netlify build logs
2. Check Netlify function logs
3. Check browser console for client errors
4. Verify all environment variables are set correctly
5. Ensure Supabase database has tables and data
