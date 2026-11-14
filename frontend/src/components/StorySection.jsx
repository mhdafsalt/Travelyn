'use client';

import React from 'react';
import './StorySection.css';

export default function StorySection() {
  return (
    <section className="story-section-wrapper">
      {/* Header with Tag and Dual Headline */}
      <div className="story-header">
        <div className="voyara-tag">
          <div className="voyara-dot" />
          <span>Swiss Alps</span>
        </div>

        <h2 className="story-header-title">
          Feel the mountains
          <br />
          <span className="story-header-muted">before you go</span>
        </h2>
      </div>

      {/* Story 1: Photo on Left, Text on Right */}
      <div className="story-row">
        {/* Photo Left */}
        <div className="story-photo-box">
          <img
            src="https://framerusercontent.com/images/8guYiCRSdUDmndFojnqAvFpGNk.jpg"
            alt="Mornings above the clouds in Swiss Alps"
            className="story-photo-img"
          />
        </div>

        {/* Text Right */}
        <div className="story-text-col">
          <div className="voyara-tag">
            <div className="voyara-dot" />
            <span>Swiss Alps</span>
          </div>

          <h3 className="story-title">Mornings above the clouds</h3>

          <p className="story-description">
            Coffee on a wooden balcony, the valley still asleep below and snowy peaks catching the first light.
          </p>

          <a href="/destinations/swiss-alps" className="voyara-btn voyara-btn-light">
            <span>Discover Swiss Alps</span>
            <span className="voyara-arrow-circle">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* Story 2: Text on Left, Photo on Right (Reversed) */}
      <div className="story-row is-reversed">
        {/* Text Left */}
        <div className="story-text-col">
          <div className="voyara-tag">
            <div className="voyara-dot" />
            <span>Swiss Alps</span>
          </div>

          <h3 className="story-title">Evenings by the fire</h3>

          <p className="story-description">
            Wool blankets, crackling logs and fondue shared slowly while the snow falls outside the window.
          </p>

          <a href="/destinations/swiss-alps" className="voyara-btn voyara-btn-light">
            <span>Discover Swiss Alps</span>
            <span className="voyara-arrow-circle">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </span>
          </a>
        </div>

        {/* Photo Right */}
        <div className="story-photo-box">
          <img
            src="https://framerusercontent.com/images/Y5iOG5ie06PAZjqXQFJGD5em94.jpg"
            alt="Evenings by the fire in Swiss Alps"
            className="story-photo-img"
          />
        </div>
      </div>
    </section>
  );
}
