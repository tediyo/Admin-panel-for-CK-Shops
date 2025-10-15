import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Branch } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET - Fetch all branches
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<Branch>('branches');
    
    const branches = await collection
      .find({})
      .sort({ sort_order: 1, name: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: branches });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}

// POST - Create or update branch
export async function POST(request: NextRequest) {
  try {
    const branchData = await request.json();

    if (!branchData.name || !branchData.address || !branchData.phone || !branchData.email) {
      return NextResponse.json(
        { error: 'Name, address, phone, and email are required' },
        { status: 400 }
      );
    }

    if (!branchData.coordinates || !branchData.coordinates.lat || !branchData.coordinates.lng) {
      return NextResponse.json(
        { error: 'Coordinates (latitude and longitude) are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<Branch>('branches');

    const now = new Date();
    
    // If updating existing branch
    if (branchData._id) {
      // Validate ObjectId format
      if (!ObjectId.isValid(branchData._id)) {
        return NextResponse.json(
          { error: 'Invalid branch ID format' },
          { status: 400 }
        );
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(branchData._id) },
        {
          $set: {
            ...branchData,
            updated_at: now
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Branch not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Branch updated successfully' 
      });
    } else {
      // Create new branch
      const newBranch: Branch = {
        ...branchData,
        amenities: branchData.amenities || [],
        is_main_branch: branchData.is_main_branch || false,
        is_active: branchData.is_active !== false,
        sort_order: branchData.sort_order || 0,
        created_at: now,
        updated_at: now
      };

      const result = await collection.insertOne(newBranch);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Branch created successfully',
        data: { _id: result.insertedId }
      });
    }
  } catch (error) {
    console.error('Error saving branch:', error);
    return NextResponse.json(
      { error: 'Failed to save branch' },
      { status: 500 }
    );
  }
}

// DELETE - Delete branch
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Branch ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid branch ID format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<Branch>('branches');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Branch deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json(
      { error: 'Failed to delete branch' },
      { status: 500 }
    );
  }
}

