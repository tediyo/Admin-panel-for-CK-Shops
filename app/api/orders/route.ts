import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Order } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET - Fetch all orders with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const orderType = searchParams.get('orderType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');

    const db = await getDatabase();
    const collection = db.collection<Order>('orders');

    // Build filter
    const filter: any = {};
    if (status) filter.status = status;
    if (orderType) filter.orderType = orderType;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customerInfo.name': { $regex: search, $options: 'i' } },
        { 'customerInfo.email': { $regex: search, $options: 'i' } },
        { 'customerInfo.phone': { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const totalCount = await collection.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;

    // Fetch orders with pagination
    const orders = await collection
      .find(filter)
      .sort({ orderTime: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create new order
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
    const collection = db.collection<Order>('orders');

    const now = new Date();
    
    // Generate order number
    const orderCount = await collection.countDocuments();
    const orderNumber = `#ORD-${String(orderCount + 1).padStart(3, '0')}`;

    // Calculate estimated ready time
    const prepTime = orderData.orderType === 'delivery' ? 45 : 20; // minutes
    const estimatedReadyTime = new Date(now.getTime() + prepTime * 60000);

    const newOrder: Order = {
      ...orderData,
      orderNumber,
      status: 'pending',
      orderTime: now,
      estimatedReadyTime,
      created_at: now,
      updated_at: now
    };

    const result = await collection.insertOne(newOrder);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Order created successfully',
      data: { 
        _id: result.insertedId,
        orderNumber: newOrder.orderNumber
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

// PUT - Update order status or details
export async function PUT(request: NextRequest) {
  try {
    const updateData = await request.json();

    if (!updateData._id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(updateData._id)) {
      return NextResponse.json(
        { error: 'Invalid order ID format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<Order>('orders');

    const now = new Date();
    
    // If updating status, add timestamps
    if (updateData.status) {
      const statusUpdates: any = { status: updateData.status, updated_at: now };
      
      switch (updateData.status) {
        case 'confirmed':
          // No additional timestamp needed
          break;
        case 'preparing':
          statusUpdates.actualReadyTime = new Date(now.getTime() + 20 * 60000); // 20 minutes from now
          break;
        case 'ready':
          statusUpdates.actualReadyTime = now;
          break;
        case 'completed':
          statusUpdates.completedTime = now;
          break;
      }
      
      updateData.actualReadyTime = statusUpdates.actualReadyTime;
      updateData.completedTime = statusUpdates.completedTime;
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(updateData._id) },
      {
        $set: {
          ...updateData,
          updated_at: now
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Order updated successfully' 
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE - Delete order (soft delete by changing status to cancelled)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid order ID format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<Order>('orders');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'cancelled',
          updated_at: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Order cancelled successfully' 
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}

