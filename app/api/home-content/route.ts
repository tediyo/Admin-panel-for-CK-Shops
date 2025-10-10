import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

// GET - Fetch all home content
export async function GET() {
  try {
    const content = db.prepare('SELECT * FROM home_content ORDER BY section, field').all();
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Error fetching home content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home content' },
      { status: 500 }
    );
  }
}

// POST - Update home content
export async function POST(request: NextRequest) {
  try {
    const { section, field, value, is_active } = await request.json();

    if (!section || !field || value === undefined) {
      return NextResponse.json(
        { error: 'Section, field, and value are required' },
        { status: 400 }
      );
    }

    // Insert or update home content
    const stmt = db.prepare(`
      INSERT INTO home_content (section, field, value, is_active)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(section, field) DO UPDATE SET
        value = excluded.value,
        is_active = excluded.is_active,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(section, field, value, is_active !== false);

    return NextResponse.json({ success: true, message: 'Home content updated successfully' });
  } catch (error) {
    console.error('Error updating home content:', error);
    return NextResponse.json(
      { error: 'Failed to update home content' },
      { status: 500 }
    );
  }
}
