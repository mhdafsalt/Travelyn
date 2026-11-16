'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser, getStoredUser } from '../../lib/store';
import '../auth.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = loginUser({ email, password, rememberMe });
      if (result.success) {
        setSuccess(`Welcome back, ${result.user.name}. Redirecting...`);
        setTimeout(() => {
          if (result.user.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        }, 900);
      } else {
        setError(result.error || 'Invalid credentials.');
        setLoading(false);
      }
    }, 600);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotMessage(`A secure recovery link has been dispatched to ${forgotEmail}. Please check your inbox.`);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotMessage('');
        setForgotEmail('');
      }, 3500);
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-split-wrapper">
        {/* Left Side: Cinematic Luxury Visuals */}
        <aside className="auth-visual-panel" aria-label="Travelyn Showcase">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=85"
            alt="Alpine twilight landscape"
            className="auth-visual-backdrop"
          />
          <div className="auth-visual-overlay" />

          {/* Top Brand Tag */}
          <div className="auth-visual-top">
            <Link href="/" className="auth-visual-brand">
              travelyn<span className="dot">.</span>
            </Link>
            <div className="auth-visual-tag">
              <span className="auth-visual-tag-dot" />
              <span>Bespoke Journeys</span>
            </div>
          </div>

          {/* Bottom Floating Story Card */}
          <div className="auth-visual-bottom">
            <div className="auth-testimonial-card">
              <p className="auth-quote-text">
                &ldquo;Slow trains, quiet mountain villages, and the best fondue of our lives. We didn&rsquo;t want to come home.&rdquo;
              </p>
              <div className="auth-quote-author">
                <div className="auth-author-info">
                  <img
                    src="https://framerusercontent.com/images/cwjju4oQ9SWH1nkXN95LfTNt94.jpg"
                    alt="Claire & Tom"
                    className="auth-author-avatar"
                  />
                  <div>
                    <div className="auth-author-name">Claire &amp; Tom</div>
                    <div className="auth-author-trip">Swiss Alps · 2026 Journey</div>
                  </div>
                </div>
                <div className="auth-rating-pill">
                  <span className="star">★</span> 4.9
                </div>
              </div>
            </div>

            <div className="auth-visual-footer">
              <span>EST. 2014 — LISBON ATELIER</span>
              <span>PRIVATE MEMBER ACCESS</span>
            </div>
          </div>
        </aside>

        {/* Right Side: Modern Login Form */}
        <main className="auth-form-panel">
          {/* Top Navigation */}
          <div className="auth-form-top-nav">
            <Link href="/" className="auth-back-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Return to Journeys</span>
            </Link>

            <div className="auth-top-switch">
              New here?
              <Link href="/signup" className="auth-top-switch-link">
                Join Collective
              </Link>
            </div>
          </div>

          {/* Mobile Brand */}
          <div className="auth-mobile-brand">
            <Link href="/">
              travelyn<strong>.</strong>
            </Link>
          </div>

          {/* Main Card Body */}
          <div className="auth-card-body">
            <div className="auth-header-block">
              <div className="auth-pill-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
                <span>Member Portal</span>
              </div>
              <h1 className="auth-headline">Welcome back</h1>
              <p className="auth-subhead">
                Sign in to manage your itineraries, private requests, and direct concierge service.
              </p>
            </div>

            {/* Notification Alerts */}
            {error && (
              <div className="auth-alert error" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="auth-alert success" role="status">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-field-group">
                <label className="auth-label" htmlFor="login-email">
                  Email Address
                </label>
                <div className="auth-input-wrapper">
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    className={`auth-input ${error && !email ? 'has-error' : ''}`}
                  />
                  <div className="auth-input-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="auth-field-group">
                <div className="auth-field-label-row">
                  <label className="auth-label" htmlFor="login-password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="auth-forgot-link"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="auth-input-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className={`auth-input ${error && !password ? 'has-error' : ''}`}
                  />
                  <div className="auth-input-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-eye-btn"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <label className="auth-checkbox-row">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="auth-checkbox-input"
                />
                <span className="auth-checkbox-box">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="auth-checkbox-label">Keep me signed in on this device</span>
              </label>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="auth-submit-btn"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Travelyn'}</span>
                <span className="auth-btn-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </button>
            </form>
          </div>

          {/* Form Footer */}
          <footer className="auth-form-footer">
            <Link href="/about">About Atelier</Link>
            <span>·</span>
            <Link href="/contact">Concierge</Link>
            <span>·</span>
            <a href="#terms">Terms &amp; Privacy</a>
          </footer>
        </main>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="auth-modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="auth-modal-close"
              aria-label="Close modal"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="auth-modal-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h3 className="auth-modal-title">Password Recovery</h3>
            <p className="auth-modal-desc">
              Enter the email associated with your Travelyn membership. We will send a private link to reset your key.
            </p>

            {forgotMessage ? (
              <div className="auth-alert success" style={{ margin: '16px 0' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{forgotMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="auth-form">
                <div className="auth-field-group">
                  <label className="auth-label" htmlFor="forgot-email">
                    Member Email
                  </label>
                  <div className="auth-input-wrapper">
                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="auth-input"
                    />
                    <div className="auth-input-icon">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="auth-submit-btn"
                  style={{ marginTop: '12px' }}
                >
                  <span>{forgotLoading ? 'Dispatching...' : 'Send Recovery Link'}</span>
                  <span className="auth-btn-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
