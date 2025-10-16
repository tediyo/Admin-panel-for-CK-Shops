import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { AboutFAQ } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET - Fetch all about FAQs
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<AboutFAQ>('about_faqs');
    
    const faqs = await collection
      .find({})
      .sort({ sort_order: 1, question: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: faqs });
  } catch (error) {
    console.error('Error fetching about FAQs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about FAQs' },
      { status: 500 }
    );
  }
}

// POST - Create or update about FAQ
export async function POST(request: NextRequest) {
  try {
    const faqData = await request.json();

    if (!faqData.question || !faqData.answer || !faqData.category) {
      return NextResponse.json(
        { error: 'Question, answer, and category are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<AboutFAQ>('about_faqs');

    const now = new Date();
    
    // If updating existing FAQ
    if (faqData._id) {
      // Validate ObjectId format
      if (!ObjectId.isValid(faqData._id)) {
        return NextResponse.json(
          { error: 'Invalid FAQ ID format' },
          { status: 400 }
        );
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(faqData._id) },
        {
          $set: {
            ...faqData,
            updated_at: now
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'About FAQ not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: 'About FAQ updated successfully' 
      });
    } else {
      // Create new FAQ
      const newFAQ: AboutFAQ = {
        ...faqData,
        helpful: faqData.helpful || 0,
        tags: faqData.tags || [],
        is_active: faqData.is_active !== false,
        sort_order: faqData.sort_order || 0,
        created_at: now,
        updated_at: now
      };

      const result = await collection.insertOne(newFAQ);
      
      return NextResponse.json({ 
        success: true, 
        message: 'About FAQ created successfully',
        data: { _id: result.insertedId }
      });
    }
  } catch (error) {
    console.error('Error saving about FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to save about FAQ' },
      { status: 500 }
    );
  }
}

// DELETE - Delete about FAQ
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'FAQ ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid FAQ ID format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<AboutFAQ>('about_faqs');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'About FAQ not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'About FAQ deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting about FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to delete about FAQ' },
      { status: 500 }
    );
  }
}


