'use client';

import React, { useState } from 'react';
import { submitBooking } from '@/lib/api';
import './BookingModal.css';

export default function BookingModal({ destination, isOpen, onClose }) {
  const [travelerName, setTravelerName] = useState('');
  const [travelerEmail, setTravelerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('2026-06-15');
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState('Signature Luxury Suite');
  const [specialRequests, setSpecialRequests] = useState('');
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen || !destination) return null;

  const estimatedTotal = destination.price * guests;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!travelerName || !travelerEmail || !startDate) {
      setStatus('error');
      setStatusMessage('Please fill in your name, email, and travel date.');
      return;
    }
    setStatus('loading');
    const res = await submitBooking({
      destinationId: destination.id,
      destinationTitle: destination.title,
      travelerName,
      travelerEmail,
      phone,
      startDate,
      guests,
      roomType,
      specialRequests,
      totalEstimatedPrice: estimatedTotal,
    });
    if (res.success) {
      setStatus('success');
      setStatusMessage(res.message);
    } else {
      setStatus('error');
      setStatusMessage(res.message || 'Booking submission failed. Please try again.');
    }
  };

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header with Destination Banner */}
        <div className="booking-modal-header">
          <img src={destination.imageUrl} alt={destination.title} className="booking-modal-banner-img" />
          <div className="booking-modal-banner-gradient" />
          <div className="booking-modal-banner-content">
            <div>
              <div className="booking-modal-country">
                {destination.country} · {destination.durationDays} Days
              </div>
              <h2 className="booking-modal-title">{destination.title}</h2>
            </div>
            <div className="booking-modal-price-box">
              <div className="booking-modal-price-from">From</div>
              <div suppressHydrationWarning className="booking-modal-price-val">${destination.price.toLocaleString()}</div>
            </div>
          </div>

          {/* Close X */}
          <button type="button" suppressHydrationWarning onClick={onClose} aria-label="Close" className="booking-modal-close-btn">
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
              <button type="button" suppressHydrationWarning onClick={onClose} className="voyara-btn voyara-btn-dark" style={{ marginTop: '10px' }}>
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
                  <option value="Panoramic View Penthouse">Panoramic View Penthouse (+ $800)</option>
                  <option value="Private Villa / Chalet Exclusive">Private Villa / Chalet Exclusive (+ $1,600)</option>
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
                  placeholder="+1 (555) 000-0000"
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
                    ${destination.price.toLocaleString()} × {guests} {guests === 1 ? 'guest' : 'guests'} (includes taxes & concierge)
                  </div>
                </div>
                <div suppressHydrationWarning className="booking-modal-summary-price">
                  ${estimatedTotal.toLocaleString()}
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
