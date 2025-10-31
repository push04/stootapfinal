# Netlify Environment Variables - Stootap Serverless Deployment

This document lists all environment variables required for deploying Stootap to Netlify as a serverless application.

## 🔒 Required Environment Variables

### Database Configuration

**Option 1: Direct Connection String (Recommended)**
```
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```
**Description:** PostgreSQL connection string using Supabase pooler (REQUIRED for serverless)  
**Source:** Supabase Database Settings → Connection string → URI (Pooler)  
**Critical:** MUST use pooler connection (port 6543), not direct (port 5432)

**Why pooler?** Serverless functions create many short-lived connections. The pooler prevents "too many clients" errors.

**Example:**
```
DATABASE_URL=postgresql://postgres.abc123xyz:MyS3cur3P@ss@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

**Option 2: Supabase Credentials (Auto-builds pooler URL)**
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_DB_PASSWORD=your-database-password
```
**Description:** Individual Supabase credentials (app auto-builds pooler connection)  
**Source:** Supabase Project Settings  
**Note:** App will construct: `postgresql://postgres.{ref}:{password}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`

---

### Session Management
```
SESSION_SECRET=your-random-secure-string-min-32-characters
```
**Description:** Secret key for encrypting user sessions (stored in database for serverless compatibility)  
**⚠️ SECURITY:** Must be a long, random string (minimum 32 characters)  
**Generate with:**
```bash
openssl rand -base64 32
# or
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**Example:** `a7f4b3c2d9e8f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6`

**Note:** Sessions are stored in PostgreSQL `session` table (not in-memory) for serverless compatibility.

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
# 1. Choose a strong password
YOUR_PASSWORD="MySecureP@ssw0rd2025!"

# 2. Generate hash
node -e "console.log(require('crypto').createHash('sha256').update('MySecureP@ssw0rd2025!').digest('hex'))"

# 3. Set environment variables
ADMIN_USERNAME=your_admin_name
ADMIN_PASSWORD_HASH=<output-from-step-2>
```

**Security Requirements:**
- Username: NOT "admin"
- Password: Minimum 12 characters, mix of upper/lower/numbers/symbols
- Hash: Generated using SHA-256 (as shown above)

---

### Node Environment
```
NODE_ENV=production
```
**Description:** Ensures production optimizations and security settings  
**Value:** Always set to `production` for Netlify  
**Impact:** Enables secure cookies, error suppression, performance optimizations

---

## 🔌 Optional - Payment Integration (Razorpay)

