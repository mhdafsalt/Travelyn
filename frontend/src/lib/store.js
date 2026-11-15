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
    totalEstimatedPrice: 570000,
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
    totalEstimatedPrice: 250000,
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
    totalEstimatedPrice: 990000,
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
    totalEstimatedPrice: 620000,
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
    budgetRange: '₹8,00,000 – ₹20,00,000',
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
    budgetRange: '₹20,00,000+',
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
  const list = getLocalItem(DESTINATIONS_KEY, INITIAL_DESTINATIONS);
  // Auto-migrate any legacy USD records in localStorage to INR
  let needsUpdate = false;
  const migrated = list.map((d) => {
    if (d.currency === 'USD' || (d.price && d.price < 10000)) {
      needsUpdate = true;
      const initialMatch = INITIAL_DESTINATIONS.find((init) => init.id === d.id || init.slug === d.slug);
      return {
        ...d,
        currency: 'INR',
        price: initialMatch ? initialMatch.price : (d.price ? Math.round(d.price * 85) : 145000)
      };
    }
    return {
      ...d,
      currency: d.currency || 'INR'
    };
  });
  if (needsUpdate) {
    setLocalItem(DESTINATIONS_KEY, migrated);
  }
  return migrated;
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
      currency: destination.currency || 'INR',
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
  const list = getLocalItem(BOOKINGS_KEY, INITIAL_BOOKINGS);
  let needsUpdate = false;
  const migrated = list.map((b) => {
    if (b.totalEstimatedPrice && b.totalEstimatedPrice < 20000) {
      needsUpdate = true;
      return {
        ...b,
        totalEstimatedPrice: Math.round(b.totalEstimatedPrice * 85)
      };
    }
    return b;
  });
  if (needsUpdate) {
    setLocalItem(BOOKINGS_KEY, migrated);
  }
  return migrated;
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
  const list = getLocalItem(INQUIRIES_KEY, INITIAL_INQUIRIES);
  let needsUpdate = false;
  const migrated = list.map((i) => {
    if (i.budgetRange && i.budgetRange.includes('$')) {
      needsUpdate = true;
      return {
        ...i,
        budgetRange: i.budgetRange.replace(/\$10,000 – \$25,000/g, '₹8,00,000 – ₹20,00,000').replace(/\$25,000\+/g, '₹20,00,000+').replace(/\$/g, '₹')
      };
    }
    return i;
  });
  if (needsUpdate) {
    setLocalItem(INQUIRIES_KEY, migrated);
  }
  return migrated;
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

/* ==========================================================================
   HERO SECTION API & DYNAMIC SETTINGS
   ========================================================================== */

export const DEFAULT_HERO_SETTINGS = {
  title: "Say it once.\nWe build the trip.",
  subtitle: "One phrase, and a living itinerary builds itself around the city: weather, pace, your mood.",
  backdropImageUrl: "https://framerusercontent.com/images/TSiGMGJHmapQIwKIzHneadv3LM.png",
  cutoutImageUrl: "/images/hero.png",
  showCutout: true,
  showGlassCard: true,
  glassCardCity: "LISBON",
  glassCardBadge: "TODAY",
  glassCardMuseum: "4:00 PM · Azulejo Museum",
  glassCardStatus: "rerouted · dry and on the way",
  glassCardPace: "evening: easy pace",
  typewriterPhrases: [
    "a week in Lisbon...",
    "4 days in Kyoto cherry blossoms...",
    "weekend on the Amalfi coast...",
    "Swiss Alps alpine retreat...",
    "hidden coves in Santorini..."
  ],
  stopChips: [
    { time: "Thu 9:30", title: "Alfama on foot", query: "Lisbon" },
    { time: "1:00 PM", title: "Time Out Market", query: "Lisbon" },
    { time: "6:40 PM", title: "sunset over the river", query: "Lisbon" },
    { time: "", title: "9 more places", query: "Europe" }
  ],
  beaconLabel: "Nomia right now:",
  beaconValue: "watching the weather shift",
  buildButtonText: "Build it"
};

const HERO_KEY = 'travelyn_hero_settings';

export function getStoredHeroSettings() {
  return getLocalItem(HERO_KEY, DEFAULT_HERO_SETTINGS);
}

export function saveStoredHeroSettings(settings) {
  const current = getStoredHeroSettings();
  const merged = { ...current, ...settings };
  setLocalItem(HERO_KEY, merged);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('travelyn_hero_updated', { detail: merged }));
  }
  return merged;
}

export function resetStoredHeroSettings() {
  setLocalItem(HERO_KEY, DEFAULT_HERO_SETTINGS);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('travelyn_hero_updated', { detail: DEFAULT_HERO_SETTINGS }));
  }
  return DEFAULT_HERO_SETTINGS;
}

/* ==========================================================================
   STORIES SHOWCASE API & DYNAMIC SETTINGS
   ========================================================================== */

export const DEFAULT_STORY_SETTINGS = {
  sectionTag: "Swiss Alps",
  titlePrimary: "Feel the mountains",
  titleMuted: "before you go",
  stories: [
    {
      id: "story-1",
      tag: "Swiss Alps",
      title: "Mornings above the clouds",
      description: "Coffee on a wooden balcony, the valley still asleep below and snowy peaks catching the first light.",
      imageUrl: "https://framerusercontent.com/images/8guYiCRSdUDmndFojnqAvFpGNk.jpg",
      buttonText: "Discover Swiss Alps",
      link: "/destinations/swiss-alps",
      reversed: false
    },
    {
      id: "story-2",
      tag: "Swiss Alps",
      title: "Evenings by the fire",
      description: "Wool blankets, crackling logs and fondue shared slowly while the snow falls outside the window.",
      imageUrl: "https://framerusercontent.com/images/Y5iOG5ie06PAZjqXQFJGD5em94.jpg",
      buttonText: "Discover Swiss Alps",
      link: "/destinations/swiss-alps",
      reversed: true
    }
  ]
};

