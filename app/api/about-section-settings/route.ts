import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { AboutSectionSettings } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET - Fetch all section settings
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<AboutSectionSettings>('about_section_settings');
    
    const settings = await collection
      .find({})
      .sort({ sort_order: 1, section: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching section settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section settings' },
      { status: 500 }
    );
  }
}

// POST - Create or update section settings
export async function POST(request: NextRequest) {
  try {
    const settingsData = await request.json();

    if (!settingsData.section || settingsData.is_visible === undefined) {
      return NextResponse.json(
        { error: 'Section and visibility status are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<AboutSectionSettings>('about_section_settings');

    const now = new Date();
    
    // If updating existing settings
    if (settingsData._id) {
      // Validate ObjectId format
      if (!ObjectId.isValid(settingsData._id)) {
        return NextResponse.json(
          { error: 'Invalid settings ID format' },
          { status: 400 }
        );
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(settingsData._id) },
        {
          $set: {
            ...settingsData,
            updated_at: now
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Section settings not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Section settings updated successfully' 
      });
    } else {
      // Create new settings
      const newSettings: AboutSectionSettings = {
        ...settingsData,
        sort_order: settingsData.sort_order || 0,
        created_at: now,
        updated_at: now
      };

      const result = await collection.insertOne(newSettings);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Section settings created successfully',
        data: { _id: result.insertedId }
      });
    }
  } catch (error) {
    console.error('Error saving section settings:', error);
    return NextResponse.json(
      { error: 'Failed to save section settings' },
      { status: 500 }
    );
  }
}

// PUT - Bulk update section settings
export async function PUT(request: NextRequest) {
  try {
    const { settings } = await request.json();

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { error: 'Settings must be an array' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<AboutSectionSettings>('about_section_settings');

    const now = new Date();
    const bulkOps = settings.map(setting => ({
      updateOne: {
        filter: { section: setting.section },
        update: {
          $set: {
            is_visible: setting.is_visible,
            sort_order: setting.sort_order || 0,
            updated_at: now
          }
        },
        upsert: true
      }
    }));

    await collection.bulkWrite(bulkOps);

    return NextResponse.json({ 
      success: true, 
      message: 'Section settings updated successfully' 
    });
  } catch (error) {
    console.error('Error updating section settings:', error);
    return NextResponse.json(
      { error: 'Failed to update section settings' },
      { status: 500 }
    );
  }
}

