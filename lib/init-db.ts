import { getDatabase } from './mongodb';
import bcrypt from 'bcryptjs';

// Initialize database with default data
export async function initializeDatabase() {
  try {
    const db = await getDatabase();
    
    // Create collections if they don't exist
    await db.createCollection('users');
    await db.createCollection('home_content');
    await db.createCollection('coffee_facts');
    await db.createCollection('coffee_history');
    await db.createCollection('highlight_cards');
    await db.createCollection('display_settings');

    // Create indexes
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('home_content').createIndex({ section: 1, field: 1 }, { unique: true });
    await db.collection('coffee_facts').createIndex({ sort_order: 1 });
    await db.collection('coffee_history').createIndex({ sort_order: 1 });
    await db.collection('highlight_cards').createIndex({ sort_order: 1 });
    await db.collection('display_settings').createIndex({ setting_key: 1 }, { unique: true });

    // Check if admin user exists
    const adminUser = await db.collection('users').findOne({ username: 'admin' });
    
    if (!adminUser) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.collection('users').insertOne({
        username: 'admin',
        email: 'admin@coffeeshop.com',
        password: hashedPassword,
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      });
      console.log('Default admin user created');
    }

    // Initialize display settings
    const displaySettings = [
      { setting_key: 'show_clocks', setting_value: 'true', description: 'Display world clocks' },
      { setting_key: 'show_highlights', setting_value: 'true', description: 'Show highlight cards' },
      { setting_key: 'show_history', setting_value: 'true', description: 'Display coffee history' },
      { setting_key: 'show_facts', setting_value: 'true', description: 'Show coffee facts' },
      { setting_key: 'show_hero_animation', setting_value: 'true', description: 'Enable hero animations' }
    ];

    for (const setting of displaySettings) {
      await db.collection('display_settings').updateOne(
        { setting_key: setting.setting_key },
        {
          $set: {
            ...setting,
            updated_at: new Date()
          },
          $setOnInsert: {
            created_at: new Date()
          }
        },
        { upsert: true }
      );
    }

    // Initialize home content
    const homeContent = [
      { section: 'hero', field: 'welcome_text', value: 'Served with Love' },
      { section: 'hero', field: 'main_heading', value: 'Experience the perfect blend of tradition and innovation' },
      { section: 'hero', field: 'rating', value: '4.9/5' },
      { section: 'hero', field: 'rating_subtitle', value: 'Loved by many' },
      { section: 'hero', field: 'primary_button_text', value: 'Order Now' },
      { section: 'hero', field: 'secondary_button_text', value: 'View Menu' }
    ];

    for (const content of homeContent) {
      await db.collection('home_content').updateOne(
        { section: content.section, field: content.field },
        {
          $set: {
            ...content,
            is_active: true,
            updated_at: new Date()
          },
          $setOnInsert: {
            created_at: new Date()
          }
        },
        { upsert: true }
      );
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
