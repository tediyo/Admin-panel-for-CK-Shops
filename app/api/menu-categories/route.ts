import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { MenuCategory } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET - Fetch all menu categories
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<MenuCategory>('menu_categories');
    
    const categories = await collection
      .find({})
      .sort({ sort_order: 1, name: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu categories' },
      { status: 500 }
    );
  }
}

// POST - Create or update menu category
export async function POST(request: NextRequest) {
  try {
    const categoryData = await request.json();

    if (!categoryData.name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<MenuCategory>('menu_categories');

    const now = new Date();
    
    // If updating existing category
    if (categoryData._id) {
      // Validate ObjectId format
      if (!ObjectId.isValid(categoryData._id)) {
        return NextResponse.json(
          { error: 'Invalid category ID format' },
          { status: 400 }
        );
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(categoryData._id) },
        {
          $set: {
            ...categoryData,
            updated_at: now
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Menu category not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Menu category updated successfully' 
      });
    } else {
      // Create new category
      const newCategory: MenuCategory = {
        ...categoryData,
        is_active: categoryData.is_active !== false,
        sort_order: categoryData.sort_order || 0,
        created_at: now,
        updated_at: now
      };

      const result = await collection.insertOne(newCategory);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Menu category created successfully',
        data: { _id: result.insertedId }
      });
    }
  } catch (error) {
    console.error('Error saving menu category:', error);
    return NextResponse.json(
      { error: 'Failed to save menu category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete menu category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid category ID format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<MenuCategory>('menu_categories');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Menu category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Menu category deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting menu category:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu category' },
      { status: 500 }
    );
  }
}
