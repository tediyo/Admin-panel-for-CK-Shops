import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Order } from '@/lib/models';
import { ObjectId } from 'mongodb';

// PUT - Simple order update
export async function PUT(request: NextRequest) {
  try {
    console.log('🔧 Simple order update started');
    
    const updateData = await request.json();
    console.log('📝 Update data received:', updateData);
    
    if (!updateData._id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    if (!ObjectId.isValid(updateData._id)) {
      return NextResponse.json({ error: 'Invalid order ID format' }, { status: 400 });
    }
    
    const db = await getDatabase();
    const collection = db.collection<Order>('orders');
    
    const result = await collection.updateOne(
      { _id: new ObjectId(updateData._id) },
      { $set: { ...updateData, updated_at: new Date() } }
    );
    
    console.log('✅ Update result:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      result: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });
    
  } catch (error) {
    console.error('❌ Simple order update error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
