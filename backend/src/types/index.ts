export interface Destination {
  id: string;
  slug: string;
  title: string;
  country: string;
  region: string;
  tagline: string;
  description: string;
  price: number;
  currency: string;
  durationDays: number;
  rating: number;
  reviewCount: number;
  season: string;
  groupSize: string;
  category: string[];
  imageUrl: string;
  gallery: string[];
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  included: string[];
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

export interface Booking {
  id: string;
  destinationId: string;
  destinationTitle: string;
  travelerName: string;
  travelerEmail: string;
  phone?: string;
  startDate: string;
  guests: number;
  roomType: string;
  specialRequests?: string;
  totalEstimatedPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

export interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  destinationPreference?: string;
  travelDates?: string;
  budgetRange?: string;
  guestCount?: number;
  message: string;
  createdAt: string;
}

export interface Story {
  id: string;
  title: string;
  author: string;
  trip: string;
  year: number;
  avatarUrl: string;
  quote: string;
  rating: number;
}
