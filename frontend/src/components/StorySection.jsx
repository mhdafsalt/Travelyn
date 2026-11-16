'use client';

import React, { useState, useEffect } from 'react';
import './StorySection.css';
import { getStoredStorySettings, DEFAULT_STORY_SETTINGS } from '@/lib/store';

export default function StorySection() {
  const [storyConfig, setStoryConfig] = useState(DEFAULT_STORY_SETTINGS);

  useEffect(() => {
    const loadSettings = () => {
      setStoryConfig(getStoredStorySettings());
    };

    loadSettings();

    const handleUpdate = (e) => {
      if (e.detail) {
        setStoryConfig(e.detail);
      } else {
        loadSettings();
      }
    };

    window.addEventListener('travelyn_stories_updated', handleUpdate);
    window.addEventListener('storage', loadSettings);

    return () => {
      window.removeEventListener('travelyn_stories_updated', handleUpdate);
      window.removeEventListener('storage', loadSettings);
    };
  }, []);

  const stories = storyConfig.stories && storyConfig.stories.length > 0
    ? storyConfig.stories
    : DEFAULT_STORY_SETTINGS.stories;

  return (
    <section className="story-section-wrapper" id="stories-section" suppressHydrationWarning>
      {/* Header with Tag and Dual Headline */}
      <div className="story-header">
        <div className="voyara-tag">
          <div className="voyara-dot" />
          <span>{storyConfig.sectionTag || 'Swiss Alps'}</span>
        </div>

        <h2 className="story-header-title">
          {storyConfig.titlePrimary || 'Feel the mountains'}
          <br />
          <span className="story-header-muted">{storyConfig.titleMuted || 'before you go'}</span>
        </h2>
      </div>

      {/* Dynamic Stories List */}
      {stories.map((story, index) => {
        const isReversed = story.reversed !== undefined ? story.reversed : (index % 2 !== 0);

        return (
          <div key={story.id || index} className={`story-row ${isReversed ? 'is-reversed' : ''}`}>
            {/* Story Photo */}
            <div className="story-photo-box">
              <img
                src={story.imageUrl || "https://framerusercontent.com/images/8guYiCRSdUDmndFojnqAvFpGNk.jpg"}
                alt={story.title || "Story photo"}
                className="story-photo-img"
                loading="lazy"
                onError={(e) => {
                  e.target.style.opacity = '0.4';
                }}
              />
            </div>

            {/* Story Text */}
            <div className="story-text-col">
              <div className="voyara-tag">
                <div className="voyara-dot" />
                <span>{story.tag || storyConfig.sectionTag || 'Swiss Alps'}</span>
              </div>

              <h3 className="story-title">{story.title}</h3>

              <p className="story-description">
                {story.description}
              </p>

              <a href={story.link || '/destinations/swiss-alps'} className="voyara-btn voyara-btn-light">
                <span>{story.buttonText || `Discover ${story.tag || storyConfig.sectionTag || 'Swiss Alps'}`}</span>
                <span className="voyara-arrow-circle">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7" />
                    <path d="M8 7h9v9" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        );
      })}
    </section>
  );
}