```
RAZORPAY_KEY_ID=rzp_test_... or rzp_live_...
RAZORPAY_KEY_SECRET=your-razorpay-secret-key
```
**Description:** Razorpay payment gateway credentials  
**Source:** [Razorpay Dashboard](https://dashboard.razorpay.com/) → Account & Settings → API Keys  
**Testing:** Use `rzp_test_` keys for development  
**Production:** Use `rzp_live_` keys (requires KYC verification)

**What happens if not set:**
- Orders can still be created
- Payment will be marked as "pending"
- Manual/offline payment processing needed

---

## 🤖 Optional - AI Features (OpenRouter)

```
OPENROUTER_API_KEY=sk-or-v1-...
```
**Description:** OpenRouter API for AI concierge functionality  
**Source:** [OpenRouter](https://openrouter.ai/) → Settings → API Keys  
**Model:** Uses `deepseek/deepseek-chat-v3-0324:free` (cost-effective)  
**Cost:** Free tier available, ~$0.001 per request

**What happens if not set:**
- AI Concierge feature will be disabled
- Users will see an error message when trying to use AI chat
- All other features work normally

---

## 🚀 How to Set Environment Variables in Netlify

### Method 1: Netlify UI (Recommended)

1. Go to your Netlify site dashboard
2. Navigate to **Site settings → Environment variables**
3. Click **Add a variable**
4. Enter the variable name and value
5. Click **Save**
6. **Important:** Trigger a new deploy for changes to take effect

### Method 2: Netlify CLI

```bash
# Set a single variable
netlify env:set DATABASE_URL "postgresql://..."

# Set session secret
netlify env:set SESSION_SECRET "$(openssl rand -base64 32)"

# Set admin credentials
netlify env:set ADMIN_USERNAME "your_admin"
netlify env:set ADMIN_PASSWORD_HASH "$(node -e "console.log(require('crypto').createHash('sha256').update('YourPassword').digest('hex'))")"

# Deploy with new variables
netlify deploy --prod
```

### Method 3: Import from .env file

```bash
# Create .env.production file (DO NOT COMMIT THIS)
cat > .env.production << EOF
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret
ADMIN_USERNAME=your_admin
ADMIN_PASSWORD_HASH=your-hash
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your-secret
EOF

# Import all variables
netlify env:import .env.production

# Delete the file (never commit secrets!)
rm .env.production
```

---

## ✅ Minimal Configuration (Required to Deploy)

For a basic deployment, you need **exactly these 4 variables**:

```bash
DATABASE_URL=postgresql://postgres.{ref}:{password}@aws-0-{region}.pooler.supabase.com:6543/postgres
SESSION_SECRET=<32+ character random string>
ADMIN_USERNAME=<your-custom-admin-username>
ADMIN_PASSWORD_HASH=<sha256-hash-of-your-password>
```

Everything else is optional.

---

## 🔍 Pre-Deployment Verification Checklist

Before deploying to production, verify each item:

**Database:**
- [ ] DATABASE_URL is set and uses pooler (port 6543)
- [ ] Database connection tested locally
- [ ] Schema has been deployed (run `npm run db:push`)
- [ ] Initial data seeded (run `npm run db:seed` or via SQL editor)

**Security:**
- [ ] SESSION_SECRET is a long random string (not default)
- [ ] ADMIN_PASSWORD_HASH is changed from default
- [ ] ADMIN_USERNAME is changed from "admin"
- [ ] Password is strong (12+ chars, mixed case, symbols)
- [ ] No secrets are committed to Git repository

**Environment:**
- [ ] NODE_ENV=production is set
- [ ] All required variables set in Netlify UI (not locally)
- [ ] .env files are in .gitignore

**Optional Features:**
- [ ] Razorpay keys configured (if accepting payments)
- [ ] OpenRouter API key set (if using AI features)

---

## 🛠️ Troubleshooting

### Database Connection Errors

**Error:** `too many clients`  
**Solution:** You're using direct connection instead of pooler. Use port 6543, not 5432.

**Error:** `Connection timeout`  
**Solution:** 
1. Verify DATABASE_URL format is correct
2. Check Supabase project is running
3. Ensure pooler connection (port 6543)

**Error:** `relation "session" does not exist`  
**Solution:** Run database migrations: `npm run db:push`

### Admin Login Not Working

**Error:** `Unauthorized` or `Invalid credentials`  
**Solution:** 
1. Verify ADMIN_PASSWORD_HASH matches your password
2. Regenerate hash: `node -e "console.log(require('crypto').createHash('sha256').update('YourPassword').digest('hex'))"`
3. Check SESSION_SECRET is set correctly
4. Clear browser cookies and try again

**Error:** `Session save error`  
**Solution:** Check database connection and ensure `session` table exists

### Build Failures

**Error:** `SESSION_SECRET is required`  
**Solution:** Add SESSION_SECRET to Netlify environment variables

**Error:** `DATABASE_URL environment variable is required`  
**Solution:** Add DATABASE_URL or both SUPABASE_URL + SUPABASE_DB_PASSWORD

### Function Errors

**Error:** `Function execution timed out`  
**Solution:** 
1. Check database query performance
2. Ensure using pooler connection
3. Review function logs for slow operations

---

## 📊 Environment Variable Summary Table

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `DATABASE_URL` | ✅ Yes | None | PostgreSQL connection (pooler) |
| `SESSION_SECRET` | ✅ Yes | None (dev: random) | Session encryption |
| `ADMIN_USERNAME` | ✅ Yes | `admin` (dev only) | Admin login username |
| `ADMIN_PASSWORD_HASH` | ✅ Yes | Dev default | Admin password hash |
| `NODE_ENV` | ✅ Yes | `development` | Environment mode |
| `RAZORPAY_KEY_ID` | ❌ Optional | None | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | ❌ Optional | None | Razorpay secret |
| `OPENROUTER_API_KEY` | ❌ Optional | None | AI concierge API key |
| `SUPABASE_URL` | ❌ Optional | None | Alt to DATABASE_URL |
| `SUPABASE_DB_PASSWORD` | ❌ Optional | None | Alt to DATABASE_URL |

---

## 📝 Important Notes

### Serverless-Specific Requirements

1. **Database Pooling:** Always use pooler connection (port 6543) to prevent connection exhaustion
2. **Session Storage:** Sessions stored in PostgreSQL `session` table, not in-memory
3. **No Persistent State:** Each function invocation is isolated - no in-memory caching
4. **Cold Starts:** First request may be slower (~1-2s), subsequent requests faster

### Security Best Practices

1. **Never commit secrets** to version control
2. **Use different credentials** for development and production
3. **Rotate secrets** periodically (every 90 days recommended)
4. **Use strong passwords** for admin (12+ characters, mixed case, symbols)
5. **Monitor access logs** regularly via Netlify dashboard

### Changes from Traditional Deployment

- ❌ No `PORT` variable (Netlify manages this)
- ❌ No in-memory session store (`MemoryStore`)
- ✅ Database-backed sessions (`connect-pg-simple`)
- ✅ Pooler connection required (not optional)

---

## 🔗 Additional Resources

- [Netlify Environment Variables Docs](https://docs.netlify.com/environment-variables/overview/)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Razorpay API Keys](https://razorpay.com/docs/api/authentication/)
- [OpenRouter Documentation](https://openrouter.ai/docs)

---

**Last Updated:** October 31, 2025  
**Version:** 3.0 (Serverless/Functions)
