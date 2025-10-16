import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const testId = '68ef427310a76049a36335c9';
    
    console.log('🧪 Testing ObjectId validation...');
    console.log('📝 Test ID:', testId);
    console.log('📝 ID length:', testId.length);
    console.log('📝 Is valid ObjectId:', ObjectId.isValid(testId));
    
    if (ObjectId.isValid(testId)) {
      const objectId = new ObjectId(testId);
      console.log('✅ Successfully created ObjectId:', objectId.toString());
      
      return NextResponse.json({
        success: true,
        testId,
        isValid: true,
        objectId: objectId.toString(),
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        testId,
        isValid: false,
        error: 'Invalid ObjectId format',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('❌ ObjectId test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
