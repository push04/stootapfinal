# Hostinger Deployment Guide for Stootap

## Prerequisites
- Hostinger VPS or Node.js hosting plan (NOT basic shared hosting)
- SSH access or Node.js application panel access
- FTP client (FileZilla, WinSCP, etc.)

## Files to Upload via FTP

Upload these folders and files to your Hostinger public_html or application directory:

### Required Files:
```
├── .env                    # Environment variables (CRITICAL - already configured)
├── package.json            # Dependencies
├── package-lock.json       # Dependency lock file
├── server/                 # Backend server files
│   ├── index.ts           
│   ├── app.ts
│   ├── db.ts
│   ├── routes.ts
│   ├── storage.ts
│   ├── auth.ts
│   ├── auth-middleware.ts
│   ├── validation.ts
│   ├── supabase-server.ts
│   ├── vite.ts
│   └── opportunities-routes.ts
├── shared/                 # Shared schema
├── dist/                   # Built frontend (after running npm run build)
│   └── public/            # Static files served by Express
└── client/                 # Source files (optional, for development)
```

### DO NOT Upload:
- `node_modules/` (will be installed on server)
- `.git/`
- Any `.log` files

## Deployment Steps

### Step 1: Upload Files
1. Connect to Hostinger via FTP
2. Upload all required files to your application directory
3. Make sure `.env` file is uploaded with correct production settings

### Step 2: Install Dependencies (via SSH or Hostinger panel)
```bash
cd /your-app-directory
npm install
```

### Step 3: Start the Server
For production with PM2 (recommended):
```bash
npm install -g pm2
pm2 start "npx tsx server/index.ts" --name stootap
pm2 save
pm2 startup
```

Or direct start:
```bash
npx tsx server/index.ts
```

### Step 4: Configure Hostinger
- Set your domain to point to port 5001
- Or configure Nginx/Apache proxy to forward requests to port 5001

## Environment Variables (Already in .env)
Your `.env` is already configured with:
- ✅ VITE_PUBLIC_SITE_URL=https://stootap.com
- ✅ NODE_ENV=production
- ✅ DATABASE_URL (direct connection to Supabase)
- ✅ All Supabase keys

## Supabase Configuration Required
In your Supabase Dashboard > Authentication > URL Configuration:
- **Site URL**: Set to `https://stootap.com`
- **Redirect URLs**: Add `https://stootap.com/**`

## Testing After Deployment
1. Visit https://stootap.com
2. Test navigation (Packages dropdown, etc.)
3. Test login/signup
4. Test contact forms
5. Check admin panel at /admin

## Troubleshooting
- If database errors: Check DATABASE_URL in .env
- If CORS errors: Ensure Supabase Site URL matches your domain
- If 404 errors: Check if dist/public exists and contains index.html
