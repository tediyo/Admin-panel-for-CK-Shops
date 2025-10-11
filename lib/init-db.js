const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Use local MongoDB as default if no URI is provided
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/coffee-shop-admin';

async function initializeDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('coffee-shop-admin');
    
    // Create admin user
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ username: 'admin' });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await usersCollection.insertOne({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    // Create display settings
    const displaySettingsCollection = db.collection('display_settings');
    const existingSettings = await displaySettingsCollection.findOne({ setting_key: 'maintenance_mode' });
    
    if (!existingSettings) {
      await displaySettingsCollection.insertMany([
        {
          setting_key: 'maintenance_mode',
          setting_value: 'false',
          description: 'Enable maintenance mode',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          setting_key: 'site_title',
          setting_value: 'Coffee Shop Admin',
          description: 'Main site title',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          setting_key: 'max_coffee_facts',
          setting_value: '10',
          description: 'Maximum number of coffee facts to display',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
      console.log('✅ Display settings created');
    } else {
      console.log('✅ Display settings already exist');
    }
    
    // Create default home content
    const homeContentCollection = db.collection('home_content');
    const existingHomeContent = await homeContentCollection.findOne({ section: 'hero' });
    
    if (!existingHomeContent) {
      const defaultHomeContent = [
        // Hero Section
        { section: 'hero', field: 'title', value: 'Welcome to Our Coffee Shop', is_active: true, created_at: new Date(), updated_at: new Date() },
        { section: 'hero', field: 'subtitle', value: 'Experience the finest coffee in town', is_active: true, created_at: new Date(), updated_at: new Date() },
        { section: 'hero', field: 'description', value: 'We source the best beans from around the world and craft them into perfect cups of coffee just for you.', is_active: true, created_at: new Date(), updated_at: new Date() },
        { section: 'hero', field: 'button_text', value: 'Order Now', is_active: true, created_at: new Date(), updated_at: new Date() },
        { section: 'hero', field: 'button_link', value: '/menu', is_active: true, created_at: new Date(), updated_at: new Date() },
        { section: 'hero', field: 'background_image', value: '/images/hero-bg.jpg', is_active: true, created_at: new Date(), updated_at: new Date() },
        
        // About Section
        { section: 'about', field: 'title', value: 'About Our Coffee', is_active: true, created_at: new Date(), updated_at: new Date() },
        { section: 'about', field: 'description', value: 'We are passionate about coffee and committed to bringing you the best coffee experience.', is_active: true, created_at: new Date(), updated_at: new Date() },
        { section: 'about', field: 'image', value: '/images/about-coffee.jpg', is_active: true, created_at: new Date(), updated_at: new Date() },
        
        // Features Section
        { section: 'features', field: 'title', value: 'Why Choose Us', is_active: true, created_at: new Date(), updated_at: new Date() },
        { section: 'features', field: 'subtitle', value: 'We provide the best coffee experience', is_active: true, created_at: new Date(), updated_at: new Date() }
      ];
      
      await homeContentCollection.insertMany(defaultHomeContent);
      console.log('✅ Default home content created');
    } else {
      console.log('✅ Home content already exists');
    }
    
    // Create default coffee facts
    const coffeeFactsCollection = db.collection('coffee_facts');
    const existingFacts = await coffeeFactsCollection.findOne({});
    
    if (!existingFacts) {
      const defaultFacts = [
        {
          fact: 'Coffee is the second most traded commodity in the world, after oil.',
          is_active: true,
          sort_order: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          fact: 'The word "coffee" comes from the Arabic word "qahwah" which means "wine of the bean".',
          is_active: true,
          sort_order: 2,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          fact: 'Coffee beans are actually seeds from the coffee cherry fruit.',
          is_active: true,
          sort_order: 3,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          fact: 'The first coffee shop opened in Constantinople (now Istanbul) in 1475.',
          is_active: true,
          sort_order: 4,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          fact: 'Coffee can help reduce the risk of type 2 diabetes and liver disease.',
          is_active: true,
          sort_order: 5,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];
      
      await coffeeFactsCollection.insertMany(defaultFacts);
      console.log('✅ Default coffee facts created');
    } else {
      console.log('✅ Coffee facts already exist');
    }
    
    // Create default coffee history
    const coffeeHistoryCollection = db.collection('coffee_history');
    const existingHistory = await coffeeHistoryCollection.findOne({});
    
    if (!existingHistory) {
      const defaultHistory = [
        {
          year: '850',
          title: 'Discovery of Coffee',
          description: 'Legend says that a goat herder named Kaldi discovered coffee when he noticed his goats became energetic after eating coffee berries.',
          is_active: true,
          sort_order: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          year: '1475',
          title: 'First Coffee Shop',
          description: 'The first coffee shop opened in Constantinople (now Istanbul), marking the beginning of coffee culture.',
          is_active: true,
          sort_order: 2,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          year: '1600s',
          title: 'Coffee Reaches Europe',
          description: 'Coffee was introduced to Europe through Venice and quickly spread across the continent.',
          is_active: true,
          sort_order: 3,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          year: '1652',
          title: 'First English Coffee House',
          description: 'The first coffee house in England opened in London, becoming a center for intellectual discussion.',
          is_active: true,
          sort_order: 4,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          year: '1723',
          title: 'Coffee in the Americas',
          description: 'Coffee was first planted in the Americas, specifically in Martinique, spreading to other Caribbean islands and South America.',
          is_active: true,
          sort_order: 5,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];
      
      await coffeeHistoryCollection.insertMany(defaultHistory);
      console.log('✅ Default coffee history created');
    } else {
      console.log('✅ Coffee history already exists');
    }
    
    // Create default highlight cards
    const highlightCardsCollection = db.collection('highlight_cards');
    const existingCards = await highlightCardsCollection.findOne({});
    
    if (!existingCards) {
      const defaultCards = [
        {
          title: 'Premium Coffee Beans',
          description: 'Sourced from the finest coffee regions around the world',
          image_url: '/images/premium-beans.jpg',
          button_text: 'Learn More',
          button_link: '/about',
          is_active: true,
          sort_order: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: 'Expert Baristas',
          description: 'Our skilled baristas craft each cup with precision and passion',
          image_url: '/images/baristas.jpg',
          button_text: 'Meet Our Team',
          button_link: '/team',
          is_active: true,
          sort_order: 2,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: 'Cozy Atmosphere',
          description: 'Relax and enjoy your coffee in our warm and welcoming space',
          image_url: '/images/atmosphere.jpg',
          button_text: 'Visit Us',
          button_link: '/location',
          is_active: true,
          sort_order: 3,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];
      
      await highlightCardsCollection.insertMany(defaultCards);
      console.log('✅ Default highlight cards created');
    } else {
      console.log('✅ Highlight cards already exist');
    }
    
    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    await client.close();
  }
}

module.exports = { initializeDatabase };

