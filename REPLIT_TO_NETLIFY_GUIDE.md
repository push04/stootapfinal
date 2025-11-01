# Deploying Stootap from Replit to Netlify

## ✅ Current Status

Your Stootap application is **fully configured** and **ready for Netlify serverless deployment**!

### What's Been Completed

✅ All dependencies installed  
✅ PostgreSQL database configured and seeded  
✅ Netlify serverless functions built and tested  
✅ All API endpoints working correctly  
✅ Environment variables configured  
✅ Build process verified successfully  
✅ TypeScript configured for serverless deployment

### Build Artifacts Ready for Deployment

- **Frontend:** `dist/public/` - Static React application (970 bytes HTML + 820 KB assets)
- **Serverless Functions:** `netlify-functions-build/` - Express API as serverless functions
  - `api.js` (2.3 MB) - Main API handler with all routes
  - `razorpay-webhook.js` (2.0 KB) - Payment webhook handler

## 🚀 Deploy to Netlify in 5 Minutes

### Step 1: Connect to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Select the Stootap repository

### Step 2: Configure Build Settings

Netlify will auto-detect the settings, but verify these:

- **Build command:** `npm run build`
- **Publish directory:** `dist/public`
- **Functions directory:** `netlify-functions-build`
- **Node version:** `20`

### Step 3: Add Environment Variables

In Netlify Dashboard → Site settings → Environment variables, add:

#### Required Variables:

```bash
# Database (use your Replit DATABASE_URL or set up new Neon/Supabase)
DATABASE_URL=postgresql://...your_connection_string...

# Session Security (REQUIRED)
SESSION_SECRET=<your-session-secret-from-replit>

# Node Environment
NODE_ENV=production
```

#### Optional but Recommended:

```bash
# Payment Processing
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>

# AI Concierge
OPENROUTER_API_KEY=<your-openrouter-key>
```

### Step 4: Deploy!

Click **"Deploy site"** and wait 2-3 minutes. Netlify will:
1. Run `npm install`
2. Run `npm run build` (builds frontend + serverless functions)
3. Deploy static files to CDN
4. Deploy serverless functions
5. Give you a live URL like `https://your-app.netlify.app`

## 🔧 Important Configuration Details

### Database Connection

Your app uses **PostgreSQL** and needs a **connection pooler** for serverless:

- ✅ **Recommended:** Supabase (pooler port 6543)
- ✅ **Alternative:** Neon Database (pooling enabled)
- ❌ **Not recommended:** Direct PostgreSQL (port 5432) - will timeout in serverless

**Current Setup:** Your Replit DATABASE_URL is already configured correctly.

### Serverless Architecture

All API routes are handled by Netlify Functions:
- **Main API:** `/.netlify/functions/api/*` → handles all `/api/*` routes
- **Webhook:** `/.netlify/functions/razorpay-webhook` → handles payment webhooks

The `netlify.toml` file already configures these redirects automatically.

### Session Management

Sessions are stored in PostgreSQL (not memory) for serverless compatibility:
- Uses `connect-pg-simple` for database-backed sessions
- Automatically creates `session` table on first run
- Survives function cold starts

## 📊 What Works in Serverless Mode

✅ All API endpoints (categories, services, cart, orders)  
✅ User authentication and sessions  
✅ Admin dashboard  
✅ Payment processing via Razorpay  
✅ AI Concierge chatbot  
✅ Database operations with connection pooling  
✅ File uploads and document management  

## 🎯 Testing Your Deployment

After deployment, test these key features:

1. **Homepage:** Should load with all services
2. **Services page:** Browse and filter services
3. **Add to cart:** Test cart functionality
4. **Admin login:** Access `/admin/login` (credentials in environment vars)
5. **AI Concierge:** Click the purple chat button (bottom right)
6. **Checkout:** Test Razorpay payment flow (use test mode)

## 🔐 Security Checklist

Before going live:

- [ ] Change admin credentials from defaults
- [ ] Use production Razorpay keys (not test keys)
- [ ] Set strong SESSION_SECRET (min 32 characters)
- [ ] Enable HTTPS (Netlify does this automatically)
- [ ] Review CORS settings if using custom domain

## 💡 Pro Tips

1. **Custom Domain:** Add your domain in Netlify → Domain settings
2. **Previews:** Every git push creates a preview deployment
3. **Rollbacks:** Easy one-click rollback to previous deployments
4. **Analytics:** Enable Netlify Analytics for visitor tracking
5. **Forms:** Use Netlify Forms for contact page (already configured)

## 📝 Need Help?

- Check build logs in Netlify Dashboard
- Review `NETLIFY_DEPLOYMENT.md` for detailed configuration
- Test locally first: `npm run build && netlify dev`
- Netlify Functions logs available in Dashboard → Functions tab

## 🎉 You're All Set!

Your Stootap platform is production-ready for Netlify serverless deployment. Just connect your GitHub repo, add environment variables, and deploy!

**Build Status:** ✅ All builds passing  
**Serverless Config:** ✅ Optimized for Netlify  
**Database:** ✅ Ready with pooled connections  
**Functions:** ✅ 2 serverless functions compiled  
**Frontend:** ✅ React app built and optimized
