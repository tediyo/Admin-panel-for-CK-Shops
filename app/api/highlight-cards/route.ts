import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { HighlightCard } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET - Fetch all highlight cards
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<HighlightCard>('highlight_cards');
    
    const cards = await collection
      .find({})
      .sort({ sort_order: 1, _id: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: cards });
  } catch (error) {
    console.error('Error fetching highlight cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch highlight cards' },
      { status: 500 }
    );
  }
}

// POST - Create new highlight card
export async function POST(request: NextRequest) {
  try {
    const { 
      title, 
      description, 
      image_url, 
      price, 
      badge, 
      is_popular, 
      is_seasonal, 
      is_active, 
      sort_order 
    } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<HighlightCard>('highlight_cards');

    const now = new Date();
    const newCard: Omit<HighlightCard, '_id'> = {
      title,
      description,
      image_url: image_url || '',
      price: price || '',
      badge: badge || '',
      is_popular: is_popular || false,
      is_seasonal: is_seasonal || false,
      is_active: is_active !== false,
      sort_order: sort_order || 0,
      created_at: now,
      updated_at: now
    };

    const result = await collection.insertOne(newCard);

    return NextResponse.json({ 
      success: true, 
      message: 'Highlight card created successfully',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Error creating highlight card:', error);
    return NextResponse.json(
      { error: 'Failed to create highlight card' },
      { status: 500 }
    );
  }
}

// PUT - Update highlight card
export async function PUT(request: NextRequest) {
  try {
    const { 
      id,
      title, 
      description, 
      image_url, 
      price, 
      badge, 
      is_popular, 
      is_seasonal, 
      is_active, 
      sort_order 
    } = await request.json();

    if (!id || !title || !description) {
      return NextResponse.json(
        { error: 'ID, title, and description are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<HighlightCard>('highlight_cards');

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description,
          image_url: image_url || '',
          price: price || '',
          badge: badge || '',
          is_popular: is_popular || false,
          is_seasonal: is_seasonal || false,
          is_active: is_active !== false,
          sort_order: sort_order || 0,
          updated_at: new Date()
        }
      }
    );

    return NextResponse.json({ success: true, message: 'Highlight card updated successfully' });
  } catch (error) {
    console.error('Error updating highlight card:', error);
    return NextResponse.json(
      { error: 'Failed to update highlight card' },
      { status: 500 }
    );
  }
}

// DELETE - Delete highlight card
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
    const collection = db.collection<HighlightCard>('highlight_cards');

    await collection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, message: 'Highlight card deleted successfully' });
  } catch (error) {
    console.error('Error deleting highlight card:', error);
    return NextResponse.json(
      { error: 'Failed to delete highlight card' },
      { status: 500 }
    );
  }
}