'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser, getStoredUser, getStoredAuthShowcaseSettings, DEFAULT_AUTH_SHOWCASE_SETTINGS } from '../../lib/store';
import { fetchAuthShowcase, registerApi } from '../../lib/api';
import '../auth.css';

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showcase, setShowcase] = useState(DEFAULT_AUTH_SHOWCASE_SETTINGS.signup);

  // Load dynamic auth showcase settings
  useEffect(() => {
    const loadSettings = () => {
      try {
        const stored = getStoredAuthShowcaseSettings();
        if (stored?.signup) {
          setShowcase(stored.signup);
        }
      } catch (err) {
        console.error('Failed to load signup showcase settings:', err);
      }
    };

    loadSettings();

    // Also fetch fresh settings from MongoDB Atlas
    fetchAuthShowcase().then((data) => {
      if (data?.signup) {
        setShowcase(data.signup);
      }
    }).catch(() => {});

    const handleUpdate = (e) => {
      if (e.detail?.signup) {
        setShowcase(e.detail.signup);
      } else {
        loadSettings();
      }
    };

    window.addEventListener('travelyn_auth_showcase_updated', handleUpdate);
    window.addEventListener('storage', loadSettings);
    return () => {
      window.removeEventListener('travelyn_auth_showcase_updated', handleUpdate);
      window.removeEventListener('storage', loadSettings);
    };
  }, []);

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

  // Compute password strength (1 to 4)
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', colorClass: '' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd) || /[A-Z]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', colorClass: 'weak' };
      case 2:
        return { score: 2, label: 'Fair', colorClass: 'fair' };
      case 3:
        return { score: 3, label: 'Good', colorClass: 'good' };
      case 4:
        return { score: 4, label: 'Strong', colorClass: 'strong' };
      default:
        return { score: 1, label: 'Weak', colorClass: 'weak' };
    }
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept the Terms of Service to continue.');
      return;
    }

    setLoading(true);

    try {
      const apiRes = await registerApi({
        name: fullName,
        email: email,
        password: password
      });
      if (apiRes) {
        if (apiRes.success && apiRes.user) {
          setSuccess(`Welcome to Travelyn, ${apiRes.user.name}! Preparing your bespoke space...`);
          setTimeout(() => {
            router.push('/');
          }, 900);
          return;
        } else {
          setError(apiRes.error || 'Registration failed. Please check your details.');
          setLoading(false);
          return;
        }
      }
    } catch {
      // Offline fallback
    }

    const result = registerUser({
      name: fullName,
      email: email,
      password: password
    });

    if (result.success) {
      setSuccess(`Welcome to Travelyn, ${result.user.name}! Preparing your bespoke space...`);
      setTimeout(() => {
        router.push('/');
      }, 900);
    } else {
      setError(result.error || 'Registration failed.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" suppressHydrationWarning>
      <div className="auth-split-wrapper">
        {/* Left Side: Editorial Visual Showcase */}
        <aside className="auth-visual-panel" aria-label="Travelyn Showcase">
          <img
            src={showcase.backdropImageUrl || DEFAULT_AUTH_SHOWCASE_SETTINGS.signup.backdropImageUrl}
            alt={showcase.authorTrip || "Luxury destination landscape"}
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
              <span>{showcase.tagText || "Private Collective"}</span>
            </div>
          </div>

          {/* Bottom Floating Story Card */}
          <div className="auth-visual-bottom">
            <div className="auth-testimonial-card">
              <p className="auth-quote-text">
                &ldquo;{showcase.quote}&rdquo;
              </p>
              <div className="auth-quote-author">
                <div className="auth-author-info">
                  <img
                    src={showcase.authorAvatarUrl || DEFAULT_AUTH_SHOWCASE_SETTINGS.signup.authorAvatarUrl}
                    alt={showcase.authorName || "Traveller"}
                    className="auth-author-avatar"
                  />
                  <div>
                    <div className="auth-author-name">{showcase.authorName}</div>
                    <div className="auth-author-trip">{showcase.authorTrip}</div>
                  </div>
                </div>
                <div className="auth-rating-pill">
                  <span className="star">★</span> {showcase.rating || "4.9"}
                </div>
              </div>
            </div>

            <div className="auth-visual-footer">
              <span>{showcase.footerLeft || "GLOBAL BESPOKE NETWORK"}</span>
              <span>{showcase.footerRight || "100% PRIVATE & SECURE"}</span>
            </div>
          </div>
        </aside>

        {/* Right Side: Modern Registration Form */}
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
              Already a member?
              <Link href="/login" className="auth-top-switch-link">
                Sign In
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
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>Private Collective</span>
              </div>
              <h1 className="auth-headline">Join Travelyn</h1>
              <p className="auth-subhead">
                Create an account to save curated routes, receive seasonal dispatches, and request tailored journeys.
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="auth-form" noValidate suppressHydrationWarning>
              <div className="auth-field-group">
                <label className="auth-label" htmlFor="signup-name">
                  Full Name
                </label>
                <div className="auth-input-wrapper">
                  <input
                    id="signup-name"
                    type="text"
                    suppressHydrationWarning
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Clara Delacroix"
                    autoComplete="name"
                    required
                    className={`auth-input ${error && !fullName ? 'has-error' : ''}`}
                  />
                  <div className="auth-input-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-label" htmlFor="signup-email">
                  Email Address
                </label>
                <div className="auth-input-wrapper">
                  <input
                    id="signup-email"
                    type="email"
                    suppressHydrationWarning
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
                <label className="auth-label" htmlFor="signup-password">
                  Password
                </label>
                <div className="auth-input-wrapper">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    suppressHydrationWarning
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
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
                    suppressHydrationWarning
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
                        <circle cx="12" cy="7" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Live Password Strength Meter */}
                {password && (
                  <div className="auth-strength-box">
                    <div className="auth-strength-bars">
                      <div className={`auth-strength-segment ${strength.score >= 1 ? `is-active ${strength.colorClass}` : ''}`} />
                      <div className={`auth-strength-segment ${strength.score >= 2 ? `is-active ${strength.colorClass}` : ''}`} />
                      <div className={`auth-strength-segment ${strength.score >= 3 ? `is-active ${strength.colorClass}` : ''}`} />
                      <div className={`auth-strength-segment ${strength.score >= 4 ? `is-active ${strength.colorClass}` : ''}`} />
                    </div>
                    <div className="auth-strength-text">
                      <span>Security: <strong>{strength.label}</strong></span>
                      {strength.score < 3 && <span>Add numbers or symbols</span>}
                    </div>
                  </div>
                )}
              </div>

              <div className="auth-field-group">
                <label className="auth-label" htmlFor="signup-confirm">
                  Confirm Password
                </label>
                <div className="auth-input-wrapper">
                  <input
                    id="signup-confirm"
                    type={showPassword ? 'text' : 'password'}
                    suppressHydrationWarning
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    required
                    className={`auth-input ${confirmPassword && password !== confirmPassword ? 'has-error' : ''}`}
                  />
                  <div className="auth-input-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Terms & Privacy Checkbox */}
              <label className="auth-checkbox-row">
                <input
                  type="checkbox"
                  suppressHydrationWarning
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="auth-checkbox-input"
                />
                <span className="auth-checkbox-box">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="auth-checkbox-label">
                  I agree to Travelyn&rsquo;s <a href="#terms">Terms of Service</a> and <a href="#privacy">Concierge Privacy Policy</a>.
                </span>
              </label>

              {/* Submit CTA */}
              <button
                type="submit"
                suppressHydrationWarning
                disabled={loading}
                className="auth-submit-btn"
              >
                <span>{loading ? 'Creating Membership...' : 'Create Member Account'}</span>
                <span className="auth-btn-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="5" y2="12" />
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
    </div>
  );
}
