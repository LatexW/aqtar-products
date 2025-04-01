// Seed script to initialize database before build
const fetch = require('node-fetch');

async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    // Call the seed API endpoint
    const response = await fetch('http://localhost:3000/api/seed');
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ ${data.message}`);
    } else {
      console.error(`❌ Seeding failed: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('❌ Seeding process failed:', error.message);
    console.log('  - Make sure your Next.js dev server is running');
    console.log('  - Make sure your MySQL database is properly set up');
  }
}

// Run the seeding function
seedDatabase().catch(err => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
}); 