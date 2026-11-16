'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getStoredUser, logoutUser } from '../lib/store';
import './Navbar.css';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  // Load and subscribe to auth changes
  useEffect(() => {
    setCurrentUser(getStoredUser());
    const handleAuthChange = (e) => {
      setCurrentUser(e.detail || null);
    };
    window.addEventListener('travelyn_auth_changed', handleAuthChange);
    return () => window.removeEventListener('travelyn_auth_changed', handleAuthChange);
  }, []);

  // Smart Hide on Scroll Down, Reveal on Scroll Up
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Always visible at the very top of the page
          if (currentScrollY <= 20) {
            setIsVisible(true);
            setIsScrolled(false);
            lastScrollY.current = currentScrollY;
            ticking = false;
            return;
          }

          // Dark frosted glass state after scrolling past 40px
          setIsScrolled(currentScrollY > 40);

          const diff = currentScrollY - lastScrollY.current;
          const THRESHOLD = 6; // Ignore micro-jitters

          if (Math.abs(diff) > THRESHOLD) {
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
              // Scrolling down past top hero threshold -> hide navbar
              setIsVisible(false);
            } else if (currentScrollY < lastScrollY.current) {
              // Scrolling up -> reveal navbar
              setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when overlay menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { num: '01', label: 'Home', href: '/' },
    { num: '02', label: 'Destinations', href: '/destinations' },
    { num: '03', label: 'Curated Experiences', href: '/experiences' },
    { num: '04', label: 'AI Journey Planner', href: '/ai-planner' },
    { num: '05', label: 'About Travelyn', href: '/about' },
    { num: '06', label: 'Plan a Journey', href: '/contact' },
  ];

  if (pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <>
      {/* Two-Sided Minimal Header */}
      <header
        className={`travelyn-navbar ${isScrolled ? 'is-scrolled' : ''} ${!isVisible && !menuOpen ? 'is-hidden' : ''} ${menuOpen ? 'is-menu-open' : ''}`}
      >
        <div className="travelyn-navbar-inner">
          {/* Left: Brand Name with Trailing Dot */}
          <a href="/" className="travelyn-brand" aria-label="Travelyn Home">
            <span className="travelyn-brand-text">travelyn</span>
            <span className="travelyn-brand-dot">.</span>
          </a>

          {/* Right: AI Planner, Auth Action & MENU Button */}
          <div className="travelyn-navbar-actions">
            <a
              href="/ai-planner"
              className={`travelyn-nav-ai-btn ${pathname === '/ai-planner' ? 'is-active' : ''}`}
              title="AI Automatic Travel Planner"
            >
              <span className="travelyn-ai-sparkle">✦</span>
              <span>AI Planner</span>
              <span className="travelyn-cta-arrow">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </a>

            {currentUser ? (
              <a
                href={currentUser.role === 'admin' ? '/admin' : '#'}
                onClick={(e) => {
                  if (currentUser.role !== 'admin') {
                    e.preventDefault();
                    setMenuOpen(true);
                  }
                }}
                className="travelyn-nav-auth-btn"
                title={`Signed in as ${currentUser.name}`}
              >
                <span className="travelyn-nav-user-avatar">
                  {currentUser.name ? currentUser.name.trim().charAt(0).toUpperCase() : 'U'}
                </span>
                <span>{currentUser.name ? currentUser.name.split(' ')[0] : 'Member'}</span>
              </a>
            ) : (
              <a href="/login" className="travelyn-nav-auth-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Sign In</span>
              </a>
            )}

            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setMenuOpen(!menuOpen)}
              className={`travelyn-menu-btn ${menuOpen ? 'is-active' : ''}`}
              aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={menuOpen}
            >
              <span className="travelyn-menu-label">
                {menuOpen ? 'CLOSE' : 'MENU'}
              </span>
              <span className="travelyn-menu-icon" aria-hidden="true">
                <span className="travelyn-icon-bar top-bar" />
                <span className="travelyn-icon-bar bottom-bar" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Luxury Fullscreen Navigation Drawer / Overlay */}
      <div
        className={`travelyn-overlay-menu ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div
          className="travelyn-overlay-backdrop"
          onClick={() => setMenuOpen(false)}
        />

        <div className="travelyn-overlay-content">
          {/* Top Row: Perfectly Aligns With Navbar */}
          <div className="travelyn-overlay-header">
            <a
              href="/"
              onClick={() => setMenuOpen(false)}
              className="travelyn-brand"
              aria-label="Travelyn Home"
            >
              <span className="travelyn-brand-text">travelyn</span>
              <span className="travelyn-brand-dot">.</span>
            </a>

            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setMenuOpen(false)}
              className="travelyn-menu-btn is-active"
              aria-label="Close Navigation Menu"
            >
              <span className="travelyn-menu-label">CLOSE</span>
              <span className="travelyn-menu-icon" aria-hidden="true">
                <span className="travelyn-icon-bar top-bar" />
                <span className="travelyn-icon-bar bottom-bar" />
              </span>
            </button>
          </div>

          {/* Quick Actions inside Hamburger Menu */}
          <div className="travelyn-overlay-quick-actions">
            <a
              href="/ai-planner"
              onClick={() => setMenuOpen(false)}
              className="travelyn-overlay-ai-btn"
            >
              <span className="travelyn-ai-sparkle">✦</span>
              <span>AI Journey Planner</span>
              <span className="travelyn-cta-arrow">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </a>

            {currentUser ? (
              <a
                href={currentUser.role === 'admin' ? '/admin' : '#'}
                onClick={(e) => {
                  if (currentUser.role !== 'admin') {
                    e.preventDefault();
                  } else {
                    setMenuOpen(false);
                  }
                }}
                className="travelyn-overlay-auth-btn"
              >
                <span className="travelyn-nav-user-avatar">
                  {currentUser.name ? currentUser.name.trim().charAt(0).toUpperCase() : 'U'}
                </span>
                <span>{currentUser.name ? currentUser.name.split(' ')[0] : 'Member'}</span>
              </a>
            ) : (
              <a
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="travelyn-overlay-auth-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Sign In</span>
              </a>
            )}
          </div>

          {/* Main Overlay Body: Nav Links & Curated Details */}
          <div className="travelyn-overlay-grid">
            {/* Primary Nav Links */}
            <div className="travelyn-links-col">
              <span className="travelyn-section-tag">NAVIGATION</span>
              <nav className="travelyn-nav-list">
                {navLinks.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`travelyn-nav-anchor ${isActive ? 'is-active' : ''}`}
                    >
                      <span className="travelyn-nav-num">{item.num}</span>
                      <span className="travelyn-nav-title">{item.label}</span>
                      <span className="travelyn-nav-arrow" aria-hidden="true">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Right Side Info & Quick Contact */}
            <div className="travelyn-details-col">
              {/* Member Lounge Card */}
              {currentUser ? (
                <div className="travelyn-member-card">
                  <div className="travelyn-member-header">
                    <div className="travelyn-member-avatar">
                      {currentUser.name ? currentUser.name.trim().charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="travelyn-member-name">{currentUser.name}</div>
                      <div className="travelyn-member-tier">{currentUser.tier || 'Voyager Member'}</div>
                    </div>
                  </div>
                  <div className="travelyn-member-actions">
                    {currentUser.role === 'admin' && (
                      <a
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="travelyn-member-link"
                      >
                        Admin Studio →
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        logoutUser();
                        setMenuOpen(false);
                      }}
                      className="travelyn-member-logout-btn"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="travelyn-member-guest-card">
                  <div className="travelyn-member-guest-title">Member Access</div>
                  <p className="travelyn-member-guest-desc">
                    Sign in to access bespoke itineraries and dedicated concierge services.
                  </p>
                  <div className="travelyn-member-guest-btns">
                    <a
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="travelyn-member-signin-link"
                    >
                      Sign In
                    </a>
                    <a
                      href="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="travelyn-member-signup-link"
                    >
                      Join Collective
                    </a>
                  </div>
                </div>
              )}

              <div className="travelyn-details-card">
                <span className="travelyn-section-tag">BESPOKE TRAVEL</span>
                <h3 className="travelyn-card-headline">
                  Say it once. We build the trip.
                </h3>
                <p className="travelyn-card-desc">
                  Curated luxury itineraries shaped in real time around weather, pace, and rhythm. Designed for extraordinary global exploration.
                </p>
                <a
                  href="/ai-planner"
                  onClick={() => setMenuOpen(false)}
                  className="travelyn-plan-cta"
                  title="Launch AI Journey Planner"
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#d97706', fontSize: '13px' }}>✦</span>
                    <span>AI Journey Planner</span>
                  </span>
                  <span className="travelyn-cta-arrow">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </a>
              </div>

              <div className="travelyn-contact-block">
                <div className="travelyn-contact-unit">
                  <span className="travelyn-contact-label">Direct Concierge</span>
                  <a
                    href="mailto:concierge@travelyn.com"
                    className="travelyn-contact-val"
                  >
                    concierge@travelyn.com
                  </a>
                </div>

                <div className="travelyn-contact-unit">
                  <span className="travelyn-contact-label">Follow Us</span>
                  <div className="travelyn-social-links">
                    <a href="#instagram" className="travelyn-social-tag">Instagram</a>
                    <span className="travelyn-dot-sep">/</span>
                    <a href="#twitter" className="travelyn-social-tag">Twitter</a>
                    <span className="travelyn-dot-sep">/</span>
                    <a href="#linkedin" className="travelyn-social-tag">LinkedIn</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
