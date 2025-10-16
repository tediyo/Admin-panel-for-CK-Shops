import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { OrderTracking, Order } from '@/lib/models';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET - Get order tracking by order ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const orderNumber = searchParams.get('orderNumber');
    const email = searchParams.get('email');

    if (!orderId && !(orderNumber && email)) {
      return NextResponse.json(
        { error: 'Order ID or (Order Number + Email) is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const ordersCollection = db.collection<Order>('orders');
    const trackingCollection = db.collection<OrderTracking>('order_tracking');

    let order;
    
    if (orderId) {
      // Find by order ID
      order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
    } else {
      // Find by order number and email
      order = await ordersCollection.findOne({ 
        orderNumber, 
        'customerInfo.email': email 
      });
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get tracking history
    const tracking = await trackingCollection
      .find({ orderId: order._id?.toString() })
      .sort({ statusChangedAt: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          orderType: order.orderType,
          total: order.total,
          orderTime: order.orderTime,
          estimatedReadyTime: order.estimatedReadyTime,
          customerInfo: order.customerInfo,
          items: order.items
        },
        tracking
      }
    });
  } catch (error) {
    console.error('Error fetching order tracking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order tracking' },
      { status: 500 }
    );
  }
}

// POST - Update order status (admin or customer)
export async function POST(request: NextRequest) {
  try {
    const { orderId, status, notes, changedBy } = await request.json();

    if (!orderId || !status || !changedBy) {
      return NextResponse.json(
        { error: 'Order ID, status, and changedBy are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const ordersCollection = db.collection<Order>('orders');
    const trackingCollection = db.collection<OrderTracking>('order_tracking');

    // Verify order exists
    const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const now = new Date();

    // Create tracking entry
    const trackingEntry: OrderTracking = {
      orderId: orderId,
      status,
      statusChangedAt: now,
      changedBy,
      created_at: now,
      updated_at: now
    };

    if (notes) {
      if (changedBy === 'admin') {
        trackingEntry.adminNotes = notes;
      } else {
        trackingEntry.customerNotes = notes;
      }
    }

    // Insert tracking entry
    await trackingCollection.insertOne(trackingEntry);

    // Update order status
    const updateData: any = {
      status,
      updated_at: now
    };

    // Set specific timestamps based on status
    if (status === 'preparing') {
      updateData.actualReadyTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
    } else if (status === 'delivered') {
      updateData.completedTime = now;
    }

    await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: updateData }
    );

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        orderId,
        status,
        statusChangedAt: now
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
