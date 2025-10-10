import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

// GET - Fetch all coffee facts
export async function GET() {
  try {
    const facts = db.prepare('SELECT * FROM coffee_facts ORDER BY sort_order, created_at').all();
    return NextResponse.json({ success: true, data: facts });
  } catch (error) {
    console.error('Error fetching coffee facts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coffee facts' },
      { status: 500 }
    );
  }
}

// POST - Create new coffee fact
export async function POST(request: NextRequest) {
  try {
    const {
      fact,
      is_active,
      sort_order
    } = await request.json();

    if (!fact) {
      return NextResponse.json(
        { error: 'Fact is required' },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO coffee_facts (fact, is_active, sort_order)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(
      fact,
      is_active !== false,
      sort_order || 0
    );

    return NextResponse.json({
      success: true,
      message: 'Coffee fact created successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error creating coffee fact:', error);
    return NextResponse.json(
      { error: 'Failed to create coffee fact' },
      { status: 500 }
    );
  }
}

// PUT - Update coffee fact
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      fact,
      is_active,
      sort_order
    } = await request.json();

    if (!id || !fact) {
      return NextResponse.json(
        { error: 'ID and fact are required' },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      UPDATE coffee_facts SET
        fact = ?, is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      fact,
      is_active !== false,
      sort_order || 0,
      id
    );

    return NextResponse.json({ success: true, message: 'Coffee fact updated successfully' });
  } catch (error) {
    console.error('Error updating coffee fact:', error);
    return NextResponse.json(
      { error: 'Failed to update coffee fact' },
      { status: 500 }
    );
  }
}

// DELETE - Delete coffee fact
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

    const stmt = db.prepare('DELETE FROM coffee_facts WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ success: true, message: 'Coffee fact deleted successfully' });
  } catch (error) {
    console.error('Error deleting coffee fact:', error);
    return NextResponse.json(
      { error: 'Failed to delete coffee fact' },
      { status: 500 }
    );
  }
}
