import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Branch, ContactContent, ContactSectionSettings } from '@/lib/models';

// POST - Initialize contact section with sample data
export async function POST() {
  try {
    const db = await getDatabase();
    const now = new Date();

    // Sample branches
    const sampleBranches: Omit<Branch, '_id'>[] = [
      {
        name: "Main Branch - Bole",
        address: "Bole Road, Addis Ababa, Ethiopia",
        phone: "+251 11 123 4567",
        email: "bole@kaffeehaus.com",
        hours: "Mon-Fri: 6AM-10PM, Sat-Sun: 7AM-11PM",
        coordinates: { lat: 8.9806, lng: 38.7578 },
        image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
        description: "Our flagship location in the heart of Bole district",
        amenities: ["WiFi", "Parking", "Outdoor Seating", "Air Conditioning"],
        is_main_branch: true,
        is_active: true,
        sort_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        name: "Downtown Branch - Piazza",
        address: "Piazza District, Addis Ababa, Ethiopia",
        phone: "+251 11 234 5678",
        email: "piazza@kaffeehaus.com",
        hours: "Mon-Fri: 6AM-9PM, Sat-Sun: 8AM-10PM",
        coordinates: { lat: 9.0333, lng: 38.7500 },
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
        description: "Historic location in the bustling Piazza district",
        amenities: ["WiFi", "Parking", "Indoor Seating"],
        is_main_branch: false,
        is_active: true,
        sort_order: 2,
        created_at: now,
        updated_at: now
      },
      {
        name: "Airport Branch - Bole Airport",
        address: "Bole International Airport, Addis Ababa, Ethiopia",
        phone: "+251 11 345 6789",
        email: "airport@kaffeehaus.com",
        hours: "24/7 Open",
        coordinates: { lat: 8.9779, lng: 38.7993 },
        image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
        description: "Convenient location for travelers at the airport",
        amenities: ["WiFi", "Quick Service", "Takeaway"],
        is_main_branch: false,
        is_active: true,
        sort_order: 3,
        created_at: now,
        updated_at: now
      },
      {
        name: "University Branch - Arat Kilo",
        address: "Arat Kilo, Addis Ababa, Ethiopia",
        phone: "+251 11 456 7890",
        email: "university@kaffeehaus.com",
        hours: "Mon-Fri: 7AM-8PM, Sat-Sun: 8AM-9PM",
        coordinates: { lat: 9.0333, lng: 38.7500 },
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
        description: "Student-friendly location near university area",
        amenities: ["WiFi", "Study Space", "Quiet Environment", "Student Discounts"],
        is_main_branch: false,
        is_active: true,
        sort_order: 4,
        created_at: now,
        updated_at: now
      }
    ];

    // Sample contact content
    const sampleContent: Omit<ContactContent, '_id'>[] = [
      // Hero section
      {
        section: 'hero',
        field: 'title',
        value: 'Contact Us',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'hero',
        field: 'subtitle',
        value: 'Find us across Addis Ababa! Visit our branches, connect with us online, or send us a message.',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      // Branches section
      {
        section: 'branches',
        field: 'title',
        value: 'Find Us Near You',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'branches',
        field: 'subtitle',
        value: 'We have multiple locations across Addis Ababa to serve you better. Each branch offers a unique atmosphere and experience.',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      // Contact form section
      {
        section: 'form',
        field: 'title',
        value: 'Contact Us & Find Us',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'form',
        field: 'subtitle',
        value: 'Send us a message or explore our locations across Addis Ababa',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'form',
        field: 'description',
        value: "We'll get back to you within 24 hours",
        is_active: true,
        created_at: now,
        updated_at: now
      },
      // Map section
      {
        section: 'map',
        field: 'title',
        value: 'Find Our Locations',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'map',
        field: 'subtitle',
        value: 'Explore our branches across Addis Ababa',
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ];

    // Sample section settings
    const sampleSectionSettings: Omit<ContactSectionSettings, '_id'>[] = [
      { section: 'hero', is_visible: true, sort_order: 1, created_at: now, updated_at: now },
      { section: 'branches', is_visible: true, sort_order: 2, created_at: now, updated_at: now },
      { section: 'form', is_visible: true, sort_order: 3, created_at: now, updated_at: now },
      { section: 'map', is_visible: true, sort_order: 4, created_at: now, updated_at: now }
    ];

    // Clear existing data and insert sample data
    await Promise.all([
      db.collection('branches').deleteMany({}),
      db.collection('contact_content').deleteMany({}),
      db.collection('contact_section_settings').deleteMany({})
    ]);

    await Promise.all([
      db.collection('branches').insertMany(sampleBranches),
      db.collection('contact_content').insertMany(sampleContent),
      db.collection('contact_section_settings').insertMany(sampleSectionSettings)
    ]);

    return NextResponse.json({
      success: true,
      message: 'Contact section initialized with sample data',
      data: {
        branches: sampleBranches.length,
        content: sampleContent.length,
        sectionSettings: sampleSectionSettings.length
      }
    });
  } catch (error) {
    console.error('Error initializing contact section:', error);
    return NextResponse.json(
      { error: 'Failed to initialize contact section' },
      { status: 500 }
    );
  }
}
