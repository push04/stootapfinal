# Security Notice - Admin Credentials

## ⚠️ IMPORTANT: Change Default Admin Credentials for Production

This application includes a default admin account for demonstration and development purposes:

**Default Credentials (DO NOT USE IN PRODUCTION):**
- Username: `admin`
- Password: `@Stootap123`

## Production Deployment Security

### Required Actions Before Production:

1. **Set Custom Admin Credentials** via environment variables:

```bash
# Generate a secure password hash
node -e "console.log(require('crypto').createHash('sha256').update('YOUR_SECURE_PASSWORD').digest('hex'))"
```

2. **Add to Environment Variables:**

```
ADMIN_USERNAME=your_custom_username
ADMIN_PASSWORD_HASH=<generated_hash_from_step_1>
SESSION_SECRET=<random_secret_32+_characters>
```

3. **Verify Configuration:**
   - Never commit credentials to version control
   - Use strong, unique passwords
   - Rotate credentials regularly
   - Enable HTTPS in production (automatic with Netlify)

## Current Security Measures

✅ Password hashing (SHA-256)  
✅ Session-based authentication  
✅ Session regeneration on login  
✅ HTTP-only cookies  
✅ Environment-based configuration  
✅ Secure cookie settings in production  

## Recommended Additional Security (Optional)

For high-security requirements, consider:
- Implementing bcrypt/argon2 for password hashing
- Adding rate limiting on login attempts
- Implementing 2FA for admin access
- Using OAuth/SAML for enterprise authentication
- Adding IP whitelisting for admin panel
- Implementing audit logging for admin actions

## Default Credentials Justification

Default credentials are provided for:
- Quick setup and testing
- Development environments
- Demo purposes
- Evaluation of the platform

**They are NOT suitable for:**
- Production environments
- Handling sensitive data
- Multi-tenant deployments
- Public-facing applications

## Deployment Checklist

Before deploying to production:

- [ ] Changed ADMIN_USERNAME from default
- [ ] Set strong ADMIN_PASSWORD_HASH
- [ ] Set unique SESSION_SECRET (32+ characters)
- [ ] Verified credentials work locally
- [ ] Documented credentials in secure password manager
- [ ] Removed any hardcoded credentials from code
- [ ] Enabled HTTPS (automatic with Netlify)
- [ ] Configured backup access method
- [ ] Tested admin login on production URL

## Support

For security questions or concerns, review:
- `NETLIFY_DEPLOYMENT.md` for deployment guide
- `server/auth.ts` for authentication implementation
- Netlify security documentation

---

**Last Updated:** October 31, 2025  
**Security Level:** Development/Demo (Upgrade for Production)
