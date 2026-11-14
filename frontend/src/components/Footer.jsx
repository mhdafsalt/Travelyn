'use client';

import React from 'react';
import NewsletterSection from '@/components/NewsletterSection';
import './Footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="voyara-footer">
      {/* 1. Newsletter Card Top */}
      <NewsletterSection />

      {/* 2. Middle Row: Brand & Columns */}
      <div className="voyara-footer-content">
        {/* Brand Info */}
        <div className="voyara-footer-brand">
          <a href="/" className="voyara-footer-logo">
            <div className="voyara-footer-logo-mark">V</div>
            <span className="voyara-footer-logo-text">VOYARA</span>
          </a>

          <p className="voyara-footer-tagline">
            Tailor-made journeys to the world’s most extraordinary places — designed slowly, lived fully.
          </p>

          {/* Socials Icons */}
          <div className="voyara-footer-socials">
            {[
              {
                name: 'Instagram',
                href: 'https://instagram.com',
                svg: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#17191c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                ),
              },
              {
                name: 'Pinterest',
                href: 'https://pinterest.com',
                svg: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#17191c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  </svg>
                ),
              },
              {
                name: 'YouTube',
                href: 'https://youtube.com',
                svg: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#17191c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                ),
              },
              {
                name: 'Email',
                href: 'mailto:hello@voyara.travel',
                svg: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#17191c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                ),
              },
            ].map((soc, i) => (
              <a
                key={i}
                href={soc.href}
                target="_blank"
                rel="noreferrer"
                aria-label={soc.name}
                className="voyara-footer-social-btn"
              >
                {soc.svg}
              </a>
            ))}
          </div>
        </div>

        {/* 4 Navigation Columns */}
        <div className="voyara-footer-nav-grid">
          {/* Explore */}
          <div className="voyara-footer-col">
            <div className="voyara-footer-col-title">Explore</div>
            {[
              { label: 'Home', href: '/' },
              { label: 'Destinations', href: '/destinations' },
              { label: 'Experiences', href: '/experiences' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map((link, i) => (
              <a key={i} href={link.href} className="voyara-footer-col-link">
                {link.label}
              </a>
            ))}
          </div>

          {/* Destinations */}
          <div className="voyara-footer-col">
            <div className="voyara-footer-col-title">Destinations</div>
            {[
              { label: 'Santorini', href: '/destinations/santorini' },
              { label: 'Kyoto', href: '/destinations/kyoto' },
              { label: 'Maldives', href: '/destinations/maldives' },
              { label: 'Patagonia', href: '/destinations/patagonia' },
              { label: 'Amalfi Coast', href: '/destinations/amalfi-coast' },
            ].map((link, i) => (
              <a key={i} href={link.href} className="voyara-footer-col-link">
                {link.label}
              </a>
            ))}
          </div>

          {/* Company */}
          <div className="voyara-footer-col">
            <div className="voyara-footer-col-title">Company</div>
            {[
              { label: 'Terms & Conditions', href: '/about' },
              { label: 'Privacy Policy', href: '/about' },
              { label: 'Plan a Journey', href: '/contact' },
              { label: 'Journal', href: '/destinations' },
            ].map((link, i) => (
              <a key={i} href={link.href} className="voyara-footer-col-link">
                {link.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="voyara-footer-col">
            <div className="voyara-footer-col-title">Contact</div>
            <a href="mailto:hello@voyara.travel" className="voyara-footer-col-link">
              hello@voyara.travel
            </a>
            <span className="voyara-footer-col-text">+1 (555) 012 3456</span>
            <span className="voyara-footer-col-text">Mon – Fri · 9am – 6pm</span>
            <span className="voyara-footer-col-text">Lisbon · New York</span>
          </div>
        </div>
      </div>

      {/* 3. Divider Line */}
      <div className="voyara-footer-divider" />

      {/* 4. Bottom Row: Copyright, Credits & Back to Top */}
      <div className="voyara-footer-bottom">
        <div className="voyara-footer-copyright">
          © 2026 Voyara Journeys. All rights reserved.
        </div>
        <div className="voyara-footer-credits">
          Designed with luxury craftsmanship
        </div>

        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          suppressHydrationWarning
          className="voyara-btn voyara-btn-glass voyara-footer-back-to-top"
        >
          <span>Back to top</span>
          <span className="voyara-arrow-circle" style={{ width: '30px', height: '30px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
          </span>
        </button>
      </div>

      {/* 5. Huge Voyara Watermark */}
      <div className="voyara-footer-watermark">
        Voyara
      </div>
    </footer>
  );
}
