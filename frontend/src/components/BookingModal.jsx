'use client';

import React, { useState, useEffect } from 'react';
import { submitBooking } from '@/lib/api';
import './BookingModal.css';

export default function BookingModal({ destination, isOpen, onClose, initialData }) {
  const [travelerName, setTravelerName] = useState('');
  const [travelerEmail, setTravelerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('2026-06-15');
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState('Signature Luxury Suite');
  const [specialRequests, setSpecialRequests] = useState('');
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Sync initial prefill data if provided
  useEffect(() => {
    if (initialData?.guestName) setTravelerName(initialData.guestName);
    if (initialData?.guestEmail) setTravelerEmail(initialData.guestEmail);
    if (initialData?.adultsCount) setGuests(Number(initialData.adultsCount) || 2);
    if (initialData?.preferredDate) setStartDate(initialData.preferredDate);
  }, [initialData, destination]);

  if (!isOpen || !destination) return null;

  const basePrice = Number(destination?.price) || 495000;
  const estimatedTotal = basePrice * (Number(guests) || 1);
  const bannerImage = destination?.imageUrl || destination?.image || 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80';

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!travelerName || !travelerEmail || !startDate) {
      setStatus('error');
      setStatusMessage('Please fill in your name, email, and travel date.');
      return;
    }
    setStatus('loading');
    try {
      const res = await submitBooking({
        destinationId: destination.id || 1,
        destinationTitle: destination.title || 'Luxury Journey',
        travelerName,
        travelerEmail,
        phone,
        startDate,
        guests: Number(guests) || 1,
        roomType,
        specialRequests,
        totalEstimatedPrice: estimatedTotal,
      });
      if (res && res.success) {
        setStatus('success');
        setStatusMessage(res.message || 'Your journey reservation has been confirmed.');
      } else {
        setStatus('error');
        setStatusMessage(res?.message || 'Booking submission failed. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setStatusMessage(err?.message || 'Booking submission failed. Please try again.');
    }
  };

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header with Destination Banner */}
        <div className="booking-modal-header">
          <img
            src={bannerImage}
            alt={destination.title}
            className="booking-modal-banner-img"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="booking-modal-banner-gradient" />
          <div className="booking-modal-banner-content">
            <div>
              <div className="booking-modal-country">
                {destination.country || destination.region || 'Global'} · {destination.durationDays || 6} Days
              </div>
              <h2 className="booking-modal-title">{destination.title}</h2>
            </div>
            <div className="booking-modal-price-box">
              <div className="booking-modal-price-from">From</div>
              <div suppressHydrationWarning className="booking-modal-price-val">
                ₹{basePrice.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Close X */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={onClose}
            aria-label="Close"
            className="booking-modal-close-btn"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="booking-modal-body">
          {status === 'success' ? (
            <div className="booking-modal-success">
              <div className="booking-modal-success-check">✓</div>
              <h3 className="booking-modal-success-title">Journey Reserved</h3>
              <p className="booking-modal-success-msg">{statusMessage}</p>
              <button
                type="button"
                suppressHydrationWarning
                onClick={onClose}
                className="voyara-btn voyara-btn-dark"
                style={{ marginTop: '10px' }}
              >
                <span>Done</span>
                <span className="voyara-arrow-circle">✓</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="booking-modal-form">
              {/* Row 1: Dates & Guests */}
              <div className="booking-modal-row-grid">
                <div className="booking-modal-field">
                  <label className="booking-modal-label">Desired Start Date</label>
                  <input
                    type="date"
                    suppressHydrationWarning
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="booking-modal-input"
                  />
                </div>
                <div className="booking-modal-field">
                  <label className="booking-modal-label">Number of Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="booking-modal-select"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Room/Suite Tier */}
              <div className="booking-modal-field">
                <label className="booking-modal-label">Suite / Villa Tier</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="booking-modal-select"
                >
                  <option value="Signature Luxury Suite">Signature Luxury Suite (Included)</option>
                  <option value="Panoramic View Penthouse">Panoramic View Penthouse (+ ₹25,000)</option>
                  <option value="Private Villa / Chalet Exclusive">Private Villa / Chalet Exclusive (+ ₹50,000)</option>
                </select>
              </div>

              {/* Row 3: Name & Email */}
              <div className="booking-modal-row-grid">
                <div className="booking-modal-field">
                  <label className="booking-modal-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    suppressHydrationWarning
                    placeholder="e.g. Sophia Loren"
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    className="booking-modal-input"
                  />
                </div>
                <div className="booking-modal-field">
                  <label className="booking-modal-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    suppressHydrationWarning
                    placeholder="sophia@example.com"
                    value={travelerEmail}
                    onChange={(e) => setTravelerEmail(e.target.value)}
                    className="booking-modal-input"
                  />
                </div>
              </div>

              {/* Phone & Special Requests */}
              <div className="booking-modal-field">
                <label className="booking-modal-label">Phone Number (Optional)</label>
                <input
                  type="tel"
                  suppressHydrationWarning
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="booking-modal-input"
                />
              </div>

              <div className="booking-modal-field">
                <label className="booking-modal-label">Bespoke Requests or Preferences</label>
                <textarea
                  rows={2}
                  suppressHydrationWarning
                  placeholder="Anniversary celebration, dietary preferences, private guide language, etc."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="booking-modal-textarea"
                />
              </div>

              {/* Pricing Summary */}
              <div className="booking-modal-summary">
                <div>
                  <div className="booking-modal-summary-title">Estimated Journey Total</div>
                  <div className="booking-modal-summary-sub">
                    ₹{basePrice.toLocaleString('en-IN')} × {guests} {guests === 1 ? 'guest' : 'guests'} (includes taxes & concierge)
                  </div>
                </div>
                <div suppressHydrationWarning className="booking-modal-summary-price">
                  ₹{estimatedTotal.toLocaleString('en-IN')}
                </div>
              </div>

              {statusMessage && status === 'error' && (
                <div className="booking-modal-error">{statusMessage}</div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                suppressHydrationWarning
                disabled={status === 'loading'}
                className="voyara-btn voyara-btn-dark booking-modal-submit-btn"
              >
                <span>{status === 'loading' ? 'Preparing Reservation...' : 'Request Journey Confirmation'}</span>
                <span className="voyara-arrow-circle">→</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
