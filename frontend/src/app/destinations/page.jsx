'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DestinationCard from '@/components/DestinationCard';
import BookingModal from '@/components/BookingModal';
import { INITIAL_DESTINATIONS, CATEGORIES } from '@/lib/data';
import { getStoredDestinations } from '@/lib/store';
import './destinations.css';

function DestinationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [destinations, setDestinations] = useState(INITIAL_DESTINATIONS);
  const [mounted, setMounted] = useState(false);

  // Initialize filter states from URL search params if provided
  const initialQ = searchParams?.get('q') || searchParams?.get('search') || '';
  const initialRegion = searchParams?.get('region') || 'all';
  const initialCategory = searchParams?.get('category') || searchParams?.get('theme') || 'all';
  const initialSort = searchParams?.get('sort') || 'featured';

  const [search, setSearch] = useState(initialQ);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);

  const [bookingDest, setBookingDest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load from localStorage & sync live updates from admin or other tabs
  const refreshDestinations = () => {
    try {
      const stored = getStoredDestinations();
      if (Array.isArray(stored) && stored.length > 0) {
        setDestinations(stored);
      }
    } catch (err) {
      console.warn('Failed to refresh destinations:', err);
    }
  };

  useEffect(() => {
    setMounted(true);
    refreshDestinations();

    // Listen for live destination updates from Admin (add/edit/delete)
    const handleUpdate = () => {
      refreshDestinations();
    };

    window.addEventListener('travelyn_destinations_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('travelyn_destinations_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Update states if URL query parameters change
  useEffect(() => {
    if (!searchParams) return;
    const qParam = searchParams.get('q') || searchParams.get('search');
    if (qParam !== null && qParam !== undefined) setSearch(qParam);

    const regionParam = searchParams.get('region');
    if (regionParam !== null && regionParam !== undefined) setSelectedRegion(regionParam);

    const catParam = searchParams.get('category') || searchParams.get('theme');
    if (catParam !== null && catParam !== undefined) setSelectedCategory(catParam);

    const sortParam = searchParams.get('sort');
    if (sortParam !== null && sortParam !== undefined) setSortBy(sortParam);
  }, [searchParams]);

  // Compute dynamic distinct regions from existing destinations with live counts
  const { availableRegions, regionCounts } = useMemo(() => {
    const counts = {};
    destinations.forEach((d) => {
      if (d.region && typeof d.region === 'string' && d.region.trim()) {
        const r = d.region.trim();
        counts[r] = (counts[r] || 0) + 1;
      }
    });

    const sortedRegions = Object.keys(counts).sort((a, b) => a.localeCompare(b));
    return { availableRegions: sortedRegions, regionCounts: counts };
  }, [destinations]);

  // Compute dynamic themes/categories with live destination counts
  const availableThemes = useMemo(() => {
    const counts = {};
    destinations.forEach((d) => {
      const cats = Array.isArray(d.category) ? d.category : [d.category];
      cats.forEach((c) => {
        if (!c) return;
        const slug = String(c).trim().toLowerCase();
        counts[slug] = (counts[slug] || 0) + 1;
      });
    });

    const themes = [];
    const seen = new Set();

    // Predefined CATEGORIES first
    CATEGORIES.forEach((cat) => {
      const slug = cat.slug.toLowerCase();
      seen.add(slug);
      themes.push({
        slug: cat.slug,
        name: cat.name,
        count: counts[slug] || 0
      });
    });

    // Add any dynamic custom categories present in the destinations database
    Object.keys(counts).forEach((slug) => {
      if (!seen.has(slug) && counts[slug] > 0) {
        const name = slug.charAt(0).toUpperCase() + slug.slice(1);
        themes.push({
          slug,
          name,
          count: counts[slug]
        });
      }
    });

    return themes;
  }, [destinations]);

  // Deep multi-field search and filter
  const filtered = useMemo(() => {
    let result = [...destinations];

    // Deep search query matching title, country, region, routes, tagline, description, highlights, categories
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((d) => {
        const titleMatch = d.title && d.title.toLowerCase().includes(q);
        const countryMatch = d.country && d.country.toLowerCase().includes(q);
        const regionMatch = d.region && d.region.toLowerCase().includes(q);
        const startPointMatch = d.startingPoint && d.startingPoint.toLowerCase().includes(q);
        const endPointMatch = d.endingPoint && d.endingPoint.toLowerCase().includes(q);
        const taglineMatch = d.tagline && d.tagline.toLowerCase().includes(q);
        const descMatch = d.description && d.description.toLowerCase().includes(q);

        const categoryMatch = Array.isArray(d.category)
          ? d.category.some((c) => String(c).toLowerCase().includes(q))
          : (d.category && String(d.category).toLowerCase().includes(q));

        const highlightMatch = Array.isArray(d.highlights) && d.highlights.some((h) => String(h).toLowerCase().includes(q));

        return (
          titleMatch ||
          countryMatch ||
          regionMatch ||
          startPointMatch ||
          endPointMatch ||
          taglineMatch ||
          descMatch ||
          categoryMatch ||
          highlightMatch
        );
      });
    }

    // Region filter
    if (selectedRegion !== 'all') {
      result = result.filter(
        (d) => d.region && d.region.trim().toLowerCase() === selectedRegion.trim().toLowerCase()
      );
    }

    // Category / Theme filter
    if (selectedCategory !== 'all') {
      const targetSlug = selectedCategory.trim().toLowerCase();
      result = result.filter((d) => {
        if (Array.isArray(d.category)) {
          return d.category.some(
            (c) => String(c).trim().toLowerCase() === targetSlug || String(c).trim().toLowerCase().includes(targetSlug)
          );
        }
        return d.category && String(d.category).trim().toLowerCase().includes(targetSlug);
      });
    }

    // Sort order
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortBy === 'duration') {
      result.sort((a, b) => (Number(a.durationDays) || 0) - (Number(b.durationDays) || 0));
    }

    return result;
  }, [destinations, search, selectedRegion, selectedCategory, sortBy]);

  const hasActiveFilters = search.trim() !== '' || selectedRegion !== 'all' || selectedCategory !== 'all';

  const resetAllFilters = () => {
    setSearch('');
    setSelectedRegion('all');
    setSelectedCategory('all');
    setSortBy('featured');
  };

  const getSelectedThemeName = () => {
    if (selectedCategory === 'all') return '';
    const found = availableThemes.find(
      (t) => t.slug.toLowerCase() === selectedCategory.toLowerCase()
    );
    return found ? found.name : selectedCategory;
  };

  return (
    <div className="destinations-page">
      <div className="destinations-container">
        {/* Curated Header */}
        <div className="destinations-header">
          <div className="destinations-tag">
            <span className="destinations-tag-dot" />
            <span>Curated Journeys</span>
          </div>

          <h1 className="destinations-title">All Destinations</h1>

          <p className="destinations-subtitle">
            Handpicked journeys crafted with intimacy, slow luxury, and rare access. Search by region, travel style, or duration.
          </p>
        </div>

        {/* Dynamic Filter Panel */}
        <div className="destinations-filter-panel">
          {/* Search Input with Clear Button */}
          <div className="destinations-search-wrap">
            <span className="destinations-search-icon" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country, place or style..."
              className="destinations-search-input"
              aria-label="Search destinations by country, place, or style"
            />

            {search.trim() && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="destinations-search-clear"
                title="Clear search"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dropdown Filters Group */}
          <div className="destinations-dropdowns-row">
            {/* Dynamic Region Dropdown */}
            <div className="destinations-dropdown-group">
              <label htmlFor="dest-region-select" className="destinations-dropdown-label">
                Region:
              </label>
              <div className="destinations-select-wrap">
                <select
                  id="dest-region-select"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="destinations-select"
                >
                  <option value="all">
                    All Regions ({destinations.length})
                  </option>
                  {availableRegions.map((region) => (
                    <option key={region} value={region}>
                      {region} ({regionCounts[region] || 0})
                    </option>
                  ))}
                </select>
                <span className="destinations-select-chevron" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Dynamic Theme / Category Dropdown */}
            <div className="destinations-dropdown-group">
              <label htmlFor="dest-theme-select" className="destinations-dropdown-label">
                Theme:
              </label>
              <div className="destinations-select-wrap">
                <select
                  id="dest-theme-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="destinations-select"
                >
                  <option value="all">
                    All Themes ({destinations.length})
                  </option>
                  {availableThemes.map((theme) => (
                    <option key={theme.slug} value={theme.slug}>
                      {theme.name} {theme.count > 0 ? `(${theme.count})` : ''}
                    </option>
                  ))}
                </select>
                <span className="destinations-select-chevron" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="destinations-dropdown-group">
              <label htmlFor="dest-sort-select" className="destinations-dropdown-label">
                Sort:
              </label>
              <div className="destinations-select-wrap">
                <select
                  id="dest-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="destinations-select"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="duration">Trip Duration</option>
                </select>
                <span className="destinations-select-chevron" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="destinations-active-pills-bar">
            <span className="destinations-active-label">Active:</span>

            {search.trim() && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="destinations-pill-chip"
                title="Remove search query"
              >
                <span>Search: &ldquo;{search.trim()}&rdquo;</span>
                <span className="destinations-pill-x">✕</span>
              </button>
            )}

            {selectedRegion !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedRegion('all')}
                className="destinations-pill-chip"
                title="Remove region filter"
              >
                <span>Region: {selectedRegion}</span>
                <span className="destinations-pill-x">✕</span>
              </button>
            )}

            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="destinations-pill-chip"
                title="Remove theme filter"
              >
                <span>Theme: {getSelectedThemeName()}</span>
                <span className="destinations-pill-x">✕</span>
              </button>
            )}

            <button
              type="button"
              onClick={resetAllFilters}
              className="destinations-clear-all-btn"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Results Counter Row */}
        <div className="destinations-counter-row">
          <div>
            Showing <span className="destinations-count-strong">{filtered.length}</span>{' '}
            extraordinary {filtered.length === 1 ? 'journey' : 'journeys'}
          </div>

          {hasActiveFilters && (
            <div className="destinations-filter-meta">
              Filtered from {destinations.length} destinations
            </div>
          )}
        </div>

        {/* Destination Cards Grid */}
        {filtered.length > 0 ? (
          <div className="destinations-grid">
            {filtered.map((dest) => (
              <DestinationCard
                key={dest.id || dest.slug}
                destination={dest}
                onBookClick={(d) => {
                  setBookingDest(d);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="destinations-empty">
            <div className="destinations-empty-icon">🧭</div>
            <h3 className="destinations-empty-title">No matching journeys found</h3>
            <p className="destinations-empty-desc">
              We couldn&apos;t find any journeys matching your current search or filter criteria. Try adjusting your search term or clearing filters.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="voyara-btn voyara-btn-dark"
              style={{ marginTop: '8px' }}
            >
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        destination={bookingDest}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense
      fallback={
        <div className="destinations-page">
          <div className="destinations-container">
            <div className="destinations-header">
              <div className="destinations-tag">
                <span className="destinations-tag-dot" />
                <span>Curated Journeys</span>
              </div>
              <h1 className="destinations-title">All Destinations</h1>
              <p className="destinations-subtitle">
                Handpicked journeys crafted with intimacy, slow luxury, and rare access.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <DestinationsContent />
    </Suspense>
  );
}
