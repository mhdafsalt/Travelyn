'use client';

import React, { useState } from 'react';
import { subscribeNewsletter } from '@/lib/api';
import './NewsletterSection.css';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    const res = await subscribeNewsletter(email);
    if (res.success) {
      setStatus('success');
      setMessage(res.message);
      setEmail('');
    } else {
      setStatus('error');
      setMessage(res.message || 'Subscription failed. Please try again.');
    }
  };

  return (
    <div className="newsletter-wrapper">
      {/* Left Column: Heading and Text */}
      <div className="newsletter-left">
        <div className="newsletter-eyebrow">Newsletter</div>

        <h3 className="newsletter-heading">
          Stories worth <span className="newsletter-heading-muted">travelling</span> for
        </h3>

        <p className="newsletter-description">
          Monthly inspiration, hidden places and early access to new journeys. No spam, ever.
        </p>
      </div>

      {/* Right Column: Form */}
      <div className="newsletter-right">
        <form onSubmit={handleSubmit} className="newsletter-form">
          <div className="newsletter-input-wrap">
            <input
              type="email"
              suppressHydrationWarning
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Your email address"
              className="newsletter-input"
            />
          </div>

          <button
            type="submit"
            suppressHydrationWarning
            disabled={status === 'loading'}
            className="newsletter-submit-btn"
          >
            <span>{status === 'loading' ? 'Joining...' : 'Subscribe'}</span>
            <span className="newsletter-submit-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </span>
          </button>
        </form>

        {message && (
          <div className={`newsletter-msg ${status === 'success' ? 'is-success' : 'is-error'}`}>
            {message}
          </div>
        )}

        <div className="newsletter-disclaimer">
          By subscribing you agree to our Privacy Policy.
        </div>
      </div>
    </div>
  );
}
