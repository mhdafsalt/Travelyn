import { INITIAL_DESTINATIONS, CATEGORIES, STORIES } from './data';

const DESTINATIONS_KEY = 'travelyn_destinations';
const BOOKINGS_KEY = 'travelyn_bookings';
const INQUIRIES_KEY = 'travelyn_inquiries';
const SUBSCRIBERS_KEY = 'travelyn_subscribers';

// Initial Mock Bookings
const INITIAL_BOOKINGS = [
  {
    id: 'bk-1731600100',
    destinationId: 'dest-1',
    destinationTitle: 'Santorini Caldera Retreat',
    travelerName: 'Eleanor Vance',
    travelerEmail: 'eleanor.vance@luxury.travel',
    phone: '+1 (555) 234-5678',
    startDate: '2026-06-15',
    guests: 2,
    roomType: 'Caldera Sunset Cave Suite',
    specialRequests: 'Champagne on arrival & sunset catamaran booking',
    totalEstimatedPrice: 5900,
    status: 'confirmed',
    createdAt: '2026-11-12T14:32:00.000Z'
  },
  {
    id: 'bk-1731600200',
    destinationId: 'dest-2',
    destinationTitle: 'Kyoto Ancient Gardens & Ryokan',
    travelerName: 'Julian Sterling',
    travelerEmail: 'sterling@vanguard.co',
    phone: '+44 20 7946 0912',
    startDate: '2026-04-10',
    guests: 2,
    roomType: 'Imperial Garden Pavilion',
    specialRequests: 'Private tea master ceremony in Gion',
    totalEstimatedPrice: 4800,
    status: 'pending',
    createdAt: '2026-11-13T09:15:00.000Z'
  },
  {
    id: 'bk-1731600300',
    destinationId: 'dest-3',
    destinationTitle: 'Maldives Overwater Haven',
    travelerName: 'Clara Delacroix',
    travelerEmail: 'clara.delacroix@artemis.fr',
    phone: '+33 1 42 68 55 00',
    startDate: '2026-08-20',
    guests: 2,
    roomType: 'Sunset Pool Villa Overwater',
    specialRequests: 'Private sandbank dinner on Day 3',
    totalEstimatedPrice: 7200,
    status: 'confirmed',
    createdAt: '2026-11-14T11:45:00.000Z'
  },
  {
    id: 'bk-1731600400',
    destinationId: 'dest-4',
    destinationTitle: 'Swiss Alps Zermatt Chalet',
    travelerName: 'Marcus Lindqvist',
    travelerEmail: 'marcus.lindqvist@nordic.se',
    phone: '+46 8 123 4567',
    startDate: '2026-12-05',
    guests: 4,
    roomType: 'Private Alpine Penthouse Suite',
    specialRequests: 'Glacier Express first-class panoramic car tickets',
    totalEstimatedPrice: 8400,
    status: 'pending',
    createdAt: '2026-11-14T16:20:00.000Z'
  }
];

// Initial Mock Inquiries
const INITIAL_INQUIRIES = [
  {
    id: 'inq-1731600101',
    fullName: 'Sophia Montgomery',
    email: 'sophia.montgomery@alumni.harvard.edu',
    phone: '+1 (555) 987-6543',
    destinationPreference: 'Lake Como & Amalfi Coast',
    travelDates: 'September 2026',
    budgetRange: '$10,000 – $25,000',
    guestCount: 2,
    message: 'We are planning our 10th anniversary journey. We want private vintage Riva boat charters on Como and a cliffside villa in Positano.',
    status: 'new',
    createdAt: '2026-11-13T18:10:00.000Z'
  },
  {
    id: 'inq-1731600202',
    fullName: 'Henri de La Tour',
    email: 'h.delatour@banque-privee.ch',
    phone: '+41 22 555 0199',
    destinationPreference: 'Kyoto & Naoshima Art Island',
    travelDates: 'October 2026',
    budgetRange: '$25,000+',
    guestCount: 3,
    message: 'Looking for access to private historic machiya residences and private architectural docents for modern art museums.',
    status: 'contacted',
    createdAt: '2026-11-14T08:30:00.000Z'
  }
];

// Initial Mock Subscribers
const INITIAL_SUBSCRIBERS = [
  { id: 'sub-1', email: 'julian.vance@voyager.com', subscribedAt: '2026-10-15T12:00:00.000Z', status: 'active' },
  { id: 'sub-2', email: 'elena.rostova@artisan.ch', subscribedAt: '2026-11-01T09:30:00.000Z', status: 'active' },
  { id: 'sub-3', email: 'adrian.cross@designstudio.nyc', subscribedAt: '2026-11-10T15:20:00.000Z', status: 'active' },
  { id: 'sub-4', email: 'claire.dubois@maison.paris', subscribedAt: '2026-11-14T07:10:00.000Z', status: 'active' }
];

