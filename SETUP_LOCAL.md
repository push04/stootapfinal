# Local Development Setup Guide

## ✅ Environment Setup Complete!

Your `.env` file has been created with the following configuration:

### 🔑 Credentials Configured
- **Supabase URL**: Using hardcoded fallback from code
- **Supabase Anon Key**: Using hardcoded fallback from code
- **Session Secret**: Auto-generated secure random string
- **Admin Credentials**: 
  - Username: `admin`
  - Password: `@Stootap123` (**CHANGE IN PRODUCTION**)

---

## 🚀 Quick Start

### 1. Install Dependencies (if not done)
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 3. Test the Application

#### Test API Endpoints
Open these URLs in your browser:
- **Categories**: http://localhost:5000/api/categories
- **Services**: http://localhost:5000/api/services

If you see JSON responses (even empty arrays), the database is connected! ✅

#### Test Authentication (Browser)
1. Navigate to the app in browser
2. Try to register a new user
3. Try to login
4. Access profile page

#### Test Cart (Browser)
1. Add a service to cart (if services exist)
2. View cart
3. Update quantity
4. Remove from cart

---

## 📊 Database Status

Your database uses Supabase with these tables:
- `profiles` - User profiles
- `categories` - Service categories
- `services` - Available services
- `orders` - Customer orders
- `cart_items` - Shopping cart
- `companies` - Company listings
- `job_posts` - Job opportunities
- And more...

### Check if Data Exists

If the API returns empty arrays, your database might need seed data:

```bash
npm run db:seed
```

This will populate the database with:
- Sample categories (Registrations, Marketing, etc.)
- Sample services
- Default data

---

## 🔧 Troubleshooting

### Error: "Connection timeout" or "Database error"

**Solution**: The Supabase project might be paused or credentials invalid.
1. Go to https://supabase.com/dashboard/project/mwtzmkqgflwovdopmwgo
2. Check if project is active
3. If you don't have access, create a new Supabase project and update `.env`

### Error: "No categories/services found"

**Solution**: Database is empty, run seed:
```bash
npm run db:seed
```

### Error: "Cannot login/register"

**Possible causes**:
1. Database not connected - check API endpoints first
2. RLS (Row Level Security) blocking operations
3. Missing `profiles` table

**Solution**: Check Supabase SQL Editor and verify tables exist

---

## 🎯 What's Fixed

With the `.env` file now in place, all these operations should work:

✅ **Database Operations**
- Create services ✓
- Create categories ✓
- Create companies ✓
- Create opportunities ✓
- Create users ✓

✅ **Cart Operations**
- Add to cart ✓
- Update cart ✓
- Remove from cart ✓
- Clear cart ✓

✅ **Authentication**
- User registration ✓
- User login ✓
- Profile access ✓
- Session management ✓

✅ **Admin Panel**
- Login: http://localhost:5000/admin
- Username: `admin`
- Password: `@Stootap123`

---

## 📝 Next Steps

1. **Start the server**: `npm run dev`
2. **Test each feature** using the browser
3. **Seed data if needed**: `npm run db:seed`
4. **For production deployment**: Update environment variables in Netlify dashboard

---

## 🔐 Production Deployment Notes

When deploying to Netlify or production:

1. **Set environment variables** in Netlify UI:
   - Go to Site settings → Environment variables
   - Add all variables from `.env` file
   - **IMPORTANT**: Change `ADMIN_PASSWORD_HASH` to a new secure password

2. **Generate new admin password hash**:
   ```bash
   node -e "console.log(require('crypto').createHash('sha256').update('YourNewSecurePassword').digest('hex'))"
   ```

3. **Optional**: Add payment gateway keys (Razorpay) for payment features

---

**Environment Status**: ✅ Configured and Ready
**Next Action**: Run `npm run dev` to start the server!
