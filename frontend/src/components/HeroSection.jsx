'use client';

import React, { useState, useEffect } from 'react';
import './HeroSection.css';
import { getStoredHeroSettings, DEFAULT_HERO_SETTINGS } from '@/lib/store';

export default function HeroSection({ onSearch, onOpenBooking }) {
  const [heroConfig, setHeroConfig] = useState(DEFAULT_HERO_SETTINGS);

  // Live Clock & Date with hydration safety
  const [currentDate, setCurrentDate] = useState('Fri 13 nov');
  const [currentTime, setCurrentTime] = useState({ hours: '20', minutes: '19' });
  const [promptText, setPromptText] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Load dynamic hero settings & listen for live updates
  useEffect(() => {
    const loadSettings = () => {
      setHeroConfig(getStoredHeroSettings());
    };

    loadSettings();

    const handleUpdate = (e) => {
      if (e.detail) {
        setHeroConfig(e.detail);
      } else {
        loadSettings();
      }
    };

    window.addEventListener('travelyn_hero_updated', handleUpdate);
    window.addEventListener('storage', loadSettings);

    return () => {
      window.removeEventListener('travelyn_hero_updated', handleUpdate);
      window.removeEventListener('storage', loadSettings);
    };
  }, []);

  // Update clock live on client
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

      const dayName = days[now.getDay()];
      const dayNum = now.getDate();
      const monthName = months[now.getMonth()];

      setCurrentDate(`${dayName} ${dayNum} ${monthName}`);

      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime({ hours: hh, minutes: mm });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  // Typewriter effect for search prompt
  const phrases = heroConfig.typewriterPhrases && heroConfig.typewriterPhrases.length > 0
    ? heroConfig.typewriterPhrases
    : DEFAULT_HERO_SETTINGS.typewriterPhrases;

  useEffect(() => {
    if (isFocused || promptText.length > 0 || !phrases.length) return;

    const currentPhrase = phrases[phraseIndex % phrases.length] || phrases[0];
    const speed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentPhrase.length) {
        setPlaceholderText(currentPhrase.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else if (!isDeleting && charIndex === currentPhrase.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex > 0) {
        setPlaceholderText(currentPhrase.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex, isFocused, promptText, phrases]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const query = promptText.trim() || placeholderText.replace(/\.\.\.$/, '').trim() || 'Lisbon';
    if (onSearch) {
      onSearch({
        destination: query,
        season: 'Trending',
        guests: 2,
      });
    }

    // Smooth scroll down to destinations or categories
    const target = document.getElementById('destinations-section') || document.getElementById('categories-bar');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChipClick = (query) => {
    setPromptText(query);
    if (onSearch) {
      onSearch({
        destination: query,
        season: 'Trending',
        guests: 2,
      });
    }
    const target = document.getElementById('destinations-section') || document.getElementById('categories-bar');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const chips = heroConfig.stopChips && heroConfig.stopChips.length > 0
    ? heroConfig.stopChips
    : DEFAULT_HERO_SETTINGS.stopChips;

  const rawTitle = heroConfig.title || DEFAULT_HERO_SETTINGS.title;
  const titleLines = rawTitle.split('\n');

  return (
    <section id="top" className="hero-section">
      {/* 1. Full-Bleed Atmospheric Background Image */}
      <div
        className="hero-backdrop-img"
        style={heroConfig.backdropImageUrl ? { backgroundImage: `url(${heroConfig.backdropImageUrl})` } : {}}
      />

      {/* Ambient lighting overlays */}
      <div className="hero-overlay-radial" />
      <div className="hero-overlay-top" />
      <div className="hero-overlay-bottom" />

      {/* 2. Ambient Framing Wireframes */}
      <div className="hero-wireframe-box" />
      <div className="hero-wireframe-pill" />

      {/* 3. Giant Digital Clock & Date Center Display */}
      <div className="hero-clock-container" suppressHydrationWarning>
        <div className="hero-date-badge" suppressHydrationWarning>{currentDate}</div>
        <div className="hero-clock-digits-wrap" suppressHydrationWarning>
          <span className="hero-clock-digits" suppressHydrationWarning>{currentTime.hours}</span>
          <span className="hero-clock-colon">:</span>
          <span className="hero-clock-digits" suppressHydrationWarning>{currentTime.minutes}</span>
        </div>
      </div>

      {/* 4. Foreground Subject Cutout */}
      {heroConfig.showCutout !== false && (
        <div className="hero-cutout-container">
          <img
            src={heroConfig.cutoutImageUrl || "/images/hero.png"}
            alt="Hero cutout"
            className="hero-cutout-img"
            onError={(e) => {
              if (!e.currentTarget.dataset.retried) {
                e.currentTarget.dataset.retried = 'true';
                e.currentTarget.src = './images/hero.png';
              }
            }}
          />
        </div>
      )}

      {/* Bottom Small White Shade */}
      <div className="hero-bottom-white-shade" />

      {/* 5. Main Hero Content Overlays */}
      <div className="hero-content-wrapper">
        {/* Top Header Row (Left Title & Right Glass Widget) */}
        <div className="hero-top-row">
          {/* Left Block */}
          <div className="hero-left-block">
            <h1 className="hero-title">
              {titleLines.map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < titleLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <p className="hero-subtitle">
              {heroConfig.subtitle || DEFAULT_HERO_SETTINGS.subtitle}
            </p>
          </div>

          {/* Right Glass Widget: Live Card */}
          {heroConfig.showGlassCard !== false && (
            <div className="hero-glass-card">
              <div className="hero-card-header">
                <span className="hero-card-city">{heroConfig.glassCardCity || 'LISBON'}</span>
                <span className="hero-card-today-badge">{heroConfig.glassCardBadge || 'TODAY'}</span>
              </div>

              <div className="hero-card-body">
                <div className="hero-card-museum">{heroConfig.glassCardMuseum || '4:00 PM · Azulejo Museum'}</div>
                <div className="hero-card-status">{heroConfig.glassCardStatus || 'rerouted · dry and on the way'}</div>
              </div>

              <div className="hero-card-divider" />

              <div className="hero-card-footer">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
                <span className="hero-card-pace-text">{heroConfig.glassCardPace || 'evening: easy pace'}</span>
              </div>
            </div>
          )}
        </div>

        {/* 6. Bottom Controls Section (Chips, Prompt Bar, Live Beacon) */}
        <div className="hero-bottom-controls">
          {/* Horizontal Stop Chips Row */}
          <div className="hero-chips-row">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                suppressHydrationWarning
                onClick={() => handleChipClick(chip.query)}
                className="hero-chip-btn"
              >
                {chip.time && <span className="hero-chip-time">{chip.time}</span>}
                {chip.time && <span className="hero-chip-dot">·</span>}
                <span className="hero-chip-title">{chip.title}</span>
              </button>
            ))}
          </div>

          {/* Interactive Floating Prompt Bar */}
          <form
            onSubmit={handleSubmit}
            className={`hero-prompt-bar ${isFocused ? 'is-focused' : ''}`}
          >
            {/* Left side: Twinkle Sparkle + Input / Animated Typewriter */}
            <div className="hero-prompt-input-group">
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                className="hero-sparkle-icon"
              >
                <path
                  d="M10 1 L11.6 8.4 L19 10 L11.6 11.6 L10 19 L8.4 11.6 L1 10 L8.4 8.4 Z"
                  fill="#ffffff"
                />
              </svg>

              <div className="hero-input-wrapper">
                <input
                  type="text"
                  suppressHydrationWarning
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder=""
                  className="hero-prompt-input"
                />

                {!promptText && (
                  <div
                    onClick={() => setIsFocused(true)}
                    className="hero-typewriter-overlay"
                  >
                    <span>{placeholderText || (phrases[0] || 'a week in Lisbon...')}</span>
                    <span className="hero-cursor-blink" />
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Mic button + Action Button */}
            <div className="hero-prompt-actions">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setPromptText(chips[0]?.query || 'Lisbon architectural tour')}
                title="Voice prompt"
                className="hero-mic-btn"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </button>

              <button type="submit" suppressHydrationWarning className="hero-build-btn">
                <span>{heroConfig.buildButtonText || 'Build it'}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </form>

          {/* 7. Live Pulsing Status Beacon */}
          <div className="hero-status-beacon">
            <div className="hero-beacon-dot-wrapper">
              <div className="hero-beacon-ring" />
              <div className="hero-beacon-core" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="hero-beacon-label">{heroConfig.beaconLabel || 'Nomia right now:'}</span>
              <span className="hero-beacon-value">{heroConfig.beaconValue || 'watching the weather shift'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