// Helper to safely get from localStorage or fallback
function getLocalItem(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      window.localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(stored);
  } catch (e) {
    return fallback;
  }
}

// Helper to safely save to localStorage
function setLocalItem(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

/* ==========================================================================
   DESTINATIONS API
   ========================================================================== */

export function getStoredDestinations() {
  return getLocalItem(DESTINATIONS_KEY, INITIAL_DESTINATIONS);
}

export function getStoredDestinationBySlug(slug) {
  const all = getStoredDestinations();
  return all.find(
    (d) => d.slug.toLowerCase() === slug.toLowerCase() || d.id === slug
  ) || null;
}

export function saveDestination(destination) {
  const all = getStoredDestinations();
  const index = all.findIndex((d) => d.id === destination.id || d.slug === destination.slug);

  let updated;
  if (index >= 0) {
    // Update existing
    updated = [...all];
    updated[index] = { ...all[index], ...destination };
  } else {
    // Insert new
    const newDest = {
      ...destination,
      id: destination.id || `dest-${Date.now()}`,
      rating: destination.rating || 4.9,
      reviewCount: destination.reviewCount || 1,
      currency: destination.currency || 'USD',
      gallery: destination.gallery && destination.gallery.length ? destination.gallery : [destination.imageUrl],
      highlights: destination.highlights || ['Private luxury concierge', 'Handpicked 5-star accommodations'],
      itinerary: destination.itinerary || [
        { day: 1, title: 'Arrival & Welcome', description: 'Private chauffeur transfer to your luxury suite.' }
      ],
      included: destination.included || ['Private luxury chauffeur', '24/7 dedicated Travelyn lead']
    };
    updated = [newDest, ...all];
  }

  setLocalItem(DESTINATIONS_KEY, updated);
  return updated;
}

export function deleteStoredDestination(id) {
  const all = getStoredDestinations();
  const updated = all.filter((d) => d.id !== id && d.slug !== id);
  setLocalItem(DESTINATIONS_KEY, updated);
  return updated;
}

/* ==========================================================================
   BOOKINGS API
   ========================================================================== */

export function getStoredBookings() {
  return getLocalItem(BOOKINGS_KEY, INITIAL_BOOKINGS);
}

export function addStoredBooking(bookingData) {
  const all = getStoredBookings();
  const newBooking = {
    id: `bk-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
    ...bookingData
  };
  const updated = [newBooking, ...all];
  setLocalItem(BOOKINGS_KEY, updated);
  return newBooking;
}

export function updateStoredBookingStatus(id, newStatus) {
  const all = getStoredBookings();
  const updated = all.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
  setLocalItem(BOOKINGS_KEY, updated);
  return updated;
}

export function deleteStoredBooking(id) {
  const all = getStoredBookings();
  const updated = all.filter((b) => b.id !== id);
  setLocalItem(BOOKINGS_KEY, updated);
  return updated;
}

/* ==========================================================================
   INQUIRIES API
   ========================================================================== */

export function getStoredInquiries() {
  return getLocalItem(INQUIRIES_KEY, INITIAL_INQUIRIES);
}

export function addStoredInquiry(inquiryData) {
  const all = getStoredInquiries();
  const newInquiry = {
    id: `inq-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'new',
    ...inquiryData
  };
  const updated = [newInquiry, ...all];
  setLocalItem(INQUIRIES_KEY, updated);
  return newInquiry;
}

export function updateStoredInquiryStatus(id, newStatus) {
  const all = getStoredInquiries();
  const updated = all.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq));
  setLocalItem(INQUIRIES_KEY, updated);
  return updated;
}

export function deleteStoredInquiry(id) {
  const all = getStoredInquiries();
  const updated = all.filter((inq) => inq.id !== id);
  setLocalItem(INQUIRIES_KEY, updated);
  return updated;
}

/* ==========================================================================
   SUBSCRIBERS API
   ========================================================================== */

export function getStoredSubscribers() {
  return getLocalItem(SUBSCRIBERS_KEY, INITIAL_SUBSCRIBERS);
}

export function addStoredSubscriber(email) {
  const all = getStoredSubscribers();
  const normalized = email.trim().toLowerCase();
  const exists = all.find((s) => s.email.toLowerCase() === normalized);
  if (exists) return { success: true, message: 'Already subscribed' };

  const newSub = {
    id: `sub-${Date.now()}`,
    email: normalized,
    subscribedAt: new Date().toISOString(),
    status: 'active'
  };
  const updated = [newSub, ...all];
  setLocalItem(SUBSCRIBERS_KEY, updated);
  return { success: true, subscriber: newSub };
}
