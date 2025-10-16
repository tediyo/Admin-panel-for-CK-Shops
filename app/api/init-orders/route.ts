import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { OrderSettings } from '@/lib/models';

// POST - Initialize order system with default settings
export async function POST() {
  try {
    const db = await getDatabase();
    const now = new Date();

    // Default order settings
    const sampleSettings: Omit<OrderSettings, '_id'>[] = [
      {
        setting: 'delivery_fee',
        value: 2.50,
        description: 'Delivery fee for orders',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        setting: 'tax_rate',
        value: 0.08,
        description: 'Tax rate (8%)',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        setting: 'prep_time_pickup',
        value: 20,
        description: 'Preparation time for pickup orders (minutes)',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        setting: 'prep_time_delivery',
        value: 45,
        description: 'Preparation time for delivery orders (minutes)',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        setting: 'min_order_amount',
        value: 5.00,
        description: 'Minimum order amount',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        setting: 'max_delivery_distance',
        value: 10,
        description: 'Maximum delivery distance (miles)',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        setting: 'order_timeout',
        value: 30,
        description: 'Order timeout for payment (minutes)',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        setting: 'auto_confirm_orders',
        value: true,
        description: 'Automatically confirm new orders',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        setting: 'send_order_notifications',
        value: true,
        description: 'Send email notifications for orders',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        setting: 'order_reminder_time',
        value: 15,
        description: 'Send reminder when order is ready (minutes before)',
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ];

    // Clear existing settings and insert new ones
    await db.collection('order_settings').deleteMany({});
    await db.collection('order_settings').insertMany(sampleSettings);

    return NextResponse.json({
      success: true,
      message: 'Order system initialized with default settings',
      data: {
        settings: sampleSettings.length
      }
    });
  } catch (error) {
    console.error('Error initializing order system:', error);
    return NextResponse.json(
      { error: 'Failed to initialize order system' },
      { status: 500 }
    );
  }
}

