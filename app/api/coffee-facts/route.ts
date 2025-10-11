import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { CoffeeFact } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET - Fetch all coffee facts
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<CoffeeFact>('coffee_facts');
    
    const facts = await collection
      .find({})
      .sort({ sort_order: 1, _id: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: facts });
  } catch (error) {
    console.error('Error fetching coffee facts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coffee facts' },
      { status: 500 }
    );
  }
}

// POST - Create new coffee fact
export async function POST(request: NextRequest) {
  try {
    const { fact, is_active, sort_order } = await request.json();

    if (!fact) {
      return NextResponse.json(
        { error: 'Fact is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<CoffeeFact>('coffee_facts');

    const now = new Date();
    const newFact: Omit<CoffeeFact, '_id'> = {
      fact,
      is_active: is_active !== false,
      sort_order: sort_order || 0,
      created_at: now,
      updated_at: now
    };

    const result = await collection.insertOne(newFact);

    return NextResponse.json({ 
      success: true, 
      message: 'Coffee fact created successfully',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Error creating coffee fact:', error);
    return NextResponse.json(
      { error: 'Failed to create coffee fact' },
      { status: 500 }
    );
  }
}

// PUT - Update coffee fact
export async function PUT(request: NextRequest) {
  try {
    const { id, fact, is_active, sort_order } = await request.json();

    if (!id || !fact) {
      return NextResponse.json(
        { error: 'ID and fact are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<CoffeeFact>('coffee_facts');

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          fact,
          is_active: is_active !== false,
          sort_order: sort_order || 0,
          updated_at: new Date()
        }
      }
    );

    return NextResponse.json({ success: true, message: 'Coffee fact updated successfully' });
  } catch (error) {
    console.error('Error updating coffee fact:', error);
    return NextResponse.json(
      { error: 'Failed to update coffee fact' },
      { status: 500 }
    );
  }
}

// DELETE - Delete coffee fact
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
    const collection = db.collection<CoffeeFact>('coffee_facts');

    await collection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, message: 'Coffee fact deleted successfully' });
  } catch (error) {
    console.error('Error deleting coffee fact:', error);
    return NextResponse.json(
      { error: 'Failed to delete coffee fact' },
      { status: 500 }
    );
  }
}