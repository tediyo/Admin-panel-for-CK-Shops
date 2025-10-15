import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Order, OrderSettings } from '@/lib/models';
import { ObjectId } from 'mongodb';

// POST - Create new order from customer
export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!orderData.customerInfo || !orderData.customerInfo.name || !orderData.customerInfo.email || !orderData.customerInfo.phone) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const ordersCollection = db.collection<Order>('orders');
    const settingsCollection = db.collection<OrderSettings>('order_settings');

    // Get order settings
    const settings = await settingsCollection
      .find({ is_active: true })
      .toArray();

    const settingsMap: { [key: string]: any } = {};
    settings.forEach(setting => {
      settingsMap[setting.setting] = setting.value;
    });

    // Apply default settings if not configured
    const deliveryFee = settingsMap.delivery_fee || 2.50;
    const taxRate = settingsMap.tax_rate || 0.08;
    const prepTimePickup = settingsMap.prep_time_pickup || 20;
    const prepTimeDelivery = settingsMap.prep_time_delivery || 45;

    const now = new Date();
    
    // Generate order number
    const orderCount = await ordersCollection.countDocuments();
    const orderNumber = `#ORD-${String(orderCount + 1).padStart(3, '0')}`;

    // Calculate totals
    const subtotal = orderData.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const deliveryFeeAmount = orderData.orderType === 'delivery' ? deliveryFee : 0;
    const tax = subtotal * taxRate;
    const total = subtotal + deliveryFeeAmount + tax;

    // Calculate estimated ready time
    const prepTime = orderData.orderType === 'delivery' ? prepTimeDelivery : prepTimePickup;
    const estimatedReadyTime = new Date(now.getTime() + prepTime * 60000);

    const newOrder: Order = {
      orderNumber,
      items: orderData.items,
      subtotal,
      deliveryFee: deliveryFeeAmount,
      tax,
      total,
      status: 'pending',
      orderType: orderData.orderType,
      customerInfo: orderData.customerInfo,
      specialInstructions: orderData.specialInstructions,
      orderTime: now,
      estimatedReadyTime,
      paymentMethod: 'pending', // Will be updated when payment is processed
      paymentStatus: 'pending',
      created_at: now,
      updated_at: now
    };

    const result = await ordersCollection.insertOne(newOrder);
    
    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: result.insertedId,
        orderNumber: newOrder.orderNumber,
        estimatedReadyTime: newOrder.estimatedReadyTime,
        total: newOrder.total
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET - Get order by order number (for customer tracking)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');
    const email = searchParams.get('email');

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: 'Order number and email are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<Order>('orders');

    const order = await collection.findOne({
      orderNumber,
      'customerInfo.email': email
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
