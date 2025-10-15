import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { SignatureDrink } from '@/lib/models';

export async function POST() {
  try {
    const db = await getDatabase();
    const collection = db.collection<SignatureDrink>('signature_drinks');

    // Clear existing data
    await collection.deleteMany({});

    const now = new Date();

    // Insert signature drinks
    const signatureDrinks: SignatureDrink[] = [
      {
        name: 'Ethiopian',
        span: 'Yirgacheffe',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
        ingredients: ['Single Origin Beans', 'Light Roast', 'Floral Notes', 'Citrus Finish'],
        price: 4.50,
        rating: 4.9,
        prepTime: 3,
        description: 'Premium single origin coffee with bright acidity and floral aromas',
        category: 'coffee',
        is_active: true,
        sort_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Colombian',
        span: 'Supremo',
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
        ingredients: ['Colombian Beans', 'Medium Roast', 'Chocolate Notes', 'Nutty Finish'],
        price: 4.25,
        rating: 4.8,
        prepTime: 4,
        description: 'Rich and full-bodied with chocolate undertones',
        category: 'coffee',
        is_active: true,
        sort_order: 2,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Italian',
        span: 'Espresso',
        image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
        ingredients: ['Dark Roast Blend', 'Robusta & Arabica', 'Bold Flavor', 'Perfect Crema'],
        price: 3.75,
        rating: 4.7,
        prepTime: 2,
        description: 'Classic Italian espresso with rich crema and bold flavor',
        category: 'coffee',
        is_active: true,
        sort_order: 3,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Cappuccino',
        span: 'Art',
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
        ingredients: ['Espresso', 'Steamed Milk', 'Foam Art', 'Cocoa Powder'],
        price: 4.75,
        rating: 4.9,
        prepTime: 4,
        description: 'Perfectly balanced espresso with steamed milk and beautiful foam art',
        category: 'coffee',
        is_active: true,
        sort_order: 4,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Iced',
        span: 'Latte',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090a?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
        ingredients: ['Cold Espresso', 'Iced Milk', 'Vanilla Syrup', 'Ice Cubes'],
        price: 4.50,
        rating: 4.6,
        prepTime: 3,
        description: 'Refreshing cold latte perfect for warm days',
        category: 'cold',
        is_active: true,
        sort_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Cold Brew',
        span: 'Perfection',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090a?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
        ingredients: ['Cold Brewed Coffee', 'Filtered Water', '12 Hour Steep', 'Smooth Finish'],
        price: 4.25,
        rating: 4.8,
        prepTime: 1,
        description: 'Smooth and refreshing cold brew with natural sweetness',
        category: 'cold',
        is_active: true,
        sort_order: 2,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Croissant',
        span: 'Delight',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=600&fit=crop&crop=center&auto=format&q=80',
        ingredients: ['Buttery Pastry', 'Fresh Baked', 'Flaky Layers', 'Golden Brown'],
        price: 3.25,
        rating: 4.5,
        prepTime: 1,
        description: 'Fresh baked croissant with perfect flaky layers',
        category: 'pastry',
        is_active: true,
        sort_order: 1,
        created_at: now,
        updated_at: now
      }
    ];

    await collection.insertMany(signatureDrinks);

    return NextResponse.json({ 
      success: true, 
      message: 'Signature drinks data initialized successfully',
      data: {
        signatureDrinks: signatureDrinks.length
      }
    });
  } catch (error) {
    console.error('Error initializing signature drinks data:', error);
    return NextResponse.json(
      { error: 'Failed to initialize signature drinks data' },
      { status: 500 }
    );
  }
}



