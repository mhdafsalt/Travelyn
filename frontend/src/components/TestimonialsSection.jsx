'use client';

import React, { useState, useEffect } from 'react';
import './TestimonialsSection.css';
import { getStoredTestimonialsSettings, DEFAULT_TESTIMONIALS_SETTINGS } from '@/lib/store';

export default function TestimonialsSection() {
  const [config, setConfig] = useState(DEFAULT_TESTIMONIALS_SETTINGS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const loadSettings = () => {
      const data = getStoredTestimonialsSettings();
      setConfig(data);
    };

    loadSettings();

    const handleUpdate = (e) => {
      if (e.detail) {
        setConfig(e.detail);
      } else {
        loadSettings();
      }
    };

    window.addEventListener('travelyn_testimonials_updated', handleUpdate);
    window.addEventListener('storage', loadSettings);

    return () => {
      window.removeEventListener('travelyn_testimonials_updated', handleUpdate);
      window.removeEventListener('storage', loadSettings);
    };
  }, []);

  const items = config.testimonials && config.testimonials.length > 0
    ? config.testimonials
    : DEFAULT_TESTIMONIALS_SETTINGS.testimonials;

  // Clamp current index if items count changed
  const activeIdx = Math.min(currentIndex, items.length - 1);
  const activeTestimonial = items[activeIdx] || items[0] || {};

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const starsCount = Math.max(1, Math.min(5, parseInt(config.ratingStars || 5, 10)));

  return (
    <section className="testimonials-wrapper" id="testimonials-section" suppressHydrationWarning>
      <div className="testimonials-container" suppressHydrationWarning>
        {/* Photo Left with Floating Scorecard */}
        <div className="testimonials-photo-frame">
          <img
            key={activeTestimonial.id || activeIdx}
            src={activeTestimonial.photoUrl || "https://framerusercontent.com/images/OQDgLum0GfExeAWydcWtw46xVGk.jpg"}
            alt={activeTestimonial.authorName || "Traveller journey"}
            className="testimonials-photo-img"
            loading="lazy"
            onError={(e) => {
              e.target.style.opacity = '0.5';
            }}
          />

          {/* Floating Glass Scorecard */}
          <div className="testimonials-floating-scorecard" suppressHydrationWarning>
            <div className="testimonials-score-val">{config.ratingScore || '4.9'}</div>

            {/* Stars Row */}
            <div className="testimonials-stars-row">
              {[...Array(starsCount)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#5b8291" stroke="#5b8291">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>

            <div className="testimonials-reviews-count">
              {config.verifiedReviewsText || '2,400+ verified reviews'}
            </div>
          </div>
        </div>

        {/* Right Column: Quote and Author */}
        <div className="testimonials-text-col" suppressHydrationWarning>
          <div className="voyara-tag">
            <div className="voyara-dot" />
            <span>{config.sectionTag || 'Traveller stories'}</span>
          </div>

          {/* Quote Icon */}
          <svg width="28" height="22" viewBox="0 0 24 18" className="testimonials-quote-svg">
            <path d="M0 18L0 9L4.5 0L9 0L6 7.5L9 7.5L9 18ZM15 18L15 9L19.5 0L24 0L21 7.5L24 7.5L24 18Z" />
          </svg>

          {/* Giant Quote Text */}
          <p className="testimonials-quote-text" key={`quote-${activeIdx}`}>
            “{activeTestimonial.quote || 'Slow trains, quiet villages and the best fondue of our lives. We didn’t want to come home.'}”
          </p>

          {/* Author Row */}
          <div className="testimonials-author-row" key={`author-${activeIdx}`}>
            <img
              src={activeTestimonial.authorAvatar || "https://framerusercontent.com/images/cwjju4oQ9SWH1nkXN95LfTNt94.jpg"}
              alt={activeTestimonial.authorName || "Author"}
              className="testimonials-author-avatar"
              onError={(e) => {
                e.target.style.opacity = '0.5';
              }}
            />
            <div>
              <div className="testimonials-author-name">
                {activeTestimonial.authorName || 'Claire & Tom'}
              </div>
              <div className="testimonials-author-location">
                {activeTestimonial.authorLocation || 'Swiss Alps · 2026'}
              </div>
            </div>
          </div>

          {/* Navigation Controls (mount-guarded & suppressed against browser extensions injecting fdprocessedid) */}
          {isMounted && items.length > 1 && (
            <div className="testimonials-nav-row" suppressHydrationWarning>
              <button
                type="button"
                onClick={handlePrev}
                className="testimonials-nav-btn"
                aria-label="Previous traveller story"
                suppressHydrationWarning
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div className="testimonials-dots-wrap" suppressHydrationWarning>
                {items.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentIndex(dotIdx)}
                    className={`testimonials-dot ${dotIdx === activeIdx ? 'is-active' : ''}`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    suppressHydrationWarning
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="testimonials-nav-btn"
                aria-label="Next traveller story"
                suppressHydrationWarning
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
