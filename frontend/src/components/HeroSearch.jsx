'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './HeroSearch.css';

const POPULAR_DESTINATIONS = [
  'Santorini, Greece',
  'Kyoto, Japan',
  'Maldives, Indian Ocean',
  'Swiss Alps, Switzerland',
  'Amalfi Coast, Italy',
  'Patagonia, Chile',
  'Lake Como, Italy',
  'Marrakech, Morocco',
];

const SEASONS = [
  'May – October (Summer)',
  'March – May (Spring Blossom)',
  'November – April (Tropical Dry)',
  'October – April (Southern Summer)',
  'June – September (Alpine Summer)',
  'December – March (Alpine Snow)',
];

export default function HeroSearch({ onSearch }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const containerRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveTab(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveTab(null);
    if (onSearch) {
      onSearch({
        destination: selectedDestination,
        season: selectedSeason,
        guests: adults + children,
      });
    } else {
      const params = new URLSearchParams();
      if (selectedDestination) params.set('search', selectedDestination.split(',')[0]);
      router.push(`/destinations?${params.toString()}`);
    }
  };

  return (
    <div ref={containerRef} className="hero-search-wrapper">
      {/* Capsule Container */}
      <div className="hero-search-capsule">
        {/* WHERE */}
        <div
          onClick={() => setActiveTab(activeTab === 'where' ? null : 'where')}
          className={`hero-search-tab is-where ${activeTab === 'where' ? 'is-active' : ''}`}
        >
          <span className="hero-search-tab-label">Where</span>
          <span className={`hero-search-tab-value ${selectedDestination ? 'has-value' : ''}`}>
            {selectedDestination || 'Search destinations'}
          </span>
        </div>

        {/* Divider 1 */}
        <div className="hero-search-divider" />

        {/* WHEN */}
        <div
          onClick={() => setActiveTab(activeTab === 'when' ? null : 'when')}
          className={`hero-search-tab is-when ${activeTab === 'when' ? 'is-active' : ''}`}
        >
          <span className="hero-search-tab-label">When</span>
          <span className={`hero-search-tab-value ${selectedSeason ? 'has-value' : ''}`}>
            {selectedSeason || 'Add dates'}
          </span>
        </div>

        {/* Divider 2 */}
        <div className="hero-search-divider" />

        {/* WHO & SEARCH BUTTON */}
        <div className="hero-search-who-group">
          <div
            onClick={() => setActiveTab(activeTab === 'who' ? null : 'who')}
            className={`hero-search-tab is-who ${activeTab === 'who' ? 'is-active' : ''}`}
          >
            <span className="hero-search-tab-label">Who</span>
            <span className="hero-search-tab-value has-value">
              {adults} {adults === 1 ? 'adult' : 'adults'}{children > 0 ? `, ${children} ch.` : ''}
            </span>
          </div>

          {/* Search Trigger Button */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={handleSearchSubmit}
            aria-label="Search"
            className="hero-search-submit-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* DROPDOWN POPUPS */}
      {/* WHERE DROPDOWN */}
      {activeTab === 'where' && (
        <div className="hero-search-dropdown-where">
          <div className="hero-search-dropdown-title">Popular Destinations</div>
          <div className="hero-search-dest-list">
            {POPULAR_DESTINATIONS.map((dest) => (
              <div
                key={dest}
                onClick={() => {
                  setSelectedDestination(dest);
                  setActiveTab('when');
                }}
                className={`hero-search-dest-item ${selectedDestination === dest ? 'is-selected' : ''}`}
              >
                <div className="hero-search-dest-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="hero-search-dest-label">{dest}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WHEN DROPDOWN */}
      {activeTab === 'when' && (
        <div className="hero-search-dropdown-when">
          <div className="hero-search-dropdown-title">Travel Windows & Seasons</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {SEASONS.map((season) => (
              <div
                key={season}
                onClick={() => {
                  setSelectedSeason(season);
                  setActiveTab('who');
                }}
                className={`hero-search-season-item ${selectedSeason === season ? 'is-selected' : ''}`}
              >
                {season}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WHO DROPDOWN */}
      {activeTab === 'who' && (
        <div className="hero-search-dropdown-who">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Adults */}
            <div className="hero-search-counter-row">
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e262a' }}>Adults</div>
                <div style={{ fontSize: '12px', color: 'rgba(30, 38, 42, 0.5)' }}>Ages 13 or above</div>
              </div>
              <div className="hero-search-counter-btns">
                <button
                  type="button"
                  suppressHydrationWarning
                  disabled={adults <= 1}
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="hero-search-counter-btn"
                >
                  -
                </button>
                <span className="hero-search-counter-val">{adults}</span>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setAdults(adults + 1)}
                  className="hero-search-counter-btn"
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="hero-search-counter-row">
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e262a' }}>Children</div>
                <div style={{ fontSize: '12px', color: 'rgba(30, 38, 42, 0.5)' }}>Ages 2–12</div>
              </div>
              <div className="hero-search-counter-btns">
                <button
                  type="button"
                  suppressHydrationWarning
                  disabled={children <= 0}
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="hero-search-counter-btn"
                >
                  -
                </button>
                <span className="hero-search-counter-val">{children}</span>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setChildren(children + 1)}
                  className="hero-search-counter-btn"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
