'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { submitContact } from '@/lib/api';
import { INITIAL_DESTINATIONS } from '@/lib/data';
import { getStoredDestinations } from '@/lib/store';

function ContactContent() {
  const searchParams = useSearchParams();

  const [destinations, setDestinations] = useState(INITIAL_DESTINATIONS);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destinationPreference, setDestinationPreference] = useState('Swiss Alps, Switzerland');
  const [travelDates, setTravelDates] = useState('');
  const [budgetRange, setBudgetRange] = useState('₹50,000 – ₹1,50,000 per person');
  const [guestCount, setGuestCount] = useState(2);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [statusMessage, setStatusMessage] = useState('');
  const [lastSubmission, setLastSubmission] = useState(null);

  // Dynamic Destinations loading & real-time sync with admin store
  const refreshDestinations = () => {
    try {
      const stored = getStoredDestinations();
      if (Array.isArray(stored) && stored.length > 0) {
        setDestinations(stored);
      }
    } catch (err) {
      console.warn('Failed to refresh destinations in contact form:', err);
    }
  };

  useEffect(() => {
    refreshDestinations();

    window.addEventListener('travelyn_destinations_updated', refreshDestinations);
    window.addEventListener('storage', refreshDestinations);

    return () => {
      window.removeEventListener('travelyn_destinations_updated', refreshDestinations);
      window.removeEventListener('storage', refreshDestinations);
    };
  }, []);

  // Pre-select destination from URL search params (?destination=... or ?slug=... or ?q=...)
  useEffect(() => {
    if (!searchParams || destinations.length === 0) return;
    const queryDest =
      searchParams.get('destination') ||
      searchParams.get('dest') ||
      searchParams.get('slug') ||
      searchParams.get('package') ||
      searchParams.get('q');

    if (queryDest) {
      const q = queryDest.toLowerCase().trim();
      const match = destinations.find(
        (d) =>
          d.slug.toLowerCase() === q ||
          d.title.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q)
      );

      if (match) {
        setDestinationPreference(`${match.title}, ${match.country}`);
      } else {
        setDestinationPreference(queryDest);
      }
    }
  }, [searchParams, destinations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setStatusMessage('Please fill in your name, email, and travel vision message.');
      return;
    }

    setStatus('loading');
    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      destinationPreference,
      travelDates: travelDates.trim(),
      budgetRange,
      guestCount,
      message: message.trim(),
      source: 'Tailor-Made Concierge Form',
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await submitContact(payload);
      if (res.success) {
        setStatus('success');
        setStatusMessage(
          res.message ||
            'Thank you for reaching out to Travelyn. Your personal travel designer will review your desires and deliver a bespoke itinerary within 24 hours.'
        );
        setLastSubmission(payload);
      } else {
        setStatus('error');
        setStatusMessage(res.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setStatusMessage(err.message || 'Unable to submit your inquiry at this moment.');
    }
  };

  const handleResetForm = () => {
    setStatus('idle');
    setStatusMessage('');
    setMessage('');
    setTravelDates('');
  };

  return (
    <div style={{ backgroundColor: '#faf9f6', minHeight: '100vh', padding: '110px 16px 80px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '44px' }}>
        {/* Curated Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="voyara-tag">
            <div className="voyara-dot" />
            <span>Tailor-Made Concierge</span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5.5vw, 72px)',
              fontWeight: 500,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: '#1e262a',
              margin: 0,
            }}
          >
            Plan your next story
          </h1>
          <p style={{ fontSize: '16.5px', lineHeight: 1.6, color: 'rgba(30, 38, 42, 0.7)', maxWidth: '640px', margin: 0 }}>
            Share your dreams, timings, and travel desires. Our dedicated travel designers will craft a bespoke itinerary suited to your pace.
          </p>
        </div>

        {/* Split Grid Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '32px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Interactive Form */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: 'clamp(24px, 4vw, 40px)',
              border: '1px solid rgba(13, 13, 13, 0.08)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.04)',
              boxSizing: 'border-box',
            }}
          >
            {status === 'success' ? (
              <div style={{ padding: '30px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(47, 133, 90, 0.12)',
                    color: '#2f855a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>

                <h3 style={{ fontSize: '26px', fontWeight: 600, color: '#17191c', margin: 0 }}>
                  Inquiry Received
                </h3>

                <p style={{ fontSize: '15.5px', lineHeight: 1.6, color: 'rgba(30, 38, 42, 0.72)', maxWidth: '440px', margin: 0 }}>
                  {statusMessage}
                </p>

                {lastSubmission && (
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '440px',
                      backgroundColor: '#faf9f6',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      textAlign: 'left',
                      border: '1px solid rgba(23, 25, 28, 0.08)',
                      fontSize: '13.5px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      color: '#4a5568',
                    }}
                  >
                    <div><strong>Destination:</strong> {lastSubmission.destinationPreference}</div>
                    <div><strong>Guests:</strong> {lastSubmission.guestCount} Travelers</div>
                    <div><strong>Timing:</strong> {lastSubmission.travelDates || 'Flexible / To be confirmed'}</div>
                    <div><strong>Budget:</strong> {lastSubmission.budgetRange}</div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
                  <a href="/destinations" className="voyara-btn voyara-btn-dark">
                    <span>Explore All Journeys</span>
                    <span className="voyara-arrow-circle">→</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="voyara-btn"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(23, 25, 28, 0.2)',
                      color: '#17191c',
                      cursor: 'pointer',
                    }}
                  >
                    <span>Send Another Request</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Name & Email */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e262a', marginBottom: '8px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sebastian Cruz"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        height: '48px',
                        padding: '0 18px',
                        borderRadius: '14px',
                        border: '1px solid rgba(13, 13, 13, 0.12)',
                        backgroundColor: 'rgba(13, 13, 13, 0.02)',
                        fontSize: '15px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e262a', marginBottom: '8px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sebastian@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        height: '48px',
                        padding: '0 18px',
                        borderRadius: '14px',
                        border: '1px solid rgba(13, 13, 13, 0.12)',
                        backgroundColor: 'rgba(13, 13, 13, 0.02)',
                        fontSize: '15px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Dynamic Destination of Interest & Guests */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e262a', marginBottom: '8px' }}>
                      Destination of Interest
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={destinationPreference}
                        onChange={(e) => setDestinationPreference(e.target.value)}
                        style={{
                          width: '100%',
                          height: '48px',
                          padding: '0 36px 0 16px',
                          borderRadius: '14px',
                          border: '1px solid rgba(13, 13, 13, 0.12)',
                          backgroundColor: 'rgba(13, 13, 13, 0.02)',
                          fontSize: '14.5px',
                          color: '#1e262a',
                          cursor: 'pointer',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      >
                        {/* Dynamic Destination List */}
                        {destinations.map((d) => (
                          <option key={d.id || d.slug} value={`${d.title}, ${d.country}`}>
                            {d.title}, {d.country} ({d.region})
                          </option>
                        ))}
                        <option value="Multiple / Open to Ideas">Multiple / Open to Ideas</option>
                        <option value="Bespoke Custom Route">Bespoke Custom Route (Describe Below)</option>
                      </select>

                      <span
                        style={{
                          position: 'absolute',
                          right: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e262a', marginBottom: '8px' }}>
                      Guests
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        style={{
                          width: '100%',
                          height: '48px',
                          padding: '0 36px 0 16px',
                          borderRadius: '14px',
                          border: '1px solid rgba(13, 13, 13, 0.12)',
                          backgroundColor: 'rgba(13, 13, 13, 0.02)',
                          fontSize: '14.5px',
                          color: '#1e262a',
                          cursor: 'pointer',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>

                      <span
                        style={{
                          position: 'absolute',
                          right: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timing & Budget */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e262a', marginBottom: '8px' }}>
                      Approximate Timing / Season
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. September 2026 / 10 days"
                      value={travelDates}
                      onChange={(e) => setTravelDates(e.target.value)}
                      style={{
                        width: '100%',
                        height: '48px',
                        padding: '0 18px',
                        borderRadius: '14px',
                        border: '1px solid rgba(13, 13, 13, 0.12)',
                        backgroundColor: 'rgba(13, 13, 13, 0.02)',
                        fontSize: '15px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e262a', marginBottom: '8px' }}>
                      Target Investment Range
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                        style={{
                          width: '100%',
                          height: '48px',
                          padding: '0 36px 0 16px',
                          borderRadius: '14px',
                          border: '1px solid rgba(13, 13, 13, 0.12)',
                          backgroundColor: 'rgba(13, 13, 13, 0.02)',
                          fontSize: '14.5px',
                          color: '#1e262a',
                          cursor: 'pointer',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      >
                        <option value="₹50,000 – ₹1,50,000 per person">₹50,000 – ₹1,50,000 per person</option>
                        <option value="₹1,50,000 – ₹3,00,000 per person">₹1,50,000 – ₹3,00,000 per person</option>
                        <option value="₹3,00,000 – ₹6,00,000 per person">₹3,00,000 – ₹6,00,000 per person</option>
                        <option value="₹6,00,000+ per person (Ultra-Luxury / Private Charter)">
                          ₹6,00,000+ per person (Ultra-Luxury / Private Charter)
                        </option>
                        <option value="Flexible / Customized Consultation">Flexible / Customized Consultation</option>
                      </select>

                      <span
                        style={{
                          position: 'absolute',
                          right: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e262a', marginBottom: '8px' }}>
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      height: '48px',
                      padding: '0 18px',
                      borderRadius: '14px',
                      border: '1px solid rgba(13, 13, 13, 0.12)',
                      backgroundColor: 'rgba(13, 13, 13, 0.02)',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e262a', marginBottom: '8px' }}>
                    Describe your vision for this journey *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what you love: slow mornings, wine tastings, private yachts, wellness retreats, or remote mountain solitude..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '16px 18px',
                      borderRadius: '14px',
                      border: '1px solid rgba(13, 13, 13, 0.12)',
                      backgroundColor: 'rgba(13, 13, 13, 0.02)',
                      fontSize: '15px',
                      color: '#1e262a',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {statusMessage && status === 'error' && (
                  <div style={{ fontSize: '14px', color: '#c53030', fontWeight: 500 }}>
                    {statusMessage}
                  </div>
                )}

                <button
                  type="submit"
                  suppressHydrationWarning
                  disabled={status === 'loading'}
                  className="voyara-btn voyara-btn-dark"
                  style={{
                    height: '54px',
                    justifyContent: 'center',
                    marginTop: '8px',
                  }}
                >
                  <span>{status === 'loading' ? 'Sending Journey Request...' : 'Send Journey Request'}</span>
                  <span className="voyara-arrow-circle">→</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Studio Contact & Promises */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '32px',
                padding: '36px',
                border: '1px solid rgba(13, 13, 13, 0.08)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#17191c', margin: 0 }}>
                Direct Studio Concierge
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '15px', color: 'rgba(30, 38, 42, 0.75)' }}>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', color: '#5b8291' }}>
                    Email
                  </div>
                  <a href="mailto:hello@travelyn.com" style={{ color: '#17191c', fontWeight: 600 }}>
                    hello@travelyn.com
                  </a>
                </div>

                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', color: '#5b8291' }}>
                    Telephone
                  </div>
                  <div style={{ color: '#17191c', fontWeight: 600 }}>
                    +91 98765 43210
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', color: '#5b8291' }}>
                    Studios
                  </div>
                  <div style={{ color: '#17191c', fontWeight: 500 }}>
                    Kochi, Kerala, India · Global Remote Concierge
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', color: '#5b8291' }}>
                    Concierge Hours
                  </div>
                  <div style={{ color: '#17191c', fontWeight: 500 }}>
                    Mon – Sat · 9:00 AM – 8:00 PM IST
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#f2efe9',
                borderRadius: '32px',
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#17191c' }}>
                The Travelyn Guarantee
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'rgba(30, 38, 42, 0.75)' }}>
                <li>Dedicated personal travel designer assigned within 24 hours</li>
                <li>Free modifications up to 60 days before travel</li>
                <li>Comprehensive 24/7 on-trip concierge assistance</li>
                <li>Direct access to our private network of guides & hosts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div style={{ backgroundColor: '#faf9f6', minHeight: '100vh', padding: '110px 16px 80px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', color: '#1e262a' }}>
              Plan your next story
            </h1>
          </div>
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
