#!/usr/bin/env node

/**
 * Interactive script to help set up the database password
 * Run: node setup-db-password.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ENV_FILE = path.join(__dirname, '.env');

console.log('\n🔧 Stootap Database Password Setup\n');
console.log('This script will help you configure your database password.\n');

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  try {
    // Read current .env file
    if (!fs.existsSync(ENV_FILE)) {
      console.error('❌ Error: .env file not found!');
      process.exit(1);
    }

    let envContent = fs.readFileSync(ENV_FILE, 'utf-8');

    console.log('📍 To find your database password:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/mwtzmkqgflwovdopmwgo');
    console.log('   2. Click: Settings → Database');
    console.log('   3. Look for "Connection string"');
    console.log('   4. Copy the password from the connection string\n');

    const password = await question('Enter your Supabase database password: ');

    if (!password || password.trim() === '') {
      console.log('\n❌ Password cannot be empty!');
      process.exit(1);
    }

    // Replace the placeholder with actual password
    if (envContent.includes('SUPABASE_DB_PASSWORD=YOUR_DATABASE_PASSWORD_HERE')) {
      envContent = envContent.replace(
        'SUPABASE_DB_PASSWORD=YOUR_DATABASE_PASSWORD_HERE',
        `SUPABASE_DB_PASSWORD=${password.trim()}`
      );
      
      fs.writeFileSync(ENV_FILE, envContent, 'utf-8');
      
      console.log('\n✅ Database password configured successfully!');
      console.log('\n📋 Next steps:');
      console.log('   1. Run: npm run dev');
      console.log('   2. Test: http://localhost:5000/api/categories');
      console.log('   3. Optionally seed data: npm run db:seed\n');
    } else if (envContent.includes('SUPABASE_DB_PASSWORD=') && !envContent.includes('YOUR_DATABASE_PASSWORD_HERE')) {
      console.log('\n⚠️  Database password is already set in .env file!');
      const overwrite = await question('Do you want to overwrite it? (yes/no): ');
      
      if (overwrite.toLowerCase() === 'yes' || overwrite.toLowerCase() === 'y') {
        envContent = envContent.replace(
          /SUPABASE_DB_PASSWORD=.*/,
          `SUPABASE_DB_PASSWORD=${password.trim()}`
        );
        
        fs.writeFileSync(ENV_FILE, envContent, 'utf-8');
        console.log('\n✅ Database password updated successfully!');
      } else {
        console.log('\n❌ Password not updated.');
      }
    } else {
      // Add the password if the line doesn't exist
      envContent += `\n\nSUPABASE_DB_PASSWORD=${password.trim()}\n`;
      fs.writeFileSync(ENV_FILE, envContent, 'utf-8');
      console.log('\n✅ Database password added successfully!');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setup();
