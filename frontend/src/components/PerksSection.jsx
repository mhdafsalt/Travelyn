'use client';

import React from 'react';
import './PerksSection.css';

export default function PerksSection() {
  const perks = [
    {
      title: 'Free changes',
      description: 'Up to 60 days before',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: 'Pay in 3',
      description: 'Interest-free',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
    },
    {
      title: 'Price promise',
      description: 'Best rate, always',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      title: '24/7 concierge',
      description: 'Real people, any time',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="perks-section-wrapper">
      <div className="perks-card-grid">
        {perks.map((perk, index) => (
          <div key={index} className="perk-item">
            <div className="perk-icon-circle">{perk.icon}</div>
            <div className="perk-info">
              <div className="perk-title">{perk.title}</div>
              <div className="perk-description">{perk.description}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
