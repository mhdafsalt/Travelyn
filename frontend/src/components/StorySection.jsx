'use client';

import React, { useRef } from 'react';
import './StorySection.css';

const VALUE_CARDS = [
  {
    id: 'bangli',
    tag: 'Panglipuran',
    title: 'Bangli, East Bali',
    subtitle: 'Cultural walk with local guides',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    offsetClass: 'offset-none',
    link: '/destinations/bali',
  },
  {
    id: 'uluwatu',
    tag: 'Uluwatu',
    title: 'Uluwatu, South Bali',
    subtitle: 'Clifftop sunsets & surf breaks',
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    offsetClass: 'offset-down',
    link: '/destinations/bali',
  },
  {
    id: 'trunyan',
    tag: 'Trunyan Lakeside',
    title: 'Trunyan, Kintamani',
    subtitle: 'Ancient lakeside village & mist',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    offsetClass: 'offset-slight',
    link: '/destinations/bali',
  },
  {
    id: 'swiss-morning',
    tag: 'Zermatt',
    title: 'Swiss Alps, Valais',
    subtitle: 'Mornings above the clouds',
    imageUrl: 'https://framerusercontent.com/images/8guYiCRSdUDmndFojnqAvFpGNk.jpg',
    offsetClass: 'offset-down',
    link: '/destinations/swiss-alps',
  },
  {
    id: 'swiss-evening',
    tag: 'St. Moritz',
    title: 'Engadin Valley',
    subtitle: 'Evenings by the fire',
    imageUrl: 'https://framerusercontent.com/images/Y5iOG5ie06PAZjqXQFJGD5em94.jpg',
    offsetClass: 'offset-none',
    link: '/destinations/swiss-alps',
  },
];

export default function StorySection() {
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollDistance = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'next' ? scrollDistance : -scrollDistance,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="story-section-wrapper">
      <div className="story-inner-container">
        {/* Left Column: Pill Badge, Title, Subtitle, CTA */}
        <div className="story-left-col">
          <div className="story-value-pill">
            <span className="story-value-dot" />
            <span>01 Our Value</span>
          </div>

          <h2 className="story-main-heading">
            Not Your Boring
            <br />
            Travel Agent
          </h2>

          <p className="story-main-subtext">
            We plan chill, curated trips with good vibes and better people.
          </p>

          <a href="/destinations" className="story-btn-book">
            Book a Seat
          </a>
        </div>

        {/* Right Column: Carousel of Staggered Cards + Prev/Next Controls */}
        <div className="story-right-col">
          <div className="story-cards-track" ref={scrollContainerRef}>
            {VALUE_CARDS.map((card) => (
              <a
                key={card.id}
                href={card.link}
                className={`story-card-item ${card.offsetClass}`}
              >
                <div className="story-card-image-box">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="story-card-img"
                    loading="lazy"
                  />
                  <div className="story-card-overlay-tag">
                    {card.tag}
                  </div>
                </div>

                <h3 className="story-card-title">{card.title}</h3>
                <p className="story-card-sub">{card.subtitle}</p>
              </a>
            ))}
          </div>

          {/* Navigation Prev & Next Controls */}
          <div className="story-nav-controls">
            <button
              type="button"
              onClick={() => handleScroll('prev')}
              className="story-nav-btn"
              aria-label="Previous cards"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              <span>Prev</span>
            </button>

            <button
              type="button"
              onClick={() => handleScroll('next')}
              className="story-nav-btn"
              aria-label="Next cards"
            >
              <span>Next</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
