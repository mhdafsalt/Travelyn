
'use client';

import React from 'react';
import {
  LuCompass,
  LuTreePalm,
  LuMountain,
  LuGlobe,
  LuHeart,
  LuSend,
  LuShieldCheck,
  LuStar,
} from 'react-icons/lu';

import './CategoryBar.css';

export default function CategoryBar({
  selectedCategory,
  onSelectCategory,
}) {
  const categories = [
    { id: 'trending', name: 'Trending', icon: LuCompass },
    { id: 'islands', name: 'Islands', icon: LuTreePalm },
    { id: 'nature', name: 'Nature', icon: LuMountain },
    { id: 'culture', name: 'Culture', icon: LuGlobe },
    { id: 'romantic', name: 'Romantic', icon: LuHeart },
    { id: 'adventure', name: 'Adventure', icon: LuSend },
    { id: 'wellness', name: 'Wellness', icon: LuShieldCheck },
    { id: 'luxury', name: 'Luxury', icon: LuStar },
  ];

  return (
    <div className="category-bar-wrapper">
      <div className="category-bar-tabs">
        {categories.map((cat) => {
          const isActive =
            selectedCategory?.toLowerCase() === cat.id;

          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`category-tab-btn ${
                isActive ? 'is-active' : ''
              }`}
              aria-pressed={isActive}
            >
              <div className="category-tab-icon">
                <Icon size={19} strokeWidth={1.7} />
              </div>

              <span className="category-tab-label">
                {cat.name}
              </span>

              <div className="category-tab-underline" />
            </button>
          );
        })}
      </div>

      <div className="category-bar-divider" />
    </div>
  );
}
