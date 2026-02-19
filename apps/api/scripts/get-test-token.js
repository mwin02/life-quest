/**
 * Script to generate a test authentication token
 * Run with: node scripts/get-test-token.js [email] [password]
 */

const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log('✅ Loaded environment variables from .env.local\n')
} else {
  console.warn('⚠️  .env.local file not found. Looking for environment variables...\n')
}

async function getTestToken() {
  // Load environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables')
    console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
    console.log('\nYour .env.local should look like:')
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Prompt for credentials
  console.log('🔐 Supabase Authentication Token Generator\n')
  
  // You can hardcode test credentials here or use command line arguments
  const email = process.argv[2] || 'test@example.com'
  const password = process.argv[3] || 'testpassword123'

  console.log(`Attempting to sign in with: ${email}`)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('❌ Authentication failed:', error.message)
    console.log('\n💡 Make sure the user exists in your Supabase project')
    console.log('💡 You can create a user in the Supabase Dashboard: Authentication > Users')
    process.exit(1)
  }

  if (!data.session) {
    console.error('❌ No session returned')
    process.exit(1)
  }

  console.log('\n✅ Authentication successful!\n')
  console.log('📋 User Information:')
  console.log(`   ID: ${data.user.id}`)
  console.log(`   Email: ${data.user.email}`)
  console.log(`   Created: ${data.user.created_at}\n`)

  console.log('🎫 Access Token (copy this for testing):')
  console.log('─'.repeat(80))
  console.log(data.session.access_token)
  console.log('─'.repeat(80))

  console.log('\n📝 Example cURL command:')
  console.log(`
curl http://localhost:3000/api/user \\
  -H "Authorization: Bearer ${data.session.access_token}"
  `)

  console.log('\n⏰ Token expires at:', new Date(data.session.expires_at * 1000).toLocaleString())
  console.log(`   (${Math.round((data.session.expires_at * 1000 - Date.now()) / 1000 / 60)} minutes from now)`)
}

// Run the function
getTestToken().catch(console.error)