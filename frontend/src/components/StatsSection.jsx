'use client';

import React, { useState, useEffect } from 'react';
import './StatsSection.css';
import { getStoredAboutStatsSettings, DEFAULT_ABOUT_STATS_SETTINGS } from '@/lib/store';

export default function StatsSection() {
  const [config, setConfig] = useState(DEFAULT_ABOUT_STATS_SETTINGS);

  useEffect(() => {
    const loadSettings = () => {
      setConfig(getStoredAboutStatsSettings());
    };

    loadSettings();

    const handleUpdate = (e) => {
      if (e.detail) {
        setConfig(e.detail);
      } else {
        loadSettings();
      }
    };

    window.addEventListener('travelyn_about_stats_updated', handleUpdate);
    window.addEventListener('storage', loadSettings);

    return () => {
      window.removeEventListener('travelyn_about_stats_updated', handleUpdate);
      window.removeEventListener('storage', loadSettings);
    };
  }, []);

  const stats = config.stats && config.stats.length > 0
    ? config.stats
    : DEFAULT_ABOUT_STATS_SETTINGS.stats;

  return (
    <>
      {/* Breathe Section (Optional Ambient Banner) */}
      {config.showBreatheBanner !== false && (
        <section className="stats-breathe-section" id="breathe-section" suppressHydrationWarning>
          {/* Background Image */}
          <div
            className="stats-breathe-bg"
            style={{
              backgroundImage: `url(${config.breatheBgUrl || 'https://framerusercontent.com/images/PMSlK6mTGdx9DcWYaJZiAMBFv4.jpg'})`
            }}
          />

          {/* Ambient Dark Shades */}
          <div className="stats-breathe-overlay-dark" />
          <div className="stats-breathe-overlay-top" />
          <div className="stats-breathe-overlay-bottom" />

          {/* Content */}
          <div className="stats-breathe-content">
            <div className="stats-breathe-tag">
              <span className="stats-breathe-dot" />
              <span>{config.breatheTag || 'Breathe'}</span>
            </div>

            <h2 className="stats-breathe-heading">
              <span>{config.breatheHeading || 'Slow down.'}</span>
              <span className="stats-breathe-subtext">{config.breatheSubtext || 'The world will wait.'}</span>
            </h2>
          </div>
        </section>
      )}

      {/* About Intro & Stats Section */}
      <section className="stats-about-section" id="about-stats-section" suppressHydrationWarning>
        <div className="stats-about-content">
          {/* Left Column */}
          <div className="stats-about-left">
            <div className="voyara-tag">
              <div className="voyara-dot" />
              <span>{config.aboutTag || 'About Travelyn'}</span>
            </div>
            <div className="stats-about-est">{config.aboutEst || 'EST. 2024 — KERALA'}</div>
          </div>

          {/* Right Column Statement */}
          <div className="stats-about-right">
            <p className="stats-about-statement">
              {config.statementPrefix || 'A boutique travel studio crafting '}
              <span className="stats-about-statement-muted">
                {config.statementHighlight || 'tailor-made journeys'}
              </span>
              {config.statementSuffix || ' for curious travellers who would rather feel a place than simply see it.'}
            </p>

            <div>
              <a href={config.buttonLink || '/about'} className="voyara-btn voyara-btn-dark">
                <span>{config.buttonText || 'Our Story'}</span>
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

        {/* Dynamic Stats Grid */}
        <div className="stats-grid">
          {stats.map((s, idx) => (
            <div key={s.id || idx} className="stats-item">
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
