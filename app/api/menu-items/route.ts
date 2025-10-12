import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { MenuItem } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET - Fetch all menu items
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<MenuItem>('menu_items');
    
    const items = await collection
      .find({})
      .sort({ sort_order: 1, category: 1, name: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

// POST - Create or update menu item
export async function POST(request: NextRequest) {
  try {
    const itemData = await request.json();

    if (!itemData.name || !itemData.description || itemData.price === undefined) {
      return NextResponse.json(
        { error: 'Name, description, and price are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<MenuItem>('menu_items');

    const now = new Date();
    
    // If updating existing item
    if (itemData._id) {
      // Validate ObjectId format
      if (!ObjectId.isValid(itemData._id)) {
        return NextResponse.json(
          { error: 'Invalid item ID format' },
          { status: 400 }
        );
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(itemData._id) },
        {
          $set: {
            ...itemData,
            updated_at: now
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Menu item not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Menu item updated successfully' 
      });
    } else {
      // Create new item
      const newItem: MenuItem = {
        ...itemData,
        is_active: itemData.is_active !== false,
        sort_order: itemData.sort_order || 0,
        created_at: now,
        updated_at: now
      };

      const result = await collection.insertOne(newItem);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Menu item created successfully',
        data: { _id: result.insertedId }
      });
    }
  } catch (error) {
    console.error('Error saving menu item:', error);
    return NextResponse.json(
      { error: 'Failed to save menu item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete menu item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid item ID format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<MenuItem>('menu_items');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Menu item deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}
