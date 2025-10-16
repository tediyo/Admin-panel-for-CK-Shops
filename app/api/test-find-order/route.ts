import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Order } from '@/lib/models';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing order find...');
    
    const { _id } = await request.json();
    console.log('📝 Looking for order ID:', _id);
    
    const db = await getDatabase();
    const collection = db.collection<Order>('orders');
    
    console.log('🔍 Finding order...');
    const order = await collection.findOne({ _id: new ObjectId(_id) });
    
    if (order) {
      console.log('✅ Order found:', order.orderNumber);
      return NextResponse.json({
        success: true,
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          customerName: order.customerInfo?.name
        }
      });
    } else {
      console.log('❌ Order not found');
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error('❌ Find order test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
