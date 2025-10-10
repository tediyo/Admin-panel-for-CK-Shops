import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

// GET - Fetch all highlight cards
export async function GET() {
  try {
    const cards = db.prepare('SELECT * FROM highlight_cards ORDER BY sort_order, created_at').all();
    return NextResponse.json({ success: true, data: cards });
  } catch (error) {
    console.error('Error fetching highlight cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch highlight cards' },
      { status: 500 }
    );
  }
}

// POST - Create new highlight card
export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      image_url,
      price,
      badge,
      is_popular,
      is_seasonal,
      is_active,
      sort_order
    } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO highlight_cards (
        title, description, image_url, price, badge, is_popular, 
        is_seasonal, is_active, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title,
      description,
      image_url || null,
      price || null,
      badge || null,
      is_popular || false,
      is_seasonal || false,
      is_active !== false,
      sort_order || 0
    );

    return NextResponse.json({
      success: true,
      message: 'Highlight card created successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error creating highlight card:', error);
    return NextResponse.json(
      { error: 'Failed to create highlight card' },
      { status: 500 }
    );
  }
}

// PUT - Update highlight card
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      title,
      description,
      image_url,
      price,
      badge,
      is_popular,
      is_seasonal,
      is_active,
      sort_order
    } = await request.json();

    if (!id || !title || !description) {
      return NextResponse.json(
        { error: 'ID, title and description are required' },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      UPDATE highlight_cards SET
        title = ?, description = ?, image_url = ?, price = ?, badge = ?,
        is_popular = ?, is_seasonal = ?, is_active = ?, sort_order = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      title,
      description,
      image_url || null,
      price || null,
      badge || null,
      is_popular || false,
      is_seasonal || false,
      is_active !== false,
      sort_order || 0,
      id
    );

    return NextResponse.json({ success: true, message: 'Highlight card updated successfully' });
  } catch (error) {
    console.error('Error updating highlight card:', error);
    return NextResponse.json(
      { error: 'Failed to update highlight card' },
      { status: 500 }
    );
  }
}

// DELETE - Delete highlight card
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

    const stmt = db.prepare('DELETE FROM highlight_cards WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ success: true, message: 'Highlight card deleted successfully' });
  } catch (error) {
    console.error('Error deleting highlight card:', error);
    return NextResponse.json(
      { error: 'Failed to delete highlight card' },
      { status: 500 }
    );
  }
}
