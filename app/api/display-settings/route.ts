import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

// GET - Fetch all display settings
export async function GET() {
  try {
    const settings = db.prepare('SELECT * FROM display_settings ORDER BY setting_key').all();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching display settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch display settings' },
      { status: 500 }
    );
  }
}

// POST - Update display settings
export async function POST(request: NextRequest) {
  try {
    const { setting_key, setting_value, description } = await request.json();

    if (!setting_key || setting_value === undefined) {
      return NextResponse.json(
        { error: 'Setting key and value are required' },
        { status: 400 }
      );
    }

    // Insert or update display setting
    const stmt = db.prepare(`
      INSERT INTO display_settings (setting_key, setting_value, description)
      VALUES (?, ?, ?)
      ON CONFLICT(setting_key) DO UPDATE SET
        setting_value = excluded.setting_value,
        description = excluded.description,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(setting_key, setting_value, description);

    return NextResponse.json({ success: true, message: 'Display setting updated successfully' });
  } catch (error) {
    console.error('Error updating display setting:', error);
    return NextResponse.json(
      { error: 'Failed to update display setting' },
      { status: 500 }
    );
  }
}
