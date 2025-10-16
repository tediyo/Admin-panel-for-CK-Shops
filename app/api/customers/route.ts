import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Customer } from '@/lib/models';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST - Register new customer
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password, address } = await request.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Name, email, phone, and password are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<Customer>('customers');

    // Check if customer already exists
    const existingCustomer = await collection.findOne({ email });
    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const now = new Date();
    const newCustomer: Customer = {
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      is_active: true,
      created_at: now,
      updated_at: now
    };

    const result = await collection.insertOne(newCustomer);
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        customerId: result.insertedId.toString(),
        email: newCustomer.email,
        role: 'customer'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      message: 'Customer registered successfully',
      data: {
        customerId: result.insertedId,
        token,
        customer: {
          _id: result.insertedId,
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          address: newCustomer.address
        }
      }
    });
  } catch (error) {
    console.error('Error registering customer:', error);
    return NextResponse.json(
      { error: 'Failed to register customer' },
      { status: 500 }
    );
  }
}

// GET - Get customer profile (requires authentication)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const db = await getDatabase();
    const collection = db.collection<Customer>('customers');
    
    const customer = await collection.findOne(
      { _id: new ObjectId(decoded.customerId) },
      { projection: { password: 0 } }
    );

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}

// PUT - Update customer profile
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const { name, phone, address } = await request.json();

    const db = await getDatabase();
    const collection = db.collection<Customer>('customers');

    const updateData: any = { updated_at: new Date() };
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    const result = await collection.updateOne(
      { _id: new ObjectId(decoded.customerId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Customer profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
