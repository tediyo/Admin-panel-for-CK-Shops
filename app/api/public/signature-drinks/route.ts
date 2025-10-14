import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { SignatureDrink } from '@/lib/models';

// GET - Fetch public signature drinks data for the coffee shop frontend
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<SignatureDrink>('signature_drinks');
    
    // Fetch active signature drinks
    const drinks = await collection
      .find({ is_active: true })
      .sort({ sort_order: 1, category: 1, name: 1 })
      .toArray();

    return NextResponse.json({ 
      success: true, 
      data: drinks
    });
  } catch (error) {
    console.error('Error fetching public signature drinks data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signature drinks data' },
      { status: 500 }
    );
  }
}


