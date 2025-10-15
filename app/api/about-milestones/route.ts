import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { AboutMilestone } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET - Fetch all about milestones
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<AboutMilestone>('about_milestones');
    
    const milestones = await collection
      .find({})
      .sort({ sort_order: 1, year: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: milestones });
  } catch (error) {
    console.error('Error fetching about milestones:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about milestones' },
      { status: 500 }
    );
  }
}

// POST - Create or update about milestone
export async function POST(request: NextRequest) {
  try {
    const milestoneData = await request.json();

    if (!milestoneData.year || !milestoneData.title || !milestoneData.description) {
      return NextResponse.json(
        { error: 'Year, title, and description are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<AboutMilestone>('about_milestones');

    const now = new Date();
    
    // If updating existing milestone
    if (milestoneData._id) {
      // Validate ObjectId format
      if (!ObjectId.isValid(milestoneData._id)) {
        return NextResponse.json(
          { error: 'Invalid milestone ID format' },
          { status: 400 }
        );
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(milestoneData._id) },
        {
          $set: {
            ...milestoneData,
            updated_at: now
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'About milestone not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: 'About milestone updated successfully' 
      });
    } else {
      // Create new milestone
      const newMilestone: AboutMilestone = {
        ...milestoneData,
        is_active: milestoneData.is_active !== false,
        sort_order: milestoneData.sort_order || 0,
        created_at: now,
        updated_at: now
      };

      const result = await collection.insertOne(newMilestone);
      
      return NextResponse.json({ 
        success: true, 
        message: 'About milestone created successfully',
        data: { _id: result.insertedId }
      });
    }
  } catch (error) {
    console.error('Error saving about milestone:', error);
    return NextResponse.json(
      { error: 'Failed to save about milestone' },
      { status: 500 }
    );
  }
}

// DELETE - Delete about milestone
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Milestone ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid milestone ID format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<AboutMilestone>('about_milestones');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'About milestone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'About milestone deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting about milestone:', error);
    return NextResponse.json(
      { error: 'Failed to delete about milestone' },
      { status: 500 }
    );
  }
}

