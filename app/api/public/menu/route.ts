import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { MenuItem, MenuCategory } from '@/lib/models';

// GET - Fetch public menu data for the coffee shop frontend
export async function GET() {
  try {
    const db = await getDatabase();
    const menuItemsCollection = db.collection<MenuItem>('menu_items');
    const categoriesCollection = db.collection<MenuCategory>('menu_categories');
    
    // Fetch active categories and menu items
    const [categories, menuItems] = await Promise.all([
      categoriesCollection
        .find({ is_active: true })
        .sort({ sort_order: 1, name: 1 })
        .toArray(),
      menuItemsCollection
        .find({ is_active: true })
        .sort({ sort_order: 1, category: 1, name: 1 })
        .toArray()
    ]);

    // Group menu items by category
    const menuByCategory = categories.map(category => ({
      ...category,
      items: menuItems.filter(item => item.category === category.name)
    }));

    return NextResponse.json({ 
      success: true, 
      data: {
        categories: menuByCategory,
        allItems: menuItems
      }
    });
  } catch (error) {
    console.error('Error fetching public menu data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu data' },
      { status: 500 }
    );
  }
}
