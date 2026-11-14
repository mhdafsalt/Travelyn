'use client';

import React, { useState, useEffect } from 'react';
import { IMMERSIVE_SLIDES } from '@/lib/data';
import './ImmersiveSlider.css';

export default function ImmersiveSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const SLIDE_DURATION_MS = 6500;

  const currentSlide = IMMERSIVE_SLIDES[currentIndex];

  useEffect(() => {
    setProgress(0);
    const intervalTime = 50;
    const increment = (intervalTime / SLIDE_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % IMMERSIVE_SLIDES.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleSelectSlide = (idx) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  return (
    <section className="immersive-slider-section">
      {/* Background Images with Crossfade and Subtle Ken Burns Zoom */}
      {IMMERSIVE_SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          className="immersive-slide-bg-wrap"
          style={{
            opacity: idx === currentIndex ? 1 : 0,
            zIndex: idx === currentIndex ? 1 : 0,
          }}
        >
          <div
            className={`immersive-slide-bg ${idx === currentIndex ? 'is-active' : 'is-inactive'}`}
            style={{ backgroundImage: `url(${slide.bgUrl})` }}
          />
        </div>
      ))}

      {/* Atmospheric Vignette and Gradients */}
      <div className="immersive-overlay-vignette" />
      <div className="immersive-overlay-horiz" />
      <div className="immersive-overlay-top-fade" />
      <div className="immersive-overlay-bottom-fade" />

      {/* Main Content Overlay */}
      <div className="immersive-content-overlay">
        <div className="immersive-content-container">
          <div className="immersive-eyebrow">
            Where does your heart want to wake up?
          </div>

          <div className="immersive-text-block">
            <div className="immersive-location">{currentSlide.location}</div>
            <h2 className="immersive-title">{currentSlide.title}</h2>
            <p className="immersive-description">{currentSlide.description}</p>

            <a href={currentSlide.link} className="immersive-cta-btn">
              <span>{currentSlide.linkText}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Tabs with Progress Bars */}
      <div className="immersive-tabs-row">
        <div className="immersive-tabs-container">
          {IMMERSIVE_SLIDES.map((slide, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={slide.id}
                suppressHydrationWarning
                onClick={() => handleSelectSlide(idx)}
                aria-label={slide.tab}
                className={`immersive-tab-btn ${isSelected ? 'is-active' : ''}`}
              >
                <span className="immersive-tab-track">
                  {isSelected && (
                    <span
                      className="immersive-tab-progress"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </span>
                <span className="immersive-tab-label">{slide.tab}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
