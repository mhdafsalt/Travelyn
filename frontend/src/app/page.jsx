'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeroSection from '@/components/HeroSection';
import CategoryBar from '@/components/CategoryBar';
import DestinationCard from '@/components/DestinationCard';
import PerksSection from '@/components/PerksSection';
import ImmersiveSlider from '@/components/ImmersiveSlider';
import StorySection from '@/components/StorySection';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BookingModal from '@/components/BookingModal';
import { INITIAL_DESTINATIONS } from '@/lib/data';
import { getStoredDestinations } from '@/lib/store';

export default function HomePage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState(INITIAL_DESTINATIONS);
  const [selectedCategory, setSelectedCategory] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingDest, setSelectedBookingDest] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Sync with dynamic store on client and listen for real-time updates
  useEffect(() => {
    const refresh = () => {
      try {
        const stored = getStoredDestinations();
        if (Array.isArray(stored) && stored.length > 0) {
          setDestinations(stored);
        }
      } catch (err) {}
    };

    refresh();
    window.addEventListener('travelyn_destinations_updated', refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener('travelyn_destinations_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // Filter destinations based on category and search
  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      const matchesCategory =
        selectedCategory === 'trending' ||
        d.category.includes(selectedCategory.toLowerCase());

      const matchesSearch =
        !searchQuery ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.region.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [destinations, selectedCategory, searchQuery]);

  const handleHeroSearch = (params) => {
    if (params?.destination) {
      setSearchQuery(params.destination.split(',')[0].trim());
    }
  };

  const openBookingForDestination = (dest) => {
    setSelectedBookingDest(dest);
    setIsBookingOpen(true);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 1. HERO SECTION - Nomia Style */}
      <HeroSection
        onSearch={handleHeroSearch}
        onOpenBooking={() => {
          setSelectedBookingDest(destinations[0] || INITIAL_DESTINATIONS[0]);
          setIsBookingOpen(true);
        }}
      />

      {/* 2. CATEGORIES SELECTOR */}
      <div id="categories-bar" style={{ width: '100%', backgroundColor: '#faf9f6' }}>
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={(slug) => {
            setSelectedCategory(slug);
            setSearchQuery('');
          }}
        />
      </div>

      {/* 3. POPULAR DESTINATIONS GRID */}
      <section
        id="destinations-section"
        style={{
          width: '100%',
          backgroundColor: '#faf9f6',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '36px',
          padding: '40px 24px 64px',
        }}
      >
        {/* Header Row */}
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 500,
                letterSpacing: '-0.035em',
                lineHeight: 1.05,
                color: '#1e262a',
                margin: 0,
              }}
            >
              Popular right now
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(30, 38, 42, 0.65)', margin: '6px 0 0' }}>
              Loved this season.
            </p>
          </div>

          <a href="/destinations" className="voyara-btn voyara-btn-light">
            <span>View All</span>
            <span className="voyara-arrow-circle">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </span>
          </a>
        </div>

        {/* Search Feedback Banner (if active) */}
        {searchQuery && (
          <div
            style={{
              width: '100%',
              maxWidth: '1200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 20px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid rgba(13, 13, 13, 0.08)',
            }}
          >
            <span style={{ fontSize: '14px', color: '#1e262a' }}>
              Showing results for: <strong>"{searchQuery}"</strong> ({filteredDestinations.length} found)
            </span>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13px',
                color: '#5b8291',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Clear Filter ✕
            </button>
          </div>
        )}

        {/* Destinations Flex/Grid */}
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '26px',
          }}
        >
          {filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onBookClick={openBookingForDestination}
            />
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: 'rgba(13, 13, 13, 0.6)',
              fontSize: '16px',
            }}
          >
            No journeys found matching your criteria. Try switching categories or clearing search.
          </div>
        )}
      </section>

      {/* 4. WHY BOOK WITH US PERKS */}
      <PerksSection />

      {/* 5. IMMERSIVE ALPS SLIDES */}
      <ImmersiveSlider />

      {/* 6. STORIES SHOWCASE (FEEL THE MOUNTAINS) */}
      <StorySection />

      {/* 7. STATS & BREATHE BANNER */}
      <StatsSection />

      {/* 8. TESTIMONIALS */}
      <TestimonialsSection />

      {/* Quick Booking Modal */}
      <BookingModal
        destination={selectedBookingDest}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}

