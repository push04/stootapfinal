/**
 * Environment Variable Validation Script
 * Run this before deploying to ensure all required env vars are set
 * Usage: node scripts/check-env.js
 */

const requiredEnvVars = {
    // Client-side (build-time)
    client: [
        'VITE_PUBLIC_SUPABASE_URL',
        'VITE_PUBLIC_SUPABASE_ANON_KEY',
        'VITE_PUBLIC_SITE_URL',
    ],
    // Server-side (runtime)
    server: [
        'SUPABASE_URL',
        'SUPABASE_SERVICE_ROLE_KEY',
        'SESSION_SECRET',
    ],
};

const optionalEnvVars = [
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'OPENROUTER_API_KEY',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD',
];

function checkEnvVars() {
    console.log('🔍 Checking environment variables...\n');

    let hasErrors = false;
    const warnings = [];

    // Check client-side vars
    console.log('📱 Client-side variables (VITE_* prefix):');
    requiredEnvVars.client.forEach(varName => {
        const value = process.env[varName];
        if (!value) {
            console.log(`  ❌ ${varName} - MISSING`);
            hasErrors = true;
        } else {
            // Hide sensitive data
            const displayValue = value.substring(0, 20) + '...';
            console.log(`  ✅ ${varName} - Set (${displayValue})`);
        }
    });

    console.log('\n🖥️  Server-side variables:');
    requiredEnvVars.server.forEach(varName => {
        const value = process.env[varName];
        if (!value) {
            console.log(`  ❌ ${varName} - MISSING`);
            hasErrors = true;
        } else {
            const displayValue = value.substring(0, 20) + '...';
            console.log(`  ✅ ${varName} - Set (${displayValue})`);
        }
    });

    // Check optional vars
    console.log('\n🔧 Optional variables:');
    optionalEnvVars.forEach(varName => {
        const value = process.env[varName];
        if (!value) {
            console.log(`  ⚪ ${varName} - Not set`);
            warnings.push(varName);
        } else {
            const displayValue = value.substring(0, 20) + '...';
            console.log(`  ✅ ${varName} - Set (${displayValue})`);
        }
    });

    // Additional validations
    console.log('\n🔬 Validation checks:');

    const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
        console.log('  ⚠️  VITE_PUBLIC_SUPABASE_URL should start with https://');
        hasErrors = true;
    } else if (supabaseUrl) {
        console.log('  ✅ VITE_PUBLIC_SUPABASE_URL format is valid');
    }

    const siteUrl = process.env.VITE_PUBLIC_SITE_URL;
    if (siteUrl && !siteUrl.startsWith('https://')) {
        console.log('  ⚠️  VITE_PUBLIC_SITE_URL should start with https:// for production');
    } else if (siteUrl) {
        console.log('  ✅ VITE_PUBLIC_SITE_URL format is valid');
    }

    const sessionSecret = process.env.SESSION_SECRET;
    if (sessionSecret && sessionSecret.length < 32) {
        console.log('  ⚠️  SESSION_SECRET should be at least 32 characters');
        hasErrors = true;
    } else if (sessionSecret) {
        console.log('  ✅ SESSION_SECRET length is adequate');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    if (hasErrors) {
        console.log('❌ VALIDATION FAILED - Missing or invalid required variables');
        console.log('\n📋 Next steps:');
        console.log('1. Check .env.netlify.example for required variables');
        console.log('2. Set missing variables in Netlify dashboard');
        console.log('3. Re-run this script to verify');
        process.exit(1);
    } else {
        console.log('✅ VALIDATION PASSED - All required variables are set');
        if (warnings.length > 0) {
            console.log(`\n⚠️  ${warnings.length} optional variables not set:`);
            warnings.forEach(w => console.log(`   - ${w}`));
            console.log('These are optional but may limit functionality');
        }
        console.log('\n🚀 You can proceed with deployment');
        process.exit(0);
    }
}

// Run validation
try {
    checkEnvVars();
} catch (error) {
    console.error('❌ Error during validation:', error);
    process.exit(1);
}
