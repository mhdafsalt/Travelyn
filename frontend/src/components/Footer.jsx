'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NewsletterSection from '@/components/NewsletterSection';
import { getStoredDestinations } from '@/lib/store';
import './Footer.css';

export default function Footer() {
  const pathname = usePathname();
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const load = () => {
      try {
        const stored = getStoredDestinations();
        if (Array.isArray(stored) && stored.length > 0) {
          setDestinations(stored.slice(0, 5));
        }
      } catch (err) {}
    };

    load();
    window.addEventListener('travelyn_destinations_updated', load);
    window.addEventListener('storage', load);

    return () => {
      window.removeEventListener('travelyn_destinations_updated', load);
      window.removeEventListener('storage', load);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <footer className="voyara-footer">
      {/* 1. Newsletter Card Top */}
      <NewsletterSection />

      {/* 2. Middle Row: Brand & Columns */}
      <div className="voyara-footer-content">
        {/* Brand Info */}
        <div className="voyara-footer-brand">
          <a href="/" className="voyara-footer-logo">
            <div className="voyara-footer-logo-mark">T</div>
            <span className="voyara-footer-logo-text">TRAVELYN</span>
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
                href: 'mailto:hello@travelyn.com',
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
              { label: 'AI Planner', href: '/ai-planner' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map((link, i) => (
              <a key={i} href={link.href} className="voyara-footer-col-link">
                {link.label}
              </a>
            ))}
          </div>

          {/* Dynamic Destinations Column */}
          <div className="voyara-footer-col">
            <div className="voyara-footer-col-title">Destinations</div>
            {destinations.length > 0 ? (
              destinations.map((d) => (
                <a
                  key={d.id || d.slug}
                  href={`/destinations/${d.slug}`}
                  className="voyara-footer-col-link"
                >
                  {d.title}
                </a>
              ))
            ) : (
              <a href="/destinations" className="voyara-footer-col-link">
                All Destinations
              </a>
            )}
            <a
              href="/destinations"
              className="voyara-footer-col-link"
              style={{ opacity: 0.75, fontSize: '12.5px', marginTop: '2px' }}
            >
              View All Destinations →
            </a>
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
            <a href="mailto:hello@travelyn.com" className="voyara-footer-col-link">
              hello@travelyn.com
            </a>
            <span className="voyara-footer-col-text">+1 (555) 012 3456</span>
            <span className="voyara-footer-col-text">Mon – Fri · 9am – 6pm</span>
            <span className="voyara-footer-col-text">Kerala · India</span>
          </div>
        </div>
      </div>

      {/* 3. Divider Line */}
      <div className="voyara-footer-divider" />

      {/* 4. Bottom Row: Copyright, Credits & Back to Top */}
      <div className="voyara-footer-bottom">
        <div className="voyara-footer-copyright">
          © 2026 Travelyn. All rights reserved.
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
        Travelyn
      </div>
    </footer>
  );
}
