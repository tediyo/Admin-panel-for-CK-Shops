import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ContactSectionSettings } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET - Fetch all contact section settings
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<ContactSectionSettings>('contact_section_settings');
    
    const settings = await collection
      .find({})
      .sort({ sort_order: 1, section: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching contact section settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact section settings' },
      { status: 500 }
    );
  }
}

// POST - Create or update contact section settings
export async function POST(request: NextRequest) {
  try {
    const settingsData = await request.json();

    if (!settingsData.section || settingsData.is_visible === undefined) {
      return NextResponse.json(
        { error: 'Section and is_visible are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<ContactSectionSettings>('contact_section_settings');

    const now = new Date();
    
    // If updating existing setting
    if (settingsData._id) {
      // Validate ObjectId format
      if (!ObjectId.isValid(settingsData._id)) {
        return NextResponse.json(
          { error: 'Invalid setting ID format' },
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
          { error: 'Contact section setting not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Contact section setting updated successfully' 
      });
    } else {
      // Create new setting
      const newSetting: ContactSectionSettings = {
        ...settingsData,
        sort_order: settingsData.sort_order || 0,
        created_at: now,
        updated_at: now
      };

      const result = await collection.insertOne(newSetting);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Contact section setting created successfully',
        data: { _id: result.insertedId }
      });
    }
  } catch (error) {
    console.error('Error saving contact section setting:', error);
    return NextResponse.json(
      { error: 'Failed to save contact section setting' },
      { status: 500 }
    );
  }
}

// PUT - Bulk update contact section settings
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
    const collection = db.collection<ContactSectionSettings>('contact_section_settings');

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
      message: 'Contact section settings updated successfully' 
    });
  } catch (error) {
    console.error('Error updating contact section settings:', error);
    return NextResponse.json(
      { error: 'Failed to update contact section settings' },
      { status: 500 }
    );
  }
}

// DELETE - Delete contact section setting
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Setting ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid setting ID format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<ContactSectionSettings>('contact_section_settings');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Contact section setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Contact section setting deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting contact section setting:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact section setting' },
      { status: 500 }
    );
  }
}