const STORIES_KEY = 'travelyn_story_settings';

export function getStoredStorySettings() {
  return getLocalItem(STORIES_KEY, DEFAULT_STORY_SETTINGS);
}

export function saveStoredStorySettings(settings) {
  const current = getStoredStorySettings();
  const merged = { ...current, ...settings };
  setLocalItem(STORIES_KEY, merged);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('travelyn_stories_updated', { detail: merged }));
  }
  return merged;
}

export function resetStoredStorySettings() {
  setLocalItem(STORIES_KEY, DEFAULT_STORY_SETTINGS);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('travelyn_stories_updated', { detail: DEFAULT_STORY_SETTINGS }));
  }
  return DEFAULT_STORY_SETTINGS;
}

/* ==========================================================================
   ABOUT STUDIO & STATS SETTINGS (DYNAMIC MANIFESTO & METRICS)
   ========================================================================== */

export const DEFAULT_ABOUT_STATS_SETTINGS = {
  // Atmospheric Breathe Banner
  showBreatheBanner: true,
  breatheTag: "Breathe",
  breatheHeading: "Slow down.",
  breatheSubtext: "The world will wait.",
  breatheBgUrl: "https://framerusercontent.com/images/PMSlK6mTGdx9DcWYaJZiAMBFv4.jpg",

  // About Studio Intro
  aboutTag: "About Travelyn",
  aboutEst: "Est. 2014 — Lisbon",
  statementPrefix: "A boutique travel studio crafting ",
  statementHighlight: "tailor-made journeys",
  statementSuffix: " for curious travellers who would rather feel a place than simply see it.",
  buttonText: "Our Story",
  buttonLink: "/about",

  // Stats Counters
  stats: [
    { id: "stat-1", number: "250+", label: "Unique destinations" },
    { id: "stat-2", number: "50K+", label: "Happy travellers" },
    { id: "stat-3", number: "1,200+", label: "Curated experiences" },
    { id: "stat-4", number: "4.9/5", label: "Average rating" },
  ]
};

const ABOUT_STATS_KEY = 'travelyn_about_stats_settings';

export function getStoredAboutStatsSettings() {
  return getLocalItem(ABOUT_STATS_KEY, DEFAULT_ABOUT_STATS_SETTINGS);
}

export function saveStoredAboutStatsSettings(settings) {
  const current = getStoredAboutStatsSettings();
  const merged = { ...current, ...settings };
  setLocalItem(ABOUT_STATS_KEY, merged);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('travelyn_about_stats_updated', { detail: merged }));
  }
  if (typeof fetch !== 'undefined') {
    fetch('/api/about-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged)
    }).catch(() => {});
  }
  return merged;
}

export function resetStoredAboutStatsSettings() {
  setLocalItem(ABOUT_STATS_KEY, DEFAULT_ABOUT_STATS_SETTINGS);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('travelyn_about_stats_updated', { detail: DEFAULT_ABOUT_STATS_SETTINGS }));
  }
  return DEFAULT_ABOUT_STATS_SETTINGS;
}

/* ==========================================================================
   TESTIMONIALS & TRAVELLER STORIES SETTINGS (DYNAMIC REVIEWS & SCORECARD)
   ========================================================================== */

export const DEFAULT_TESTIMONIALS_SETTINGS = {
  sectionTag: "Traveller stories",
  ratingScore: "4.9",
  ratingStars: 5,
  verifiedReviewsText: "2,400+ verified reviews",
  testimonials: [
    {
      id: "testimonial-1",
      quote: "Slow trains, quiet villages and the best fondue of our lives. We didn’t want to come home.",
      authorName: "Claire & Tom",
      authorLocation: "Swiss Alps · 2026",
      authorAvatar: "https://framerusercontent.com/images/cwjju4oQ9SWH1nkXN95LfTNt94.jpg",
      photoUrl: "https://framerusercontent.com/images/OQDgLum0GfExeAWydcWtw46xVGk.jpg"
    },
    {
      id: "testimonial-2",
      quote: "Waking up to the morning bells of Gion and drinking matcha in a 300-year-old teahouse changed how we see time.",
      authorName: "Elena & Marcus",
      authorLocation: "Kyoto · 2026",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      photoUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "testimonial-3",
      quote: "Sailing the Caldera at dusk with local wine and no rush in the world. Travelyn created pure poetry for us.",
      authorName: "Sofia & Liam",
      authorLocation: "Santorini · 2026",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      photoUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80"
    }
  ]
};

const TESTIMONIALS_KEY = 'travelyn_testimonials_settings';

export function getStoredTestimonialsSettings() {
  return getLocalItem(TESTIMONIALS_KEY, DEFAULT_TESTIMONIALS_SETTINGS);
}

export function saveStoredTestimonialsSettings(settings) {
  const current = getStoredTestimonialsSettings();
  const merged = { ...current, ...settings };
  setLocalItem(TESTIMONIALS_KEY, merged);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('travelyn_testimonials_updated', { detail: merged }));
  }
  if (typeof fetch !== 'undefined') {
    fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged)
    }).catch(() => {});
  }
  return merged;
}

export function resetStoredTestimonialsSettings() {
  setLocalItem(TESTIMONIALS_KEY, DEFAULT_TESTIMONIALS_SETTINGS);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('travelyn_testimonials_updated', { detail: DEFAULT_TESTIMONIALS_SETTINGS }));
  }
  return DEFAULT_TESTIMONIALS_SETTINGS;
}



