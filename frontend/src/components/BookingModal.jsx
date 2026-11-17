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

  const destTitle = destination?.title || 'Luxury Expedition';
  const destCountry = destination?.country || 'Global Destination';
  const destDuration = destination?.durationDays || 6;
  const basePrice = Number(destination?.price) || 495000;
  const estimatedTotal = basePrice * (Number(guests) || 1);
  const flightCode = `TY-${destination?.id ? String(destination.id).padStart(3, '0') : '840'}`;
  const destCode = destTitle ? destTitle.substring(0, 3).toUpperCase() : 'DST';
  const bannerImage = destination?.imageUrl || destination?.image || 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80';

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!travelerName || !travelerEmail || !startDate) {
      setStatus('error');
      setStatusMessage('Please complete passenger name, e-ticket email, and departure date.');
      return;
    }
    setStatus('loading');
    try {
      const res = await submitBooking({
        destinationId: destination?.id || 1,
        destinationTitle: destTitle,
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
      <div className="plane-ticket-card" onClick={(e) => e.stopPropagation()}>
        
        {/* 1. Airline Header Bar */}
        <div className="ticket-airline-bar">
          <div className="ticket-airline-brand">
            <span className="ticket-plane-glyph">✈</span>
            <span className="ticket-airline-name">TRAVELYN AIRWAYS</span>
            <span className="ticket-brand-sep">·</span>
            <span className="ticket-service-tier">FIRST CLASS EXPEDITIONS</span>
          </div>
          <div className="ticket-airline-tags">
            <span className="ticket-flight-no">FLIGHT {flightCode}</span>
            <span className="ticket-class-pill">E-TICKET</span>
          </div>
        </div>

        {/* 2. Destination Flight Route Banner */}
        <div className="ticket-hero-banner">
          <img
            src={bannerImage}
            alt={destTitle}
            className="ticket-banner-photo"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="ticket-banner-shade" />

          {/* Close Button */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={onClose}
            aria-label="Close"
            className="ticket-close-button"
          >
            ✕
          </button>

          {/* Flight Route Boarding Details */}
          <div className="ticket-route-container">
            <div className="ticket-route-row">
              <div className="ticket-route-node">
                <span className="ticket-node-tag">ORIGIN</span>
                <span className="ticket-node-city">GLOBAL VIP</span>
                <span className="ticket-node-sub">Private Terminal</span>
              </div>

              <div className="ticket-route-mid">
                <span className="ticket-duration-pill">{destDuration} DAYS JOURNEY</span>
                <div className="ticket-flight-path">
                  <span className="ticket-path-dash" />
                  <span className="ticket-path-jet">✈</span>
                  <span className="ticket-path-dash" />
                </div>
                <span className="ticket-charter-tag">NON-STOP CHARTER</span>
              </div>

              <div className="ticket-route-node ticket-route-node-right">
                <span className="ticket-node-tag">DESTINATION</span>
                <span className="ticket-node-city">{destTitle.toUpperCase()}</span>
                <span className="ticket-node-sub">{destCountry}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Main Ticket Content */}
        <div className="ticket-scroll-body">
          {status === 'success' ? (
            /* Issued Boarding Pass State */
            <div className="ticket-confirmed-view">
              <div className="ticket-confirmed-seal">
                <span>✓</span> BOARDING PASS CONFIRMED & ISSUED
              </div>
              <h3 className="ticket-confirmed-headline">Reservation Confirmed</h3>
              <p className="ticket-confirmed-sub">{statusMessage}</p>

              <div className="ticket-issued-stub">
                <div className="ticket-issued-header">
                  <span className="ticket-issued-airline">TRAVELYN AIRWAYS · FIRST CLASS</span>
                  <span className="ticket-issued-code">PASS #{flightCode}</span>
                </div>

                <div className="ticket-issued-route-box">
                  <div>
                    <div className="ticket-issued-k">FROM</div>
                    <div className="ticket-issued-v">GLOBAL VIP</div>
                  </div>
                  <div className="ticket-issued-plane-icon">✈</div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="ticket-issued-k">TO</div>
                    <div className="ticket-issued-v">{destTitle.toUpperCase()}</div>
                  </div>
                </div>

                <div className="ticket-issued-specs">
                  <div>
                    <div className="ticket-issued-k">PASSENGER</div>
                    <div className="ticket-issued-v">{travelerName || 'Sophia Loren'}</div>
                  </div>
                  <div>
                    <div className="ticket-issued-k">DEPARTURE</div>
                    <div className="ticket-issued-v">{startDate}</div>
                  </div>
                  <div>
                    <div className="ticket-issued-k">CABIN CLASS</div>
                    <div className="ticket-issued-v">{roomType}</div>
                  </div>
                  <div>
                    <div className="ticket-issued-k">SEATS (PAX)</div>
                    <div className="ticket-issued-v">{guests} Guests</div>
                  </div>
                </div>

                <div className="ticket-issued-barcode-row">
                  <svg className="ticket-barcode-svg" viewBox="0 0 160 36" fill="currentColor">
                    <rect x="0" y="0" width="3" height="36" />
                    <rect x="5" y="0" width="1.5" height="36" />
                    <rect x="8" y="0" width="4" height="36" />
                    <rect x="14" y="0" width="2" height="36" />
                    <rect x="18" y="0" width="1.5" height="36" />
                    <rect x="22" y="0" width="5" height="36" />
                    <rect x="29" y="0" width="2" height="36" />
                    <rect x="33" y="0" width="3.5" height="36" />
                    <rect x="39" y="0" width="1.5" height="36" />
                    <rect x="42" y="0" width="4" height="36" />
                    <rect x="48" y="0" width="2" height="36" />
                    <rect x="52" y="0" width="1.5" height="36" />
                    <rect x="55" y="0" width="5.5" height="36" />
                    <rect x="63" y="0" width="2" height="36" />
                    <rect x="67" y="0" width="3.5" height="36" />
                    <rect x="73" y="0" width="1.5" height="36" />
                    <rect x="76" y="0" width="4" height="36" />
                    <rect x="82" y="0" width="2" height="36" />
                    <rect x="86" y="0" width="5" height="36" />
                    <rect x="93" y="0" width="2" height="36" />
                    <rect x="97" y="0" width="3" height="36" />
                    <rect x="102" y="0" width="1.5" height="36" />
                    <rect x="105" y="0" width="4.5" height="36" />
                    <rect x="112" y="0" width="2" height="36" />
                    <rect x="116" y="0" width="5" height="36" />
                    <rect x="123" y="0" width="2" height="36" />
                    <rect x="127" y="0" width="3.5" height="36" />
                    <rect x="133" y="0" width="1.5" height="36" />
                    <rect x="136" y="0" width="4" height="36" />
                    <rect x="142" y="0" width="2" height="36" />
                    <rect x="146" y="0" width="3" height="36" />
                    <rect x="151" y="0" width="1.5" height="36" />
                    <rect x="155" y="0" width="4" height="36" />
                  </svg>
                  <span className="ticket-barcode-num">ISSUED · ETKT {flightCode}-{destCode}-2026</span>
                </div>
              </div>

              <button
                type="button"
                suppressHydrationWarning
                onClick={onClose}
                className="ticket-confirm-btn"
                style={{ marginTop: '16px' }}
              >
                <span>Done · Return to Itineraries</span>
                <span className="ticket-btn-arrow">✓</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="ticket-form">
              {/* Row 1: Departure Date & Passengers */}
              <div className="ticket-row-2">
                <div className="ticket-field-group">
                  <label className="ticket-field-label">
                    <span>DEPARTURE DATE (ETD) *</span>
                  </label>
                  <input
                    type="date"
                    required
                    suppressHydrationWarning
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="ticket-text-input"
                  />
                </div>

                <div className="ticket-field-group">
                  <label className="ticket-field-label">
                    <span>PASSENGERS (PAX) *</span>
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="ticket-select-input"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest / Seat (PAX 1)' : `Guests / Seats (PAX ${num})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Cabin Class / Villa Tier */}
              <div className="ticket-field-group">
                <label className="ticket-field-label">
                  <span>CABIN & SUITE CLASS</span>
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="ticket-select-input"
                >
                  <option value="Signature Luxury Suite">First Class · Signature Luxury Suite (Included)</option>
                  <option value="Panoramic View Penthouse">First Class Elite · Panoramic View Penthouse (+ ₹25,000)</option>
                  <option value="Private Villa / Chalet Exclusive">Private Charter · Villa / Chalet Exclusive (+ ₹50,000)</option>
                </select>
              </div>

              {/* Row 3: Passenger Name & Email */}
              <div className="ticket-row-2">
                <div className="ticket-field-group">
                  <label className="ticket-field-label">
                    <span>PASSENGER FULL NAME *</span>
                  </label>
                  <input
                    type="text"
                    required
                    suppressHydrationWarning
                    placeholder="e.g. Sophia Loren"
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    className="ticket-text-input"
                  />
                </div>

                <div className="ticket-field-group">
                  <label className="ticket-field-label">
                    <span>E-TICKET EMAIL ADDRESS *</span>
                  </label>
                  <input
                    type="email"
                    required
                    suppressHydrationWarning
                    placeholder="sophia@example.com"
                    value={travelerEmail}
                    onChange={(e) => setTravelerEmail(e.target.value)}
                    className="ticket-text-input"
                  />
                </div>
              </div>

              {/* Row 4: Phone Number */}
              <div className="ticket-field-group">
                <label className="ticket-field-label">
                  <span>CONTACT / WHATSAPP NUMBER (OPTIONAL)</span>
                </label>
                <input
                  type="tel"
                  suppressHydrationWarning
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="ticket-text-input"
                />
              </div>

              {/* Row 5: Bespoke Requests */}
              <div className="ticket-field-group">
                <label className="ticket-field-label">
                  <span>IN-FLIGHT CONCIERGE & BESPOKE REQUESTS</span>
                </label>
                <textarea
                  rows={2}
                  suppressHydrationWarning
                  placeholder="Anniversary celebration, dietary preferences, private guide language, airport transfers..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="ticket-textarea-input"
                />
              </div>

              {/* Perforated Tear-Off Divider with Physical Notches */}
              <div className="ticket-perforated-tear">
                <span className="ticket-edge-notch ticket-edge-notch-left" />
                <div className="ticket-perforated-line">
                  <span className="ticket-perforated-tag">✂ BOARDING PASS STUB · FARE BREAKDOWN ✂</span>
                </div>
                <span className="ticket-edge-notch ticket-edge-notch-right" />
              </div>

              {/* Fare Stub Card & Barcode */}
              <div className="ticket-stub-receipt">
                <div className="ticket-receipt-left">
                  <div className="ticket-receipt-header">
                    <span className="ticket-receipt-label">ESTIMATED TOTAL FARE</span>
                    <span className="ticket-receipt-badge">VIP INCLUSIVE</span>
                  </div>
                  <div className="ticket-receipt-calc">
                    ₹{basePrice.toLocaleString('en-IN')} × {guests} {guests === 1 ? 'Guest' : 'Guests'}
                    <span className="ticket-receipt-taxes"> · Includes concierge & taxes</span>
                  </div>
                  <div suppressHydrationWarning className="ticket-receipt-price">
                    ₹{estimatedTotal.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* SVG Airline Barcode */}
                <div className="ticket-receipt-barcode">
                  <svg className="ticket-barcode-svg" viewBox="0 0 160 40" fill="currentColor">
                    <rect x="0" y="0" width="3" height="38" />
                    <rect x="5" y="0" width="1.5" height="38" />
                    <rect x="8" y="0" width="4" height="38" />
                    <rect x="14" y="0" width="2" height="38" />
                    <rect x="18" y="0" width="1.5" height="38" />
                    <rect x="22" y="0" width="5" height="38" />
                    <rect x="29" y="0" width="2" height="38" />
                    <rect x="33" y="0" width="3.5" height="38" />
                    <rect x="39" y="0" width="1.5" height="38" />
                    <rect x="42" y="0" width="4" height="38" />
                    <rect x="48" y="0" width="2" height="38" />
                    <rect x="52" y="0" width="1.5" height="38" />
                    <rect x="55" y="0" width="5.5" height="38" />
                    <rect x="63" y="0" width="2" height="38" />
                    <rect x="67" y="0" width="3.5" height="38" />
                    <rect x="73" y="0" width="1.5" height="38" />
                    <rect x="76" y="0" width="4" height="38" />
                    <rect x="82" y="0" width="2" height="38" />
                    <rect x="86" y="0" width="5" height="38" />
                    <rect x="93" y="0" width="2" height="38" />
                    <rect x="97" y="0" width="3" height="38" />
                    <rect x="102" y="0" width="1.5" height="38" />
                    <rect x="105" y="0" width="4.5" height="38" />
                    <rect x="112" y="0" width="2" height="38" />
                    <rect x="116" y="0" width="5" height="38" />
                    <rect x="123" y="0" width="2" height="38" />
                    <rect x="127" y="0" width="3.5" height="38" />
                    <rect x="133" y="0" width="1.5" height="38" />
                    <rect x="136" y="0" width="4" height="38" />
                    <rect x="142" y="0" width="2" height="38" />
                    <rect x="146" y="0" width="3" height="38" />
                    <rect x="151" y="0" width="1.5" height="38" />
                    <rect x="155" y="0" width="4" height="38" />
                  </svg>
                  <span className="ticket-barcode-num">ETKT · {flightCode}-{destCode}-2026</span>
                </div>
              </div>

              {statusMessage && status === 'error' && (
                <div className="ticket-error-banner">{statusMessage}</div>
              )}

              {/* Confirm & Issue Button */}
              <button
                type="submit"
                suppressHydrationWarning
                disabled={status === 'loading'}
                className="ticket-confirm-btn"
              >
                <span className="ticket-btn-plane">✈</span>
                <span>{status === 'loading' ? 'Issuing E-Ticket & Reserving...' : 'Confirm Reservation & Issue Boarding Pass'}</span>
                <span className="ticket-btn-arrow">→</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
