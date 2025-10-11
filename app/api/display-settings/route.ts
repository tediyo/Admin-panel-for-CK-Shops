import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { DisplaySetting } from '@/lib/models';

// GET - Fetch all display settings
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<DisplaySetting>('display_settings');
    
    const settings = await collection
      .find({})
      .sort({ setting_key: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching display settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch display settings' },
      { status: 500 }
    );
  }
}

// POST - Update display setting
export async function POST(request: NextRequest) {
  try {
    const { setting_key, setting_value, description } = await request.json();

    if (!setting_key || setting_value === undefined) {
      return NextResponse.json(
        { error: 'Setting key and value are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<DisplaySetting>('display_settings');

    const now = new Date();
    
    // Upsert display setting
    await collection.updateOne(
      { setting_key },
      {
        $set: {
          setting_key,
          setting_value,
          description: description || '',
          updated_at: now
        },
        $setOnInsert: {
          created_at: now
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Display setting updated successfully' });
  } catch (error) {
    console.error('Error updating display setting:', error);
    return NextResponse.json(
      { error: 'Failed to update display setting' },
      { status: 500 }
    );
  }
}