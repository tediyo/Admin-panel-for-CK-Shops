import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { OrderSettings } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET - Fetch all order settings
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<OrderSettings>('order_settings');
    
    const settings = await collection
      .find({ is_active: true })
      .sort({ setting: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching order settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order settings' },
      { status: 500 }
    );
  }
}

// POST - Create or update order settings
export async function POST(request: NextRequest) {
  try {
    const settingsData = await request.json();

    if (!settingsData.setting || settingsData.value === undefined) {
      return NextResponse.json(
        { error: 'Setting and value are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<OrderSettings>('order_settings');

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
          { error: 'Order setting not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Order setting updated successfully' 
      });
    } else {
      // Create new setting
      const newSetting: OrderSettings = {
        ...settingsData,
        is_active: settingsData.is_active !== false,
        created_at: now,
        updated_at: now
      };

      const result = await collection.insertOne(newSetting);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Order setting created successfully',
        data: { _id: result.insertedId }
      });
    }
  } catch (error) {
    console.error('Error saving order setting:', error);
    return NextResponse.json(
      { error: 'Failed to save order setting' },
      { status: 500 }
    );
  }
}

// PUT - Bulk update order settings
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
    const collection = db.collection<OrderSettings>('order_settings');

    const now = new Date();
    const bulkOps = settings.map(setting => ({
      updateOne: {
        filter: { setting: setting.setting },
        update: {
          $set: {
            value: setting.value,
            description: setting.description || setting.setting,
            is_active: setting.is_active !== false,
            updated_at: now
          }
        },
        upsert: true
      }
    }));

    await collection.bulkWrite(bulkOps);

    return NextResponse.json({ 
      success: true, 
      message: 'Order settings updated successfully' 
    });
  } catch (error) {
    console.error('Error updating order settings:', error);
    return NextResponse.json(
      { error: 'Failed to update order settings' },
      { status: 500 }
    );
  }
}

// DELETE - Delete order setting
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
    const collection = db.collection<OrderSettings>('order_settings');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Order setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Order setting deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting order setting:', error);
    return NextResponse.json(
      { error: 'Failed to delete order setting' },
      { status: 500 }
    );
  }
}

