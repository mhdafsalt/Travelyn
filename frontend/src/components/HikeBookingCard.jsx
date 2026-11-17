'use client';

import React, { useState } from 'react';
import './HikeBookingCard.css';

export default function HikeBookingCard({ destination, onBookClick }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [adults, setAdults] = useState(2);
  const [travelDate, setTravelDate] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dynamic route starting & ending points per destination (reads directly from destination, with graceful fallbacks)
  const fallbackRoutePoints = {
    'swiss-alps': { start: 'Zurich, Switzerland', end: 'Zermatt, Switzerland' },
    'kyoto': { start: 'Kyoto, Japan', end: 'Kyoto, Japan' },
    'bali': { start: 'Ubud, Bali', end: 'Uluwatu, Bali' },
    'santorini': { start: 'Oia, Santorini', end: 'Ammoudi, Santorini' },
    'maldives': { start: 'Malé, Maldives', end: 'Private Atoll, Maldives' },
    'patagonia': { start: 'Punta Arenas, Chile', end: 'Torres del Paine, Chile' },
    'marrakech': { start: 'Marrakech, Morocco', end: 'Atlas Mountains, Morocco' },
    'amalfi-coast': { start: 'Positano, Italy', end: 'Capri, Italy' },
    'lake-como': { start: 'Milan, Italy', end: 'Bellagio, Lake Como' },
  };

  const defaultStart = fallbackRoutePoints[destination?.slug]?.start || `${destination?.title || 'Origin'}${destination?.country ? ', ' + destination.country : ''}`;
  const defaultEnd = fallbackRoutePoints[destination?.slug]?.end || `${destination?.title || 'Destination'}${destination?.country ? ', ' + destination.country : ''}`;

  const startLoc = (destination?.startingPoint && destination.startingPoint.trim()) || defaultStart;
  const endLoc = (destination?.endingPoint && destination.endingPoint.trim()) || defaultEnd;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onBookClick) {
      onBookClick({
        ...destination,
        guestName: fullName,
        guestEmail: email,
        adultsCount: adults,
        preferredDate: travelDate,
      });
    } else {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  return (
    <div className="hike-card-wrap">
      {/* 1. Route Endpoints Row */}
      <div className="hike-route-row">
        <div className="hike-route-endpoint left" title={startLoc}>
          <div className="hike-endpoint-title">{startLoc}</div>
          <div className="hike-endpoint-sub">Starting Point</div>
        </div>

        <div className="hike-route-divider" aria-hidden="true">
          <span className="hike-divider-dot" />
          <span className="hike-divider-line" />
          <span className="hike-divider-dot" />
        </div>

        <div className="hike-route-endpoint right" title={endLoc}>
          <div className="hike-endpoint-title">{endLoc}</div>
          <div className="hike-endpoint-sub">Ending Point</div>
        </div>
      </div>

      {/* 3. Booking Form */}
      <form className="hike-form" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="hike-form-group">
          <label className="hike-form-label">Full Name</label>
          <input
            type="text"
            placeholder="John Smith"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="hike-form-input"
            required
            suppressHydrationWarning
          />
        </div>

        {/* Email */}
        <div className="hike-form-group">
          <label className="hike-form-label">Email</label>
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="hike-form-input"
            required
            suppressHydrationWarning
          />
        </div>

        {/* Adults */}
        <div className="hike-form-group">
          <label className="hike-form-label">Adults</label>
          <input
            type="number"
            min="1"
            max="12"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="hike-form-input"
            required
            suppressHydrationWarning
          />
        </div>

        {/* When Are You Thinking Of Going? */}
        <div className="hike-form-group">
          <label className="hike-form-label">When Are You Thinking Of Going?</label>
          <div className="hike-input-with-icon">
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="hike-form-input"
              required
              suppressHydrationWarning
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#71717a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hike-calendar-icon"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </div>

        {/* Price Row */}
        <div className="hike-price-row">
          <span className="hike-price-val" suppressHydrationWarning>
            ₹{(destination?.price || 145000).toLocaleString('en-IN')}
          </span>
          <span className="hike-price-unit">/Per Person</span>
        </div>

        {/* Submit Action Button */}
        <button
          type="submit"
          className="hike-submit-btn"
          suppressHydrationWarning
        >
          Book This Hike
        </button>

        {isSubmitted && (
          <div className="hike-success-msg">
            ✓ Reservation request received! We will verify dates and availability.
          </div>
        )}
      </form>
    </div>
  );
}

