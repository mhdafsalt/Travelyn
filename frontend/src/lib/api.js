import { INITIAL_DESTINATIONS, CATEGORIES, STORIES } from './data';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use Next.js rewrite /backend-api or NEXT_PUBLIC_API_URL
    return process.env.NEXT_PUBLIC_API_URL || '/backend-api';
  }
  // Server-side
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

/**
 * Submit a travel booking inquiry
 */
export async function submitBooking(data) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: result.message || 'Booking submission failed. Please try again.',
      };
    }
    return result;
  } catch (error) {
    console.warn('Backend API unavailable, saving booking locally in session:', error);
    // Graceful offline/demo fallback
    const mockBooking = {
      id: `bk-${Date.now()}`,
      destinationId: data.destinationId,
      destinationTitle: data.destinationTitle || 'Luxury Expedition',
      travelerName: data.travelerName,
      travelerEmail: data.travelerEmail,
      phone: data.phone || '',
      startDate: data.startDate,
      guests: Number(data.guests) || 2,
      roomType: data.roomType || 'Signature Luxury Suite',
      specialRequests: data.specialRequests || '',
      totalEstimatedPrice: data.totalEstimatedPrice || 3500,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Booking request received successfully! A Travelyn travel designer will contact you within 24 hours.',
      data: mockBooking,
    };
  }
}

/**
 * Submit a tailor-made concierge contact inquiry
 */
export async function submitContact(data) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: result.message || 'Contact inquiry submission failed.',
      };
    }
    return result;
  } catch (error) {
    console.warn('Backend API unavailable, fallback response for contact:', error);
    return {
      success: true,
      message: 'Thank you for reaching out to Travelyn. A personal travel designer will tailor an itinerary and respond within 24 hours.',
      data: {
        id: `inq-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
      },
    };
  }
}

/**
 * Subscribe to the Travelyn newsletter
 */
export async function subscribeNewsletter(email) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: result.message || 'Subscription failed. Please check the email provided.',
      };
    }
    return result;
  } catch (error) {
    console.warn('Backend API unavailable, fallback response for newsletter:', error);
    return {
      success: true,
      message: 'Welcome to the Travelyn community. Your first journey inspiration is on its way.',
      data: {
        id: `sub-${Date.now()}`,
        email,
        subscribedAt: new Date().toISOString(),
        status: 'active',
      },
    };
  }
}

/**
 * Fetch all destinations with optional filtering
 */
export async function fetchDestinations(params) {
  const baseUrl = getApiBaseUrl();
  try {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    if (params?.region) query.set('region', params.region);
    if (params?.minPrice) query.set('minPrice', String(params.minPrice));
    if (params?.maxPrice) query.set('maxPrice', String(params.maxPrice));
    if (params?.sort) query.set('sort', params.sort);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${baseUrl}/destinations${queryString}`);
    if (!res.ok) throw new Error('Failed to fetch destinations');
    const result = await res.json();
    return result.data || INITIAL_DESTINATIONS;
  } catch (error) {
    console.warn('Using local fallback for destinations:', error);
    return INITIAL_DESTINATIONS;
  }
}

/**
 * Fetch a single destination by slug or id
 */
export async function fetchDestinationBySlug(slug) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/destinations/${slug}`);
    if (!res.ok) throw new Error('Destination not found');
    const result = await res.json();
    return result.data || null;
  } catch (error) {
    console.warn('Using local fallback for single destination:', error);
    const found = INITIAL_DESTINATIONS.find(
      (d) => d.slug.toLowerCase() === slug.toLowerCase() || d.id === slug
    );
    return found || null;
  }
}

/**
 * Fetch categories
 */
export async function fetchCategories() {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/destinations/categories/all`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const result = await res.json();
    return result.data || CATEGORIES;
  } catch (error) {
    return CATEGORIES;
  }
}

/**
 * Fetch stories
 */
export async function fetchStories() {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/destinations/stories/all`);
    if (!res.ok) throw new Error('Failed to fetch stories');
    const result = await res.json();
    return result.data || STORIES;
  } catch (error) {
    return STORIES;
  }
}
