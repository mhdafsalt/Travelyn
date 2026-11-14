'use client';

import React from 'react';
import './StatsSection.css';

export default function StatsSection() {
  const stats = [
    { number: '250+', label: 'Unique destinations' },
    { number: '50K+', label: 'Happy travellers' },
    { number: '1,200+', label: 'Curated experiences' },
    { number: '4.9/5', label: 'Average rating' },
  ];

  return (
    <>
      {/* Breathe Section */}
      <section className="stats-breathe-section">
        {/* Background Image */}
        <div className="stats-breathe-bg" />

        {/* Ambient Dark Shades */}
        <div className="stats-breathe-overlay-dark" />
        <div className="stats-breathe-overlay-top" />
        <div className="stats-breathe-overlay-bottom" />

        {/* Content */}
        <div className="stats-breathe-content">
          <div className="voyara-tag voyara-tag-dark">
            <div className="voyara-dot" />
            <span>Breathe</span>
          </div>

          <h2 className="stats-breathe-heading">
            Slow down.
            <br />
            <span className="stats-breathe-subtext">The world will wait.</span>
          </h2>
        </div>
      </section>

      {/* About Intro Section */}
      <section className="stats-about-section">
        <div className="stats-about-content">
          {/* Left Column */}
          <div className="stats-about-left">
            <div className="voyara-tag">
              <div className="voyara-dot" />
              <span>About Voyara</span>
            </div>
            <div className="stats-about-est">Est. 2014 — Lisbon</div>
          </div>

          {/* Right Column Statement */}
          <div className="stats-about-right">
            <p className="stats-about-statement">
              A boutique travel studio crafting{' '}
              <span className="stats-about-statement-muted">tailor-made journeys</span> for curious travellers who would rather feel a place than simply see it.
            </p>

            <div>
              <a href="/about" className="voyara-btn voyara-btn-dark">
                <span>Our Story</span>
                <span className="voyara-arrow-circle">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7" />
                    <path d="M8 7h9v9" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="stats-grid">
          {stats.map((s, idx) => (
            <div key={idx} className="stats-item">
              <div className="stats-item-divider" />
              <div className="stats-item-number">{s.number}</div>
              <div className="stats-item-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
