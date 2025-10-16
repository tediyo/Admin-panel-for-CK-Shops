import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { HomeContent } from '@/lib/models';

// POST - Initialize home content with sample data
export async function POST() {
  try {
    const db = await getDatabase();
    const now = new Date();

    // Sample home content
    const sampleContent: Omit<HomeContent, '_id'>[] = [
      {
        section: 'hero',
        field: 'title',
        value: 'Welcome to Kaffee Haus',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'hero',
        field: 'subtitle',
        value: 'Experience the perfect blend of tradition and innovation in every cup',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'hero',
        field: 'description',
        value: 'From farm-fresh beans to expertly crafted beverages, we bring you the finest coffee experience.',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'hero',
        field: 'button_text',
        value: 'Explore Our Menu',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'hero',
        field: 'button_link',
        value: '/menu',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'about',
        field: 'title',
        value: 'Our Story',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'about',
        field: 'description',
        value: 'We are passionate about bringing you the finest coffee experience with carefully selected beans and expert craftsmanship.',
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ];

    // Clear existing content and insert sample data
    await db.collection('home_content').deleteMany({});
    await db.collection('home_content').insertMany(sampleContent);

    return NextResponse.json({
      success: true,
      message: 'Home content initialized successfully',
      data: {
        content: sampleContent.length
      }
    });
  } catch (error) {
    console.error('Error initializing home content:', error);
    return NextResponse.json(
      { error: 'Failed to initialize home content' },
      { status: 500 }
    );
  }
}
