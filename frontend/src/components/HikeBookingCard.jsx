'use client';

import React, { useState } from 'react';
import './HikeBookingCard.css';

export default function HikeBookingCard({ destination, onBookClick }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [adults, setAdults] = useState(2);
  const [travelDate, setTravelDate] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dynamic route starting & ending points per destination
  const routePoints = {
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

  const startLoc = routePoints[destination?.slug]?.start || `${destination?.title || 'Pokhara'}, ${destination?.country || 'Nepal'}`;
  const endLoc = routePoints[destination?.slug]?.end || `${destination?.title || 'Pokhara'}, ${destination?.country || 'Nepal'}`;

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
      {/* 1. Top Map Illustration */}
      <div className="hike-map-container">
        <svg
          viewBox="0 0 380 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hike-map-svg"
        >
          {/* Organic Island/Mountain Contour Background */}
          <path
            d="M30,95 C25,60 55,30 110,25 C175,20 260,18 315,35 C350,45 365,75 355,115 C345,150 320,175 270,185 C210,195 130,190 75,175 C35,160 35,130 30,95 Z"
            fill="#edf2ea"
          />

          {/* Faint Inner Topo Ring */}
          <path
            d="M50,95 C45,70 70,45 120,40 C180,35 250,34 295,48 C330,58 340,82 332,115 C324,142 300,162 255,170 C200,180 135,174 88,160 C55,148 55,120 50,95 Z"
            fill="none"
            stroke="#dbe5d6"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Subtle Mountain and Pine Textures */}
          <path d="M72,130 L76,122 L80,130 Z M76,130 L76,132" stroke="#b8cbaf" strokeWidth="1" fill="none" />
          <path d="M140,55 L144,47 L148,55 Z M144,55 L144,57" stroke="#b8cbaf" strokeWidth="1" fill="none" />
          <path d="M210,65 L214,57 L218,65 Z M214,65 L214,67" stroke="#b8cbaf" strokeWidth="1" fill="none" />
          <path d="M245,145 L249,137 L253,145 Z M249,145 L249,147" stroke="#b8cbaf" strokeWidth="1" fill="none" />
          <path d="M295,120 L299,112 L303,120 Z M299,120 L299,122" stroke="#b8cbaf" strokeWidth="1" fill="none" />

          {/* Solid Trail Section */}
          <path
            d="M115,165 C100,155 95,130 98,105 C102,80 120,62 145,55 C165,50 190,45 210,48 C225,50 235,58 245,70"
            fill="none"
            stroke="#1c3a27"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Dashed High Ridge Trail Section */}
          <path
            d="M245,70 C258,82 265,95 264,115 C263,130 258,142 254,152"
            fill="none"
            stroke="#1c3a27"
            strokeWidth="2.2"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />

          {/* Return Trail to Point B */}
          <path
            d="M254,152 C248,162 235,172 205,174 C175,175 145,172 135,168"
            fill="none"
            stroke="#1c3a27"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Intermediate Checkpoint Dots */}
          <circle cx="98" cy="105" r="3" fill="#ffffff" stroke="#1c3a27" strokeWidth="1.8" />
          <circle cx="96" cy="135" r="3" fill="#ffffff" stroke="#1c3a27" strokeWidth="1.8" />
          <circle cx="210" cy="48" r="3" fill="#ffffff" stroke="#1c3a27" strokeWidth="1.8" />
          <circle cx="205" cy="174" r="3" fill="#ffffff" stroke="#1c3a27" strokeWidth="1.8" />

          {/* Waypoint 1: Mountain Peak */}
          <circle cx="152" cy="54" r="8" fill="#edf2ea" stroke="#1c3a27" strokeWidth="1.6" />
          <path d="M148,57 L152,50 L156,57 Z" fill="#1c3a27" />

          {/* Waypoint 2: Pine Forest */}
          <circle cx="264" cy="115" r="8" fill="#edf2ea" stroke="#1c3a27" strokeWidth="1.6" />
          <path d="M261,118 L264,111 L267,118 Z M264,118 L264,120" stroke="#1c3a27" strokeWidth="1.2" fill="none" />

          {/* Waypoint 3: Lake / Basin */}
          <circle cx="254" cy="152" r="8" fill="#edf2ea" stroke="#1c3a27" strokeWidth="1.6" />
          <path d="M250,151 C252,149 254,153 258,151 M250,154 C252,152 254,156 258,154" stroke="#1c3a27" strokeWidth="1.2" strokeLinecap="round" />

          {/* Checkpoint A */}
          <circle cx="115" cy="165" r="7" fill="#1c3a27" />
          <text x="115" y="168.5" fontSize="8" fontWeight="bold" fill="#ffffff" textAnchor="middle">A</text>

          {/* Checkpoint B */}
          <circle cx="135" cy="168" r="7" fill="#1c3a27" />
          <text x="135" y="171.5" fontSize="8" fontWeight="bold" fill="#ffffff" textAnchor="middle">B</text>

          {/* Compass Rose */}
          <g transform="translate(325, 160)">
            <path d="M0,-14 L2.5,-3.5 L13,0 L2.5,3.5 L0,14 L-2.5,3.5 L-13,0 L-2.5,-3.5 Z" fill="#1c3a27" opacity="0.85" />
            <path d="M0,-14 L0,0 L2.5,-3.5 Z M0,14 L0,0 L-2.5,3.5 Z M13,0 L0,0 L2.5,3.5 Z M-13,0 L0,0 L-2.5,-3.5 Z" fill="#2c5539" />
            <text x="0" y="-17" fontSize="9" fontWeight="bold" fill="#1c3a27" textAnchor="middle">N</text>
          </g>
        </svg>
      </div>

      {/* 2. Route Endpoints Row */}
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

