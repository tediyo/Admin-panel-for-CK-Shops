import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('🧪 Testing MongoDB connection...');
    const db = await getDatabase();
    console.log('✅ MongoDB connected successfully');
    
    // Test a simple operation
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      collections: collections.map(c => c.name),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
