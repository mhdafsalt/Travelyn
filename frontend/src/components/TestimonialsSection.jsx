'use client';

import React from 'react';
import './TestimonialsSection.css';

export default function TestimonialsSection() {
  return (
    <section className="testimonials-wrapper">
      <div className="testimonials-container">
        {/* Photo Left with Floating Scorecard */}
        <div className="testimonials-photo-frame">
          <img
            src="https://framerusercontent.com/images/OQDgLum0GfExeAWydcWtw46xVGk.jpg"
            alt="Traveller overlooking mountains"
            className="testimonials-photo-img"
          />

          {/* Floating Glass Scorecard */}
          <div className="testimonials-floating-scorecard">
            <div className="testimonials-score-val">4.9</div>

            {/* 5 Stars */}
            <div className="testimonials-stars-row">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#5b8291" stroke="#5b8291">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>

            <div className="testimonials-reviews-count">2,400+ verified reviews</div>
          </div>
        </div>

        {/* Right Column: Quote and Author */}
        <div className="testimonials-text-col">
          <div className="voyara-tag">
            <div className="voyara-dot" />
            <span>Traveller stories</span>
          </div>

          {/* Quote Icon */}
          <svg width="28" height="22" viewBox="0 0 24 18" className="testimonials-quote-svg">
            <path d="M0 18L0 9L4.5 0L9 0L6 7.5L9 7.5L9 18ZM15 18L15 9L19.5 0L24 0L21 7.5L24 7.5L24 18Z" />
          </svg>

          {/* Giant Quote Text */}
          <p className="testimonials-quote-text">
            “Slow trains, quiet villages and the best fondue of our lives. We didn’t want to come home.”
          </p>

          {/* Author Row */}
          <div className="testimonials-author-row">
            <img
              src="https://framerusercontent.com/images/cwjju4oQ9SWH1nkXN95LfTNt94.jpg"
              alt="Claire & Tom"
              className="testimonials-author-avatar"
            />
            <div>
              <div className="testimonials-author-name">Claire & Tom</div>
              <div className="testimonials-author-location">Swiss Alps · 2026</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
