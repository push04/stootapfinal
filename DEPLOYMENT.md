# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Configuration

**Required Environment Variables:**
```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-anon-key"

# Authentication
SESSION_SECRET="random-secret-key-minimum-32-chars"

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# Application
NODE_ENV="production"
PORT=5000
```

### 2. Database Setup

```bash
# Run migrations
npm run db:migrate

# Verify database connection
npm run db:check
```

### 3. Build Application

```bash
# Install dependencies
npm install --production

# Build frontend and backend
npm run build

# Verify build
ls -la dist/
```

### 4. Security Hardening

**Enable Security Headers:**
Add to your reverse proxy (Nginx/Apache) or server configuration:

```nginx
# Nginx example
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.razorpay.com;" always;
```

**Rate Limiting:**
- Implement rate limiting on API endpoints
- Recommended: 100 requests per 15 minutes per IP
- Use libraries like `express-rate-limit`

**CORS Configuration:**
```javascript
// Only allow your production domain
cors({
  origin: 'https://yourdomain.com',
  credentials: true
})
```

### 5. SSL/HTTPS Setup

**Using Let's Encrypt (Recommended):**
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 6. Performance Optimization

**Enable Compression:**
```javascript
// In server/index.ts
import compression from 'compression';
app.use(compression());
```

**Asset Caching:**
```nginx
# Nginx cache configuration
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**Database Connection Pooling:**
Ensure Supabase connection pool is properly configured:
```javascript
// Recommended pool size
poolSize: 20,
poolTimeout: 30000
```

### 7. Monitoring Setup

**Error Logging (Sentry):**
```bash
npm install @sentry/node @sentry/react
```

Add to server:
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: "production"
});
```

**Uptime Monitoring:**
- UptimeRobot (Free)
- Pingdom
- New Relic

### 8. Backup Strategy

**Database Backups:**
```bash
# Daily automated backups via cron
0 2 * * * pg_dump $DATABASE_URL > /backups/db_$(date +\%Y\%m\%d).sql
```

**Keep:**
- Daily backups for 7 days
- Weekly backups for 4 weeks
- Monthly backups for 12 months

### 9. Deployment Options

#### Option A: Traditional VPS (DigitalOcean/Linode)

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start npm --name "stootap" -- start
pm2 save
pm2 startup

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/stootap
```

Nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Option B: Cloud Platform (Vercel/Railway/Render)

**Vercel:**
```json
// vercel.json
{
  "builds": [
    { "src": "package.json", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/" }
  ]
}
```

**Railway:**
- Connect GitHub repository
- Set environment variables
- Deploy automatically on push

### 10. Post-Deployment Verification

**Health Checks:**
```bash
# Test API endpoints
curl https://yourdomain.com/api/health

# Test authentication
curl https://yourdomain.com/api/me

# Test database connection
curl https://yourdomain.com/api/categories
```

**Performance Testing:**
```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test load
ab -n 1000 -c 10 https://yourdomain.com/
```

**Security Scan:**
```bash
# Use Mozilla Observatory
https://observatory.mozilla.org/

# SSL Labs
https://www.ssllabs.com/ssltest/
```

## Rollback Plan

**If deployment fails:**

1. **Immediate rollback:**
```bash
pm2 restart stootap@previous
```

2. **Database rollback:**
```bash
psql $DATABASE_URL < /backups/db_backup_latest.sql
```

3. **Verify rollback:**
```bash
curl https://yourdomain.com/api/health
```

## Support & Maintenance

**Daily Tasks:**
- Monitor error logs
- Check uptime status
- Review API performance

**Weekly Tasks:**
- Database optimization
- Security updates
- Performance analysis

**Monthly Tasks:**
- Full backup verification
- Security audit
- Dependency updates

## Emergency Contacts

- **Developer**: [Your contact]
- **Hosting Support**: [Provider support]
- **Database**: Supabase support
- **Payment**: Razorpay support

## Success Criteria

✅ Application accessible via HTTPS
✅ All API endpoints responding < 200ms
✅ Database queries optimized
✅ Error rate < 0.1%
✅ Uptime > 99.9%
✅ Security headers configured
✅ Backups running daily
✅ Monitoring alerts active
