// Database setup script
// Run this after setting up your MongoDB Atlas connection

const { initializeDatabase } = require('../lib/init-db');

async function setup() {
  try {
    console.log('Setting up database...');
    await initializeDatabase();
    console.log('Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setup();
