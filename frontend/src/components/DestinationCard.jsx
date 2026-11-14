'use client';

import React, { useState } from 'react';
import './DestinationCard.css';

export default function DestinationCard({ destination, onBookClick }) {
  const [isHovered, setIsHovered] = useState(false);

  if (!destination) return null;

  // Title formatting: "Switzerland", "Kyoto, Japan", "Bali, Indonesia"
  const displayTitle = destination.displayTitle || (
    destination.country && destination.country !== destination.title && !destination.title.includes(destination.country)
      ? `${destination.title}, ${destination.country}`
      : destination.title
  );

  // Region text for pill: "EUROPE", "ASIA", "SOUTHEAST ASIA"
  const regionText = (destination.region || destination.country || 'EXPLORE').toUpperCase();

  // Short description / tagline
  const descText = destination.tagline || destination.description || '';

  // Formatted price
  const formattedPrice = destination.price ? destination.price.toLocaleString() : '1,850';
  const currencySymbol = destination.currency === 'EUR' ? '€' : destination.currency === 'GBP' ? '£' : '$';

  const handleActionClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onBookClick) {
      onBookClick(destination);
    } else {
      window.location.href = `/destinations/${destination.slug}`;
    }
  };

  return (
    <a
      href={`/destinations/${destination.slug}`}
      className={`dest-card-container ${isHovered ? 'is-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <img
        src={destination.imageUrl}
        alt={displayTitle}
        loading="lazy"
        className="dest-card-bg-img"
      />

      {/* Top Vignette Gradient */}
      <div className="dest-card-overlay-top" />

      {/* Bottom Rich Contrast Gradient */}
      <div className="dest-card-overlay-bottom" />

      {/* Top-Left Pill Badge: ● REGION */}
      <div className="dest-card-pill">
        <span className="dest-card-pill-dot" />
        <span className="dest-card-pill-text">{regionText}</span>
      </div>

      {/* Bottom Content Area */}
      <div className="dest-card-content">
        <h3 className="dest-card-title">{displayTitle}</h3>
        <p className="dest-card-desc">{descText}</p>

        <div className="dest-card-footer">
          <div className="dest-card-price">
            From {currencySymbol}{formattedPrice}/person
          </div>

          <button
            type="button"
            suppressHydrationWarning
            onClick={handleActionClick}
            aria-label={`Explore ${displayTitle}`}
            className="dest-card-action-btn"
          >
            <span className="dest-card-btn-dot" />
          </button>
        </div>
      </div>
    </a>
  );
}
