import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { HomeContent } from '@/lib/models';

// GET - Fetch all home content
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<HomeContent>('home_content');
    
    const content = await collection
      .find({})
      .sort({ section: 1, field: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Error fetching home content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home content' },
      { status: 500 }
    );
  }
}

// POST - Update home content
export async function POST(request: NextRequest) {
  try {
    const { section, field, value, is_active } = await request.json();

    if (!section || !field || value === undefined) {
      return NextResponse.json(
        { error: 'Section, field, and value are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<HomeContent>('home_content');

    const now = new Date();
    
    // Upsert home content
    await collection.updateOne(
      { section, field },
      {
        $set: {
          section,
          field,
          value,
          is_active: is_active !== false,
          updated_at: now
        },
        $setOnInsert: {
          created_at: now
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Home content updated successfully' });
  } catch (error) {
    console.error('Error updating home content:', error);
    return NextResponse.json(
      { error: 'Failed to update home content' },
      { status: 500 }
    );
  }
}
