'use client';
import React, { useState } from 'react';
import { submitContact } from '@/lib/api';
export default function ContactPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [destinationPreference, setDestinationPreference] = useState('Swiss Alps');
    const [travelDates, setTravelDates] = useState('');
    const [budgetRange, setBudgetRange] = useState('₹50,000 – ₹1,50,000 per person');
    const [guestCount, setGuestCount] = useState(2);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fullName || !email || !message) {
            setStatus('error');
            setStatusMessage('Please fill in your name, email, and travel vision message.');
            return;
        }
        setStatus('loading');
        const res = await submitContact({
            fullName,
            email,
            phone,
            destinationPreference,
            travelDates,
            budgetRange,
            guestCount,
            message,
        });
        if (res.success) {
            setStatus('success');
            setStatusMessage(res.message);
        }
        else {
            setStatus('error');
            setStatusMessage(res.message || 'Something went wrong. Please try again.');
        }
    };
    return (<div style={{ backgroundColor: '#faf9f6', minHeight: '100vh', padding: '140px 24px 90px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '56px' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="voyara-tag">
            <div className="voyara-dot"/>
            <span>Tailor-Made Concierge</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(38px, 6vw, 72px)',
            fontWeight: 500,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: '#1e262a',
            margin: 0,
        }}>
            Plan your next story
          </h1>
          <p style={{ fontSize: '19px', color: 'rgba(30, 38, 42, 0.7)', maxWidth: '640px', margin: 0 }}>
            Share your dreams, timings, and travel desires. Our dedicated travel designers will craft a bespoke itinerary suited to your pace.
          </p>
        </div>

        {/* Split Container */}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'start',
        }}>
          {/* Left Column: Form */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '32px',
            padding: '40px',
            border: '1px solid rgba(13, 13, 13, 0.08)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.04)',
        }}>
            {status === 'success' ? (<div style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '999px',
                backgroundColor: 'rgba(47, 133, 90, 0.12)',
                color: '#2f855a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
            }}>
                  ✓
                </div>
                <h3 style={{ fontSize: '28px', fontWeight: 600, color: '#17191c', margin: 0 }}>
                  Inquiry Received
                </h3>
                <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'rgba(30, 38, 42, 0.72)', maxWidth: '440px' }}>
                  {statusMessage}
                </p>
                <a href="/" className="voyara-btn voyara-btn-dark" style={{ marginTop: '12px' }}>
                  <span>Return to Journeys</span>
                  <span className="voyara-arrow-circle">→</span>
                </a>
              </div>) : (<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Name & Email */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e262a', marginBottom: '8px' }}>
                      Full Name *
                    </label>
                    <input type="text" required placeholder="e.g. Sebastian Cruz" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{
                width: '100%',
                height: '48px',
                padding: '0 18px',
                borderRadius: '14px',
                border: '1px solid rgba(13, 13, 13, 0.12)',
                backgroundColor: 'rgba(13, 13, 13, 0.02)',
                fontSize: '15px',
                outline: 'none',
            }}/>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e262a', marginBottom: '8px' }}>
                      Email Address *
                    </label>
                    <input type="email" required placeholder="sebastian@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{
                width: '100%',
                height: '48px',
                padding: '0 18px',
                borderRadius: '14px',
                border: '1px solid rgba(13, 13, 13, 0.12)',
                backgroundColor: 'rgba(13, 13, 13, 0.02)',
                fontSize: '15px',
                outline: 'none',
            }}/>
                  </div>
                </div>

                {/* Destination & Guests */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e262a', marginBottom: '8px' }}>
                      Destination of Interest
                    </label>
                    <select value={destinationPreference} onChange={(e) => setDestinationPreference(e.target.value)} style={{
                width: '100%',
                height: '48px',
                padding: '0 14px',
                borderRadius: '14px',
                border: '1px solid rgba(13, 13, 13, 0.12)',
                backgroundColor: 'rgba(13, 13, 13, 0.02)',
                fontSize: '15px',
                color: '#1e262a',
                cursor: 'pointer',
            }}>
                      <option value="Swiss Alps">Swiss Alps, Switzerland</option>
                      <option value="Santorini">Santorini, Greece</option>
                      <option value="Kyoto">Kyoto, Japan</option>
                      <option value="Maldives">Maldives, Indian Ocean</option>
                      <option value="Amalfi Coast">Amalfi Coast, Italy</option>
                      <option value="Patagonia">Patagonia, Chile</option>
                      <option value="Lake Como">Lake Como, Italy</option>
                      <option value="Marrakech">Marrakech, Morocco</option>
                      <option value="Multiple / Open to Ideas">Multiple / Open to Ideas</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e262a', marginBottom: '8px' }}>
                      Guests
                    </label>
                    <select value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} style={{
                width: '100%',
                height: '48px',
                padding: '0 14px',
                borderRadius: '14px',
                border: '1px solid rgba(13, 13, 13, 0.12)',
                backgroundColor: 'rgba(13, 13, 13, 0.02)',
                fontSize: '15px',
                color: '#1e262a',
                cursor: 'pointer',
            }}>
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (<option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>))}
                    </select>
                  </div>
                </div>

                {/* Dates & Budget */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e262a', marginBottom: '8px' }}>
                      Approximate Timing / Season
                    </label>
                    <input type="text" placeholder="e.g. September 2026 / 10 days" value={travelDates} onChange={(e) => setTravelDates(e.target.value)} style={{
                width: '100%',
                height: '48px',
                padding: '0 18px',
                borderRadius: '14px',
                border: '1px solid rgba(13, 13, 13, 0.12)',
                backgroundColor: 'rgba(13, 13, 13, 0.02)',
                fontSize: '15px',
                outline: 'none',
            }}/>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e262a', marginBottom: '8px' }}>
                      Target Investment Range
                    </label>
                    <select value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} style={{
                width: '100%',
                height: '48px',
                padding: '0 14px',
                borderRadius: '14px',
                border: '1px solid rgba(13, 13, 13, 0.12)',
                backgroundColor: 'rgba(13, 13, 13, 0.02)',
                fontSize: '15px',
                color: '#1e262a',
                cursor: 'pointer',
            }}>
                      <option value="₹25,000 – ₹50,000 per person">₹25,000 – ₹50,000 per person</option>
                      <option value="₹50,000 – ₹1,50,000 per person">₹50,000 – ₹1,50,000 per person</option>
                      <option value="₹1,50,000+ per person (Ultra-Luxury / Private Charter)">₹1,50,000+ per person (Ultra-Luxury / Private Charter)</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e262a', marginBottom: '8px' }}>
                    Describe your vision for this journey *
                  </label>
                  <textarea required rows={4} placeholder="Tell us what you love: slow mornings, wine tastings, private yachts, wellness retreats, or remote mountain solitude..." value={message} onChange={(e) => setMessage(e.target.value)} style={{
                width: '100%',
                padding: '16px 18px',
                borderRadius: '14px',
                border: '1px solid rgba(13, 13, 13, 0.12)',
                backgroundColor: 'rgba(13, 13, 13, 0.02)',
                fontSize: '15px',
                color: '#1e262a',
                outline: 'none',
                resize: 'vertical',
            }}/>
                </div>

                {statusMessage && status === 'error' && (<div style={{ fontSize: '14px', color: '#c53030', fontWeight: 500 }}>
                    {statusMessage}
                  </div>)}

                <button
                  type="submit"
                  suppressHydrationWarning
                  disabled={status === 'loading'}
                  className="voyara-btn voyara-btn-dark"
                  style={{
                height: '54px',
                justifyContent: 'center',
                marginTop: '8px',
            }}>
                  <span>{status === 'loading' ? 'Sending Journey Request...' : 'Send Journey Request'}</span>
                  <span className="voyara-arrow-circle">→</span>
                </button>
              </form>)}
          </div>

          {/* Right Column: Studio Contact & Promises */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '32px',
            padding: '36px',
            border: '1px solid rgba(13, 13, 13, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
        }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#17191c', margin: 0 }}>
                Direct Studio Concierge
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '15px', color: 'rgba(30, 38, 42, 0.75)' }}>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, color: '#5b8291' }}>
                    Email
                  </div>
                  <a href="mailto:hello@travelyn.com" style={{ color: '#17191c', fontWeight: 600 }}>
                    hello@travelyn.com
                  </a>
                </div>

                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, color: '#5b8291' }}>
                    Telephone
                  </div>
                  <div style={{ color: '#17191c', fontWeight: 600 }}>
                    +1 (555) 012 3456
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, color: '#5b8291' }}>
                    Studios
                  </div>
                  <div style={{ color: '#17191c' }}>
                    Rua Garrett 19, Chiado, Lisbon · 5th Ave, New York
                  </div>
                </div>
              </div>
            </div>

            <div style={{
            backgroundColor: '#f2efe9',
            borderRadius: '32px',
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
        }}>
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
    </div>);
}
