import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

// GET - Fetch all coffee history items
export async function GET() {
  try {
    const history = db.prepare('SELECT * FROM coffee_history ORDER BY sort_order, year').all();
    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching coffee history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coffee history' },
      { status: 500 }
    );
  }
}

// POST - Create new coffee history item
export async function POST(request: NextRequest) {
  try {
    const {
      year,
      title,
      description,
      image_url,
      is_active,
      sort_order
    } = await request.json();

    if (!year || !title || !description) {
      return NextResponse.json(
        { error: 'Year, title and description are required' },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO coffee_history (
        year, title, description, image_url, is_active, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      year,
      title,
      description,
      image_url || null,
      is_active !== false,
      sort_order || 0
    );

    return NextResponse.json({
      success: true,
      message: 'Coffee history item created successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error creating coffee history item:', error);
    return NextResponse.json(
      { error: 'Failed to create coffee history item' },
      { status: 500 }
    );
  }
}

// PUT - Update coffee history item
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      year,
      title,
      description,
      image_url,
      is_active,
      sort_order
    } = await request.json();

    if (!id || !year || !title || !description) {
      return NextResponse.json(
        { error: 'ID, year, title and description are required' },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      UPDATE coffee_history SET
        year = ?, title = ?, description = ?, image_url = ?,
        is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      year,
      title,
      description,
      image_url || null,
      is_active !== false,
      sort_order || 0,
      id
    );

    return NextResponse.json({ success: true, message: 'Coffee history item updated successfully' });
  } catch (error) {
    console.error('Error updating coffee history item:', error);
    return NextResponse.json(
      { error: 'Failed to update coffee history item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete coffee history item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const stmt = db.prepare('DELETE FROM coffee_history WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ success: true, message: 'Coffee history item deleted successfully' });
  } catch (error) {
    console.error('Error deleting coffee history item:', error);
    return NextResponse.json(
      { error: 'Failed to delete coffee history item' },
      { status: 500 }
    );
  }
}
