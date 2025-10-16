import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Order } from '@/lib/models';

export async function GET() {
  try {
    console.log('🔍 Debugging orders...');
    const db = await getDatabase();
    const collection = db.collection<Order>('orders');
    
    const orders = await collection.find({}).limit(5).toArray();
    
    console.log('📊 Found orders:', orders.length);
    orders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`, {
        _id: order._id,
        _idType: typeof order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        customerInfo: order.customerInfo
      });
    });
    
    return NextResponse.json({
      success: true,
      count: orders.length,
      orders: orders.map(order => ({
        _id: order._id,
        _idType: typeof order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        customerName: order.customerInfo?.name
      }))
    });
  } catch (error) {
    console.error('❌ Error debugging orders:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
