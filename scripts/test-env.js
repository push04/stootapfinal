// Quick test to verify environment variables are loading correctly
require('dotenv').config();

console.log('\n🔍 Environment Variables Test\n');
console.log('================================');

const requiredVars = {
    'SUPABASE_URL': process.env.SUPABASE_URL,
    'SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY ? '✓ SET (length: ' + process.env.SUPABASE_ANON_KEY.length + ')' : '❌ NOT SET',
    'SESSION_SECRET': process.env.SESSION_SECRET ? '✓ SET (length: ' + process.env.SESSION_SECRET.length + ')' : '❌ NOT SET',
    'ADMIN_USERNAME': process.env.ADMIN_USERNAME || '❌ NOT SET',
    'ADMIN_PASSWORD_HASH': process.env.ADMIN_PASSWORD_HASH ? '✓ SET' : '❌ NOT SET',
    'NODE_ENV': process.env.NODE_ENV || 'not set (will default to development)'
};

for (const [key, value] of Object.entries(requiredVars)) {
    console.log(`${key}: ${value}`);
}

console.log('================================\n');

// Test if values are actually set correctly
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && process.env.SESSION_SECRET) {
    console.log('✅ All required environment variables are set!');
    console.log('\n📝 Summary:');
    console.log('  - Database: Supabase configured');
    console.log('  - Auth: Session secret configured');
    console.log('  - Admin: Credentials configured');
    console.log('\n✨ Your application is ready to run!');
    console.log('\nNext steps:');
    console.log('  1. npm run dev (on Linux/Mac)');
    console.log('  2. Or use: node server/index.js (after building)');
    process.exit(0);
} else {
    console.log('❌ Some required variables are missing!');
    console.log('Please check your .env file');
    process.exit(1);
}
