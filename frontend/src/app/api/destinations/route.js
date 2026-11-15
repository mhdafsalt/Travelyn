import { NextResponse } from 'next/server';
import { INITIAL_DESTINATIONS } from '@/lib/data';

// In-memory global cache for serverless runtime
let serverDestinations = [...INITIAL_DESTINATIONS];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase();
  const category = searchParams.get('category')?.toLowerCase();
  const region = searchParams.get('region')?.toLowerCase();

  let list = [...serverDestinations];

  if (search) {
    list = list.filter(
      (d) =>
        d.title.toLowerCase().includes(search) ||
        d.country.toLowerCase().includes(search) ||
        d.region.toLowerCase().includes(search)
    );
  }

  if (category && category !== 'all') {
    list = list.filter((d) => d.category?.some((c) => c.toLowerCase() === category));
  }

  if (region && region !== 'all') {
    list = list.filter((d) => d.region?.toLowerCase() === region);
  }

  return NextResponse.json({
    success: true,
    total: list.length,
    data: list,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title || !body.country) {
      return NextResponse.json(
        { success: false, message: 'Title and Country are required.' },
        { status: 400 }
      );
    }

    const newDest = {
      id: body.id || `dest-${Date.now()}`,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: body.title,
      country: body.country,
      region: body.region || 'Europe',
      tagline: body.tagline || 'Extraordinary journeys designed slowly.',
      description: body.description || '',
      price: Number(body.price) || 145000,
      currency: body.currency || 'INR',
      durationDays: Number(body.durationDays) || 7,
      rating: Number(body.rating) || 4.9,
      reviewCount: Number(body.reviewCount) || 12,
      season: body.season || 'Year-round',
      groupSize: body.groupSize || '2 – 8 guests',
      category: Array.isArray(body.category) ? body.category : ['luxury', 'nature'],
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      gallery: body.gallery || [body.imageUrl],
      highlights: body.highlights || ['Private luxury chauffeur', '24/7 dedicated Travelyn concierge lead'],
      itinerary: body.itinerary || [
        { day: 1, title: 'Arrival & Welcome Toast', description: 'Private transfer to your boutique lodge or suite.' }
      ],
      included: body.included || ['Private luxury transfers', '24/7 dedicated Travelyn concierge'],
      featured: Boolean(body.featured),
    };

    serverDestinations.unshift(newDest);

    return NextResponse.json({
      success: true,
      message: 'Destination created successfully',
      data: newDest,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create destination', error: error.message },
      { status: 500 }
    );
  }
}

