import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { CoffeeHistory } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET - Fetch all coffee history
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<CoffeeHistory>('coffee_history');
    
    const history = await collection
      .find({})
      .sort({ sort_order: 1, _id: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching coffee history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coffee history' },
      { status: 500 }
    );
  }
}

// POST - Create new coffee history item
export async function POST(request: NextRequest) {
  try {
    const { year, title, description, image_url, is_active, sort_order } = await request.json();

    if (!year || !title || !description) {
      return NextResponse.json(
        { error: 'Year, title, and description are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<CoffeeHistory>('coffee_history');

    const now = new Date();
    const newItem: Omit<CoffeeHistory, '_id'> = {
      year,
      title,
      description,
      image_url: image_url || '',
      is_active: is_active !== false,
      sort_order: sort_order || 0,
      created_at: now,
      updated_at: now
    };

    const result = await collection.insertOne(newItem);

    return NextResponse.json({ 
      success: true, 
      message: 'Coffee history item created successfully',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Error creating coffee history item:', error);
    return NextResponse.json(
      { error: 'Failed to create coffee history item' },
      { status: 500 }
    );
  }
}

// PUT - Update coffee history item
export async function PUT(request: NextRequest) {
  try {
    const { id, year, title, description, image_url, is_active, sort_order } = await request.json();

    if (!id || !year || !title || !description) {
      return NextResponse.json(
        { error: 'ID, year, title, and description are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<CoffeeHistory>('coffee_history');

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          year,
          title,
          description,
          image_url: image_url || '',
          is_active: is_active !== false,
          sort_order: sort_order || 0,
          updated_at: new Date()
        }
      }
    );

    return NextResponse.json({ success: true, message: 'Coffee history item updated successfully' });
  } catch (error) {
    console.error('Error updating coffee history item:', error);
    return NextResponse.json(
      { error: 'Failed to update coffee history item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete coffee history item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<CoffeeHistory>('coffee_history');

    await collection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, message: 'Coffee history item deleted successfully' });
  } catch (error) {
    console.error('Error deleting coffee history item:', error);
    return NextResponse.json(
      { error: 'Failed to delete coffee history item' },
      { status: 500 }
    );
  }
}