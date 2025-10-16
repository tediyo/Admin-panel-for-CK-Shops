import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Order, OrderSettings, OrderTracking } from '@/lib/models';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST - Create new order from customer
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let customerId;
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      customerId = decoded.customerId;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

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
      customerId,
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
    
    // Create initial tracking entry
    const trackingCollection = db.collection<OrderTracking>('order_tracking');
    const initialTracking: OrderTracking = {
      orderId: result.insertedId.toString(),
      status: 'pending',
      statusChangedAt: now,
      changedBy: 'customer',
      created_at: now,
      updated_at: now
    };
    await trackingCollection.insertOne(initialTracking);
    
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
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let customerId;
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      customerId = decoded.customerId;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

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
      'customerInfo.email': email,
      customerId: customerId // Ensure customer can only access their own orders
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

