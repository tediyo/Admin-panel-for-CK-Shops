import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { AboutValue } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET - Fetch all about values
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<AboutValue>('about_values');
    
    const values = await collection
      .find({})
      .sort({ sort_order: 1, title: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: values });
  } catch (error) {
    console.error('Error fetching about values:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about values' },
      { status: 500 }
    );
  }
}

// POST - Create or update about value
export async function POST(request: NextRequest) {
  try {
    const valueData = await request.json();

    if (!valueData.title || !valueData.description || !valueData.icon) {
      return NextResponse.json(
        { error: 'Title, description, and icon are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<AboutValue>('about_values');

    const now = new Date();
    
    // If updating existing value
    if (valueData._id) {
      // Validate ObjectId format
      if (!ObjectId.isValid(valueData._id)) {
        return NextResponse.json(
          { error: 'Invalid value ID format' },
          { status: 400 }
        );
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(valueData._id) },
        {
          $set: {
            ...valueData,
            updated_at: now
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'About value not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: 'About value updated successfully' 
      });
    } else {
      // Create new value
      const newValue: AboutValue = {
        ...valueData,
        is_active: valueData.is_active !== false,
        sort_order: valueData.sort_order || 0,
        created_at: now,
        updated_at: now
      };

      const result = await collection.insertOne(newValue);
      
      return NextResponse.json({ 
        success: true, 
        message: 'About value created successfully',
        data: { _id: result.insertedId }
      });
    }
  } catch (error) {
    console.error('Error saving about value:', error);
    return NextResponse.json(
      { error: 'Failed to save about value' },
      { status: 500 }
    );
  }
}

// DELETE - Delete about value
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Value ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid value ID format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<AboutValue>('about_values');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'About value not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'About value deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting about value:', error);
    return NextResponse.json(
      { error: 'Failed to delete about value' },
      { status: 500 }
    );
  }
}
