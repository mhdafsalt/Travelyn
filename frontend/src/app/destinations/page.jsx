'use client';
import React, { useState, useMemo } from 'react';
import DestinationCard from '@/components/DestinationCard';
import BookingModal from '@/components/BookingModal';
import { INITIAL_DESTINATIONS, CATEGORIES } from '@/lib/data';
export default function DestinationsPage() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [bookingDest, setBookingDest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const regions = ['all', 'Europe', 'Asia', 'South America', 'Africa', 'Indian Ocean'];
    const filtered = useMemo(() => {
        let result = [...INITIAL_DESTINATIONS];
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter((d) => d.title.toLowerCase().includes(q) ||
                d.country.toLowerCase().includes(q) ||
                d.tagline.toLowerCase().includes(q) ||
                d.description.toLowerCase().includes(q));
        }
        if (selectedCategory !== 'all') {
            result = result.filter((d) => d.category.includes(selectedCategory.toLowerCase()));
        }
        if (selectedRegion !== 'all') {
            result = result.filter((d) => d.region.toLowerCase() === selectedRegion.toLowerCase());
        }
        if (sortBy === 'price-asc')
            result.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-desc')
            result.sort((a, b) => b.price - a.price);
        if (sortBy === 'rating')
            result.sort((a, b) => b.rating - a.rating);
        if (sortBy === 'duration')
            result.sort((a, b) => a.durationDays - b.durationDays);
        return result;
    }, [search, selectedCategory, selectedRegion, sortBy]);
    return (<div style={{ backgroundColor: '#faf9f6', minHeight: '100vh', padding: '140px 24px 80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '36px' }}>
        {/* Header */}
        <div>
          <div className="voyara-tag" style={{ marginBottom: '14px' }}>
            <div className="voyara-dot"/>
            <span>Curated Journeys</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 500,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: '#1e262a',
            margin: '0 0 12px 0',
        }}>
            All Destinations
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(30, 38, 42, 0.65)', maxWidth: '640px', margin: 0 }}>
            Handpicked journeys crafted with intimacy, slow luxury, and rare access. Search by region, travel style, or duration.
          </p>
        </div>

        {/* Filters Bar */}
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '20px 24px',
            border: '1px solid rgba(13, 13, 13, 0.08)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
        }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 240px', minWidth: '220px', position: 'relative' }}>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search country, place or style..." style={{
            width: '100%',
            height: '46px',
            padding: '0 18px',
            borderRadius: '999px',
            border: '1px solid rgba(13, 13, 13, 0.12)',
            backgroundColor: 'rgba(13, 13, 13, 0.03)',
            fontSize: '14px',
            outline: 'none',
        }}/>
          </div>

          {/* Region Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(30, 38, 42, 0.6)' }}>Region:</span>
            <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} style={{
            height: '42px',
            padding: '0 14px',
            borderRadius: '999px',
            border: '1px solid rgba(13, 13, 13, 0.12)',
            backgroundColor: '#ffffff',
            fontSize: '13.5px',
            color: '#1e262a',
            cursor: 'pointer',
        }}>
              {regions.map((r) => (<option key={r} value={r}>
                  {r === 'all' ? 'All Regions' : r}
                </option>))}
            </select>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(30, 38, 42, 0.6)' }}>Theme:</span>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{
            height: '42px',
            padding: '0 14px',
            borderRadius: '999px',
            border: '1px solid rgba(13, 13, 13, 0.12)',
            backgroundColor: '#ffffff',
            fontSize: '13.5px',
            color: '#1e262a',
            cursor: 'pointer',
        }}>
              <option value="all">All Themes</option>
              {CATEGORIES.map((cat) => (<option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>))}
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(30, 38, 42, 0.6)' }}>Sort:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{
            height: '42px',
            padding: '0 14px',
            borderRadius: '999px',
            border: '1px solid rgba(13, 13, 13, 0.12)',
            backgroundColor: '#ffffff',
            fontSize: '13.5px',
            color: '#1e262a',
            cursor: 'pointer',
        }}>
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="duration">Trip Duration</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ fontSize: '14px', color: 'rgba(30, 38, 42, 0.65)' }}>
          Showing <strong>{filtered.length}</strong> extraordinary {filtered.length === 1 ? 'journey' : 'journeys'}
        </div>

        {/* Destination Cards Grid */}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '28px',
        }}>
          {filtered.map((dest) => (<DestinationCard key={dest.id} destination={dest} onBookClick={(d) => {
                setBookingDest(d);
                setIsModalOpen(true);
            }}/>))}
        </div>

        {filtered.length === 0 && (<div style={{ padding: '80px 20px', textAlign: 'center', color: 'rgba(30, 38, 42, 0.5)' }}>
            <p style={{ fontSize: '18px', margin: '0 0 12px 0' }}>No matching journeys found.</p>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedRegion('all');
              }}
              className="voyara-btn voyara-btn-dark"
            >
              <span>Reset All Filters</span>
            </button>
          </div>)}
      </div>

      <BookingModal destination={bookingDest} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
    </div>);
}
