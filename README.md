# Stootap - Business Services Platform

> **⚠️ SECURITY WARNING: PRIVATE REPOSITORY REQUIRED**
> 
> This repository contains Supabase credentials stored in environment files for Replit builds:
> - `client/.env.development`
> - `client/.env.production`
> 
> **IMPORTANT SECURITY REQUIREMENTS:**
> - ✅ **KEEP THIS REPOSITORY PRIVATE AT ALL TIMES**
> - ⚠️ **DO NOT** make this repository public without rotating all secrets first
> - 🔑 If you need to make this repo public, you MUST:
>   1. Rotate Supabase anon key immediately
>   2. Replace values in `.env.*` files with placeholders
>   3. Purge secret history from all commits (using tools like `git filter-branch`)
>   4. Move real keys to Netlify environment variables
>   5. Rebuild application with new configuration

## About

Stootap is a comprehensive business services platform designed to help students and businesses launch and grow in India. It offers over 300 services across various categories including business registration, financial compliance, digital marketing, operations, and HR.

### Key Features

- 🛒 Complete e-commerce experience with catalog browsing and shopping cart
- 💳 Razorpay payment integration
- 🤖 AI concierge for guidance and lead capture
- 👤 Full authentication and authorization with Supabase
- 🔒 Role-based access control (student, business, admin)
- 📱 Responsive design with modern UI components
- 🚀 Serverless architecture ready for Netlify deployment

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Wouter** for lightweight client-side routing
- **Tailwind CSS** with shadcn/ui components
- **TanStack React Query** for server state management
- **Supabase** for authentication and user management

### Backend
- **Express.js** with TypeScript
- **Netlify Functions** for serverless deployment
- **PostgreSQL** (Neon) for data storage
- **Drizzle ORM** for type-safe database queries

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Razorpay account (for payments)
- OpenRouter API key (for AI features)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:

The Supabase credentials are already configured in:
- `client/.env.development` (for development)
- `client/.env.production` (for production builds)

For other secrets, set them in your Replit environment or create a `.env` file in the root:

```env
# Razorpay (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# OpenRouter (for AI concierge)
OPENROUTER_API_KEY=your_openrouter_api_key

# Session (for production)
SESSION_SECRET=your_session_secret
```

3. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Authentication

### Supabase Authentication

This application uses Supabase for user authentication and management:

- **Sign Up**: Users can register with email/password
- **Sign In**: Users can log in to access protected features
- **Role-Based Access**: Users have roles (student, business, admin)
- **Session Management**: Automatic token refresh and persistent sessions
- **Password Reset**: Users can reset forgotten passwords
- **Email Verification**: Optional email verification flow

### User Roles

- **Student**: Access to student-specific services and features
- **Business**: Access to business services and advanced features
- **Admin**: Full access to admin dashboard and management features

### Protected Routes

The following routes require authentication:
- `/profile` - User profile and settings
- `/dashboard` - User dashboard
- `/checkout` - Checkout process
- `/admin` - Admin dashboard (requires admin role)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:client` - Build frontend only
- `npm run build:functions` - Build Netlify functions
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes
- `npm run db:seed` - Seed database with sample data

### Project Structure

```
stootap/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   │   ├── auth-service.ts    # Unified auth service
│   │   │   └── supabase-client.ts # Supabase client config
│   │   └── pages/         # Page components
│   ├── .env.development   # Development environment vars (CONTAINS SECRETS)
│   └── .env.production    # Production environment vars (CONTAINS SECRETS)
├── server/                # Backend Express application
├── netlify/               # Netlify serverless functions
│   └── functions/
├── shared/                # Shared TypeScript types
└── migrations/            # Database migrations

```

## Deployment

### Netlify Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to Netlify:
```bash
npm run netlify:deploy
```

Or connect your repository to Netlify for automatic deployments.

### Environment Variables for Netlify

Set these environment variables in your Netlify dashboard:

- `VITE_PUBLIC_SUPABASE_URL`
- `VITE_PUBLIC_SUPABASE_ANON_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `OPENROUTER_API_KEY`
- `SESSION_SECRET`

### Build Configuration

The project is configured for autoscale deployment on Netlify with:
- Frontend: SPA with client-side routing
- Backend: Serverless functions for API endpoints
- Database: PostgreSQL (Neon) with connection pooling

## Security Best Practices

### Current Security Measures

- ✅ HTTPS-only connections (enforced by Netlify)
- ✅ Secure session management with Supabase
- ✅ Password hashing handled by Supabase Auth
- ✅ Role-based access control
- ✅ CORS protection on API endpoints
- ✅ Input validation with Zod
- ✅ XSS protection via React's built-in escaping
- ✅ Error boundary for graceful error handling

### Recommended Enhancements for Production

- [ ] Implement rate limiting on auth endpoints
- [ ] Add Content Security Policy headers
- [ ] Enable email verification for all new users
- [ ] Implement CSRF protection tokens
- [ ] Add audit logging for sensitive operations
- [ ] Set up monitoring and alerting

## Contributing

This is a private project. If you need to share with collaborators:
1. Ensure they understand the security requirements
2. Verify the repository remains private
3. Use Replit's collaboration features for secure access

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please contact the development team.

---

**Remember**: This repository contains sensitive credentials. Keep it private and rotate keys before any public sharing.
