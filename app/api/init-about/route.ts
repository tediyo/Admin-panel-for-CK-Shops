import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { AboutValue, AboutMilestone, AboutFAQ, AboutContent, AboutSectionSettings } from '@/lib/models';

// POST - Initialize about section with sample data
export async function POST() {
  try {
    const db = await getDatabase();
    const now = new Date();

    // Sample about values
    const sampleValues: Omit<AboutValue, '_id'>[] = [
      {
        title: 'Quality First',
        description: 'We source only the finest beans and use traditional brewing methods to ensure exceptional taste.',
        icon: 'Coffee',
        color: 'from-amber-500 to-amber-600',
        bgColor: 'from-amber-50 to-amber-100',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        is_active: true,
        sort_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        title: 'Community Focused',
        description: 'We believe in building connections and creating a welcoming space for everyone in our community.',
        icon: 'Heart',
        color: 'from-red-500 to-pink-600',
        bgColor: 'from-red-50 to-pink-100',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        is_active: true,
        sort_order: 2,
        created_at: now,
        updated_at: now
      },
      {
        title: 'Sustainability',
        description: 'We\'re committed to environmentally friendly practices and supporting fair trade coffee farmers.',
        icon: 'Leaf',
        color: 'from-green-500 to-emerald-600',
        bgColor: 'from-green-50 to-emerald-100',
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        is_active: true,
        sort_order: 3,
        created_at: now,
        updated_at: now
      },
      {
        title: 'Expert Team',
        description: 'Our skilled baristas and staff are passionate about coffee and dedicated to your satisfaction.',
        icon: 'Users',
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'from-blue-50 to-indigo-100',
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        is_active: true,
        sort_order: 4,
        created_at: now,
        updated_at: now
      }
    ];

    // Sample milestones
    const sampleMilestones: Omit<AboutMilestone, '_id'>[] = [
      {
        year: '2008',
        title: 'Founded',
        description: 'Started as a small corner shop with big dreams',
        is_active: true,
        sort_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        year: '2012',
        title: 'Expansion',
        description: 'Opened our second location downtown',
        is_active: true,
        sort_order: 2,
        created_at: now,
        updated_at: now
      },
      {
        year: '2016',
        title: 'Award Winner',
        description: 'Best Coffee Shop in the city',
        is_active: true,
        sort_order: 3,
        created_at: now,
        updated_at: now
      },
      {
        year: '2020',
        title: 'Community Hub',
        description: 'Became the heart of our neighborhood',
        is_active: true,
        sort_order: 4,
        created_at: now,
        updated_at: now
      },
      {
        year: '2024',
        title: 'Innovation',
        description: 'Leading sustainable coffee practices',
        is_active: true,
        sort_order: 5,
        created_at: now,
        updated_at: now
      }
    ];

    // Sample FAQs
    const sampleFAQs: Omit<AboutFAQ, '_id'>[] = [
      {
        question: 'Do you offer delivery services?',
        answer: 'Yes! We offer delivery within a 5-mile radius. Orders over $25 qualify for free delivery.',
        category: 'Delivery',
        icon: 'Coffee',
        helpful: 24,
        tags: ['delivery', 'shipping', 'free delivery'],
        is_active: true,
        sort_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        question: 'Can I reserve a table for a group?',
        answer: 'Absolutely! We recommend calling ahead for groups of 6 or more to ensure we can accommodate you.',
        category: 'Reservations',
        icon: 'Users',
        helpful: 18,
        tags: ['reservations', 'groups', 'events'],
        is_active: true,
        sort_order: 2,
        created_at: now,
        updated_at: now
      },
      {
        question: 'Do you have WiFi available?',
        answer: 'Yes, we provide free high-speed WiFi for all our customers. Perfect for remote work or studying.',
        category: 'Amenities',
        icon: 'MessageCircle',
        helpful: 31,
        tags: ['wifi', 'work', 'study', 'internet'],
        is_active: true,
        sort_order: 3,
        created_at: now,
        updated_at: now
      },
      {
        question: 'Are you pet-friendly?',
        answer: 'Yes! We welcome well-behaved pets in our outdoor seating area. We even have special treats for your furry friends.',
        category: 'Policies',
        icon: 'Award',
        helpful: 22,
        tags: ['pets', 'animals', 'outdoor seating'],
        is_active: true,
        sort_order: 4,
        created_at: now,
        updated_at: now
      },
      {
        question: 'Do you cater events?',
        answer: 'We do! We offer catering services for meetings, parties, and special events. Contact us for custom packages.',
        category: 'Catering',
        icon: 'Coffee',
        helpful: 15,
        tags: ['catering', 'events', 'parties', 'meetings'],
        is_active: true,
        sort_order: 5,
        created_at: now,
        updated_at: now
      }
    ];

    // Sample content
    const sampleContent: Omit<AboutContent, '_id'>[] = [
      // Hero section
      {
        section: 'hero',
        field: 'title',
        value: 'Our Story',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'hero',
        field: 'subtitle',
        value: 'From humble beginnings to becoming a beloved community gathering place, discover the passion and dedication behind Kaffee Haus.',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      // Story section
      {
        section: 'story',
        field: 'title',
        value: 'A Coffee Journey',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'story',
        field: 'description1',
        value: 'Founded in 2008 by coffee enthusiasts Maria and Carlos Rodriguez, Kaffee Haus began as a small corner shop with a big dream: to bring exceptional coffee to our community.',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'story',
        field: 'description2',
        value: 'What started as a passion project has grown into a beloved gathering place where friends meet, ideas are born, and the perfect cup of coffee is always within reach. Our commitment to quality and community has remained unchanged throughout the years.',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'story',
        field: 'description3',
        value: 'Today, we continue to source the finest beans from around the world, roast them to perfection, and serve them with love and attention to detail that our customers have come to expect.',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      // Mission section
      {
        section: 'mission',
        field: 'title',
        value: 'Our Mission',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'mission',
        field: 'description',
        value: 'To create exceptional coffee experiences that bring people together and celebrate the simple joy of a perfect cup.',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      // Values section
      {
        section: 'values',
        field: 'title',
        value: 'What Drives Us',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'values',
        field: 'subtitle',
        value: 'The principles that guide everything we do at Kaffee Haus',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      // FAQ section
      {
        section: 'faq',
        field: 'title',
        value: 'Quick Answers',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        section: 'faq',
        field: 'subtitle',
        value: 'Find answers to the most common questions about our services',
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ];

    // Sample section settings
    const sampleSectionSettings: Omit<AboutSectionSettings, '_id'>[] = [
      {
        section: 'hero',
        is_visible: true,
        sort_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        section: 'story',
        is_visible: true,
        sort_order: 2,
        created_at: now,
        updated_at: now
      },
      {
        section: 'mission',
        is_visible: true,
        sort_order: 3,
        created_at: now,
        updated_at: now
      },
      {
        section: 'values',
        is_visible: true,
        sort_order: 4,
        created_at: now,
        updated_at: now
      },
      {
        section: 'timeline',
        is_visible: true,
        sort_order: 5,
        created_at: now,
        updated_at: now
      },
      {
        section: 'faq',
        is_visible: true,
        sort_order: 6,
        created_at: now,
        updated_at: now
      }
    ];

    // Clear existing data and insert sample data
    await Promise.all([
      db.collection('about_values').deleteMany({}),
      db.collection('about_milestones').deleteMany({}),
      db.collection('about_faqs').deleteMany({}),
      db.collection('about_content').deleteMany({}),
      db.collection('about_section_settings').deleteMany({})
    ]);

    await Promise.all([
      db.collection('about_values').insertMany(sampleValues),
      db.collection('about_milestones').insertMany(sampleMilestones),
      db.collection('about_faqs').insertMany(sampleFAQs),
      db.collection('about_content').insertMany(sampleContent),
      db.collection('about_section_settings').insertMany(sampleSectionSettings)
    ]);

    return NextResponse.json({
      success: true,
      message: 'About section initialized with sample data',
      data: {
        values: sampleValues.length,
        milestones: sampleMilestones.length,
        faqs: sampleFAQs.length,
        content: sampleContent.length,
        sectionSettings: sampleSectionSettings.length
      }
    });
  } catch (error) {
    console.error('Error initializing about section:', error);
    return NextResponse.json(
      { error: 'Failed to initialize about section' },
      { status: 500 }
    );
  }
}
