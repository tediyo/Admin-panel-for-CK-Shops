const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/coffee-shop-admin';

async function initDatabase() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('coffee-shop-admin');
    
    // Create collections if they don't exist
    const collections = [
      'customers',
      'home_content',
      'display_settings',
      'highlight_cards',
      'coffee_history',
      'coffee_facts',
      'menu_items',
      'menu_categories',
      'signature_drinks',
      'about_values',
      'about_milestones',
      'about_faqs',
      'about_content',
      'about_section_settings',
      'branches',
      'contact_content',
      'contact_section_settings',
      'orders',
      'order_tracking',
      'order_settings'
    ];
    
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } catch (error) {
        if (error.code === 48) { // Collection already exists
          console.log(`ℹ️  Collection already exists: ${collectionName}`);
        } else {
          console.error(`❌ Error creating collection ${collectionName}:`, error.message);
        }
      }
    }
    
    // Insert some sample data for home content
    const homeContentCollection = db.collection('home_content');
    const sampleHomeContent = [
      {
        section: 'hero',
        field: 'title',
        value: 'Welcome to Our Coffee Shop',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        section: 'hero',
        field: 'subtitle',
        value: 'Experience the finest coffee in town',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    try {
      await homeContentCollection.insertMany(sampleHomeContent);
      console.log('✅ Inserted sample home content');
    } catch (error) {
      console.log('ℹ️  Sample home content already exists or error:', error.message);
    }
    
    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

initDatabase();
