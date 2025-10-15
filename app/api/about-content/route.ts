import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { AboutContent } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET - Fetch all about content
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<AboutContent>('about_content');
    
    const content = await collection
      .find({})
      .sort({ section: 1, field: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    );
  }
}

// POST - Create or update about content
export async function POST(request: NextRequest) {
  try {
    const contentData = await request.json();

    if (!contentData.section || !contentData.field || contentData.value === undefined) {
      return NextResponse.json(
        { error: 'Section, field, and value are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<AboutContent>('about_content');

    const now = new Date();
    
    // If updating existing content
    if (contentData._id) {
      // Validate ObjectId format
      if (!ObjectId.isValid(contentData._id)) {
        return NextResponse.json(
          { error: 'Invalid content ID format' },
          { status: 400 }
        );
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(contentData._id) },
        {
          $set: {
            ...contentData,
            updated_at: now
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'About content not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: 'About content updated successfully' 
      });
    } else {
      // Create new content
      const newContent: AboutContent = {
        ...contentData,
        is_active: contentData.is_active !== false,
        created_at: now,
        updated_at: now
      };

      const result = await collection.insertOne(newContent);
      
      return NextResponse.json({ 
        success: true, 
        message: 'About content created successfully',
        data: { _id: result.insertedId }
      });
    }
  } catch (error) {
    console.error('Error saving about content:', error);
    return NextResponse.json(
      { error: 'Failed to save about content' },
      { status: 500 }
    );
  }
}

// DELETE - Delete about content
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid content ID format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<AboutContent>('about_content');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'About content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'About content deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting about content:', error);
    return NextResponse.json(
      { error: 'Failed to delete about content' },
      { status: 500 }
    );
  }
}

