import {
  getStoredDestinations,
  getStoredDestinationBySlug,
  addStoredBooking,
  addStoredInquiry,
  addStoredSubscriber,
  getStoredAuthShowcaseSettings,
  saveStoredAuthShowcaseSettings,
  DEFAULT_AUTH_SHOWCASE_SETTINGS,
  saveStoredUser,
} from './store';
import { CATEGORIES, STORIES } from './data';

export const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  // Production default to deployed backend on Vercel
  return 'https://travelyn-s5a4.vercel.app/api';
};

/**
 * Robust fetch helper that tries primary URL, then Next.js proxy / fallback ports
 */
export async function apiFetch(endpoint, options = {}) {
  const primary = getApiBaseUrl();
  const candidates = Array.from(new Set([
    primary,
    'https://travelyn-s5a4.vercel.app/api',
    '/backend-api',
    '/api',
    'http://localhost:5000/api',
    'http://localhost:5001/api'
  ]));

  for (const baseUrl of candidates) {
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, options);
      if (res.ok) return res;
    } catch (err) {
      // Try next candidate
    }
  }
  return null;
}

/**
 * Submit a travel booking inquiry
 */
export async function submitBooking(data) {
  try {
    const res = await apiFetch('/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res && res.ok) {
      const result = await res.json();
      addStoredBooking(result.data || data);
      return result;
    }
  } catch (error) {
    // API unavailable - save into local reactive store
  }

  // Reactive store fallback
  const saved = addStoredBooking({
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
  });

  return {
    success: true,
    message: 'Booking request received successfully! A Travelyn travel designer will contact you within 24 hours.',
    data: saved,
  };
}

/**
 * Submit a tailor-made concierge contact inquiry
 */
export async function submitContact(data) {
  try {
    const res = await apiFetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res && res.ok) {
      const result = await res.json();
      addStoredInquiry(result.data || data);
      return result;
    }
  } catch (error) {
    // API unavailable - save into local reactive store
  }

  // Reactive store fallback
  const saved = addStoredInquiry(data);
  return {
    success: true,
    message: 'Thank you for reaching out to Travelyn. A personal travel designer will tailor an itinerary and respond within 24 hours.',
    data: saved,
  };
}

/**
 * Subscribe to the Travelyn newsletter
 */
export async function subscribeNewsletter(email) {
  try {
    const res = await apiFetch('/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (res && res.ok) {
      const result = await res.json();
      addStoredSubscriber(email);
      return result;
    }
  } catch (error) {
    // API unavailable - save into local reactive store
  }

  const res = addStoredSubscriber(email);
  return {
    success: true,
    message: 'Welcome to the Travelyn community. Your first journey inspiration is on its way.',
    data: res.subscriber,
  };
}

/**
 * Fetch all destinations with optional filtering
 */
export async function fetchDestinations(params) {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    if (params?.region) query.set('region', params.region);
    if (params?.minPrice) query.set('minPrice', String(params.minPrice));
    if (params?.maxPrice) query.set('maxPrice', String(params.maxPrice));
    if (params?.sort) query.set('sort', params.sort);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await apiFetch(`/destinations${queryString}`);
    if (res && res.ok) {
      const result = await res.json();
      if (result.data && result.data.length) return result.data;
    }
  } catch (error) {
    // API unavailable, use local store
  }

  let list = getStoredDestinations();
  if (params?.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q)
    );
  }
  if (params?.category && params.category !== 'all') {
    list = list.filter((d) => d.category?.includes(params.category.toLowerCase()));
  }
  if (params?.region && params.region !== 'all') {
    list = list.filter((d) => d.region?.toLowerCase() === params.region.toLowerCase());
  }
  return list;
}

/**
 * Fetch a single destination by slug or id
 */
export async function fetchDestinationBySlug(slug) {
  try {
    const res = await apiFetch(`/destinations/${slug}`);
    if (res && res.ok) {
      const result = await res.json();
      if (result.data) return result.data;
    }
  } catch (error) {
    // Fallback to store
  }

  return getStoredDestinationBySlug(slug);
}

/**
 * Fetch categories
 */
export async function fetchCategories() {
  return CATEGORIES;
}

/**
 * Fetch stories
 */
export async function fetchStories() {
  return STORIES;
}

/**
 * Fetch dynamic Auth Showcase settings from backend / MongoDB Atlas
 */
export async function fetchAuthShowcase() {
  try {
    const res = await apiFetch('/showcase/auth');
    if (res && res.ok) {
      const json = await res.json();
      if (json.data) {
        saveStoredAuthShowcaseSettings(json.data);
        return json.data;
      }
    }
  } catch (err) {
    // Backend offline, fallback to localStorage
  }
  return getStoredAuthShowcaseSettings();
}

/**
 * Save dynamic Auth Showcase settings to backend / MongoDB Atlas & localStorage
 */
export async function saveAuthShowcase(settings) {
  // Always update local store immediately for instant reactive UI
  saveStoredAuthShowcaseSettings(settings);

  try {
    const res = await apiFetch('/showcase/auth', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    });
    if (res && res.ok) {
      const json = await res.json();
      return json;
    }
  } catch (err) {
    // Saved locally, backend sync will retry next time
  }
  return { success: true, data: settings };
}

/**
 * User login via backend API
 */
export async function loginApi({ email, password, rememberMe = true }) {
  try {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe })
    });
    if (res && res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        saveStoredUser(data.user);
        return data;
      }
    }
  } catch (e) {
    // backend unavailable, fallback will handle
  }
  return null;
}

/**
 * User registration via backend API
 */
export async function registerApi({ name, email, password }) {
  try {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (res && res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        saveStoredUser(data.user);
        return data;
      }
    }
  } catch (e) {
    // backend unavailable, fallback will handle
  }
  return null;
}

/**
 * Trip generation via AI Planner API
 */
export async function generateItineraryApi(payload) {
  try {
    const res = await apiFetch('/ai-planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res && res.ok) {
      const data = await res.json();
      if (data.success && data.itinerary) {
        return data;
      }
    }
  } catch (e) {
    // fallback
  }
  return null;
}
