import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { AboutValue, AboutMilestone, AboutFAQ, AboutContent } from '@/lib/models';

// GET - Fetch all active about content for public consumption
export async function GET() {
  try {
    const db = await getDatabase();
    
    // Fetch all about data in parallel
    const [values, milestones, faqs, content] = await Promise.all([
      db.collection<AboutValue>('about_values')
        .find({ is_active: true })
        .sort({ sort_order: 1, title: 1 })
        .toArray(),
      
      db.collection<AboutMilestone>('about_milestones')
        .find({ is_active: true })
        .sort({ sort_order: 1, year: 1 })
        .toArray(),
      
      db.collection<AboutFAQ>('about_faqs')
        .find({ is_active: true })
        .sort({ sort_order: 1, question: 1 })
        .toArray(),
      
      db.collection<AboutContent>('about_content')
        .find({ is_active: true })
        .sort({ section: 1, field: 1 })
        .toArray()
    ]);

    // Organize content by section and field
    const organizedContent: { [section: string]: { [field: string]: string } } = {};
    content.forEach(item => {
      if (!organizedContent[item.section]) {
        organizedContent[item.section] = {};
      }
      organizedContent[item.section][item.field] = item.value;
    });

    return NextResponse.json({
      success: true,
      data: {
        values,
        milestones,
        faqs,
        content: organizedContent
      }
    });
  } catch (error) {
    console.error('Error fetching about data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about data' },
      { status: 500 }
    );
  }
}
