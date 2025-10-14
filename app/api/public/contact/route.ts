import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Branch, ContactContent, ContactSectionSettings } from '@/lib/models';

// GET - Fetch all active contact data for public consumption
export async function GET() {
  try {
    const db = await getDatabase();
    
    // Fetch all contact data in parallel
    const [branches, content, sectionSettings] = await Promise.all([
      db.collection<Branch>('branches')
        .find({ is_active: true })
        .sort({ sort_order: 1, name: 1 })
        .toArray(),
      
      db.collection<ContactContent>('contact_content')
        .find({ is_active: true })
        .sort({ section: 1, field: 1 })
        .toArray(),

      db.collection<ContactSectionSettings>('contact_section_settings')
        .find({})
        .sort({ sort_order: 1, section: 1 })
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

    // Organize section settings by section name
    const sectionVisibility: { [section: string]: boolean } = {};
    sectionSettings.forEach(setting => {
      sectionVisibility[setting.section] = setting.is_visible;
    });

    return NextResponse.json({
      success: true,
      data: {
        branches,
        content: organizedContent,
        sectionVisibility
      }
    });
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact data' },
      { status: 500 }
    );
  }
}
