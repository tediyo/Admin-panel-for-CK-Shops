import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { SignatureDrink } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET - Fetch all signature drinks
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<SignatureDrink>('signature_drinks');
    
    const drinks = await collection
      .find({})
      .sort({ sort_order: 1, category: 1, name: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: drinks });
  } catch (error) {
    console.error('Error fetching signature drinks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signature drinks' },
      { status: 500 }
    );
  }
}

// POST - Create or update signature drink
export async function POST(request: NextRequest) {
  try {
    const drinkData = await request.json();

    if (!drinkData.name || !drinkData.span || !drinkData.description || drinkData.price === undefined) {
      return NextResponse.json(
        { error: 'Name, span, description, and price are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<SignatureDrink>('signature_drinks');

    const now = new Date();
    
    // If updating existing drink
    if (drinkData._id) {
      // Validate ObjectId format
      if (!ObjectId.isValid(drinkData._id)) {
        return NextResponse.json(
          { error: 'Invalid drink ID format' },
          { status: 400 }
        );
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(drinkData._id) },
        {
          $set: {
            ...drinkData,
            updated_at: now
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Signature drink not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Signature drink updated successfully' 
      });
    } else {
      // Create new drink
      const newDrink: SignatureDrink = {
        ...drinkData,
        ingredients: drinkData.ingredients || [],
        is_active: drinkData.is_active !== false,
        sort_order: drinkData.sort_order || 0,
        created_at: now,
        updated_at: now
      };

      const result = await collection.insertOne(newDrink);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Signature drink created successfully',
        data: { _id: result.insertedId }
      });
    }
  } catch (error) {
    console.error('Error saving signature drink:', error);
    return NextResponse.json(
      { error: 'Failed to save signature drink' },
      { status: 500 }
    );
  }
}

// DELETE - Delete signature drink
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Drink ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid drink ID format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<SignatureDrink>('signature_drinks');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Signature drink not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Signature drink deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting signature drink:', error);
    return NextResponse.json(
      { error: 'Failed to delete signature drink' },
      { status: 500 }
    );
  }
}
