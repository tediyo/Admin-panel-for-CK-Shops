import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { MenuItem, MenuCategory } from '@/lib/models';

export async function POST() {
  try {
    const db = await getDatabase();
    const menuItemsCollection = db.collection<MenuItem>('menu_items');
    const categoriesCollection = db.collection<MenuCategory>('menu_categories');

    // Clear existing data
    await menuItemsCollection.deleteMany({});
    await categoriesCollection.deleteMany({});

    const now = new Date();

    // Insert categories
    const categories: MenuCategory[] = [
      {
        name: 'coffee',
        description: 'Hot coffee drinks',
        sort_order: 1,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        name: 'cold',
        description: 'Cold coffee drinks',
        sort_order: 2,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        name: 'pastry',
        description: 'Fresh pastries and baked goods',
        sort_order: 3,
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ];

    await categoriesCollection.insertMany(categories);

    // Insert menu items
    const menuItems: MenuItem[] = [
      {
        name: 'Espresso',
        description: 'Rich, full-bodied coffee with a perfect crema',
        price: 3.50,
        category: 'coffee',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        isPopular: true,
        prepTime: 2,
        calories: 5,
        isVegan: true,
        isGlutenFree: true,
        is_active: true,
        sort_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Cappuccino',
        description: 'Espresso with steamed milk and foam art',
        price: 4.25,
        category: 'coffee',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        isPopular: true,
        prepTime: 3,
        calories: 120,
        isGlutenFree: true,
        is_active: true,
        sort_order: 2,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Latte',
        description: 'Smooth espresso with steamed milk and light foam',
        price: 4.50,
        category: 'coffee',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        prepTime: 4,
        calories: 150,
        isGlutenFree: true,
        is_active: true,
        sort_order: 3,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Mocha',
        description: 'Espresso with chocolate and steamed milk',
        price: 5.00,
        category: 'coffee',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        prepTime: 5,
        calories: 250,
        isGlutenFree: true,
        is_active: true,
        sort_order: 4,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Americano',
        description: 'Espresso with hot water for a clean taste',
        price: 3.75,
        category: 'coffee',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        prepTime: 2,
        calories: 10,
        isVegan: true,
        isGlutenFree: true,
        is_active: true,
        sort_order: 5,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Macchiato',
        description: 'Espresso with a dollop of foam',
        price: 4.00,
        category: 'coffee',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        isNew: true,
        prepTime: 3,
        calories: 80,
        isVegan: true,
        isGlutenFree: true,
        is_active: true,
        sort_order: 6,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Cold Brew',
        description: 'Smooth, cold-extracted coffee',
        price: 4.25,
        category: 'cold',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090a?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        prepTime: 1,
        calories: 5,
        isVegan: true,
        isGlutenFree: true,
        is_active: true,
        sort_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Iced Latte',
        description: 'Cold espresso with milk over ice',
        price: 4.75,
        category: 'cold',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090a?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        prepTime: 2,
        calories: 120,
        isGlutenFree: true,
        is_active: true,
        sort_order: 2,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Frappé',
        description: 'Blended coffee with ice and cream',
        price: 5.50,
        category: 'cold',
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090a?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        prepTime: 4,
        calories: 350,
        isGlutenFree: true,
        is_active: true,
        sort_order: 3,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Croissant',
        description: 'Buttery, flaky pastry',
        price: 3.25,
        category: 'pastry',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        prepTime: 1,
        calories: 280,
        is_active: true,
        sort_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Muffin',
        description: 'Fresh baked blueberry muffin',
        price: 2.75,
        category: 'pastry',
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        prepTime: 1,
        calories: 320,
        is_active: true,
        sort_order: 2,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Bagel',
        description: 'Fresh bagel with cream cheese',
        price: 3.50,
        category: 'pastry',
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        prepTime: 2,
        calories: 300,
        is_active: true,
        sort_order: 3,
        created_at: now,
        updated_at: now
      }
    ];

    await menuItemsCollection.insertMany(menuItems);

    return NextResponse.json({ 
      success: true, 
      message: 'Menu data initialized successfully',
      data: {
        categories: categories.length,
        menuItems: menuItems.length
      }
    });
  } catch (error) {
    console.error('Error initializing menu data:', error);
    return NextResponse.json(
      { error: 'Failed to initialize menu data' },
      { status: 500 }
    );
  }
}
