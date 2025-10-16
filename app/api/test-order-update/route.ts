import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Order } from '@/lib/models';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing order update...');
    
    const { _id, status } = await request.json();
    console.log('📝 Update data:', { _id, status });
    
    // Validate ObjectId
    if (!ObjectId.isValid(_id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ObjectId format',
        receivedId: _id
      }, { status: 400 });
    }
    
    console.log('🔌 Connecting to MongoDB...');
    const db = await getDatabase();
    console.log('✅ MongoDB connected successfully');
    
    const collection = db.collection<Order>('orders');
    console.log('📊 Using orders collection');
    
    // Check if order exists
    const existingOrder = await collection.findOne({ _id: new ObjectId(_id) });
    console.log('🔍 Existing order:', existingOrder ? 'Found' : 'Not found');
    
    if (!existingOrder) {
      return NextResponse.json({
        success: false,
        error: 'Order not found',
        orderId: _id
      }, { status: 404 });
    }
    
    console.log('💾 Updating order...');
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { status, updated_at: new Date() } }
    );
    
    console.log('✅ Update result:', { 
      matchedCount: result.matchedCount, 
      modifiedCount: result.modifiedCount 
    });
    
    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      result: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Order update test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
