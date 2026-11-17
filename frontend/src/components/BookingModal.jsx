'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/lib/api';
import { getStoredUser } from '@/lib/store';
import './BookingModal.css';

// Dynamically load Razorpay standard checkout script
function loadRazorpaySdk() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay Checkout script.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export default function BookingModal({ destination, isOpen, onClose, initialData }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [travelerName, setTravelerName] = useState('');
  const [travelerEmail, setTravelerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('2026-06-15');
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState('Signature Luxury Suite');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentType, setPaymentType] = useState('full'); // 'full' (100%) or 'advance' (30%)
  
  // Status: 'idle' | 'loading' | 'success' | 'failed' | 'cancelled'
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [verifiedBooking, setVerifiedBooking] = useState(null);
  const [verifiedPayment, setVerifiedPayment] = useState(null);
  const [activeBookingId, setActiveBookingId] = useState('');

  // Pre-load logged-in user details if available
  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setCurrentUser(user);
      if (!travelerName && user.name) setTravelerName(user.name);
      if (!travelerEmail && user.email) setTravelerEmail(user.email);
    }
  }, [isOpen]);

  // Sync initial prefill data if provided from details sidebar
  useEffect(() => {
    if (initialData?.guestName) setTravelerName(initialData.guestName);
    if (initialData?.guestEmail) setTravelerEmail(initialData.guestEmail);
    if (initialData?.adultsCount) setGuests(Number(initialData.adultsCount) || 2);
    if (initialData?.preferredDate) setStartDate(initialData.preferredDate);
  }, [initialData, destination]);

  // Reset transient states on modal open
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setStatusMessage('');
      setVerifiedBooking(null);
      setVerifiedPayment(null);
    }
  }, [isOpen]);

  if (!isOpen || !destination) return null;

  // Pricing calculations
  const basePrice = Number(destination?.price) || 495000;
  const guestCount = Number(guests) || 1;
  let suiteFee = 0;
  if (roomType === 'Panoramic View Penthouse') suiteFee = 25000;
  else if (roomType === 'Private Villa / Chalet Exclusive') suiteFee = 50000;

  const totalJourneyPrice = (basePrice * guestCount) + suiteFee;
  const isAdvance = paymentType === 'advance';
  const amountToPay = isAdvance ? Math.round(totalJourneyPrice * 0.30) : totalJourneyPrice;
  const remainingBalance = totalJourneyPrice - amountToPay;

  const bannerImage = destination?.imageUrl || destination?.image || 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80';

  // Trigger Razorpay Checkout
  const handlePaymentSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!travelerName.trim() || !travelerEmail.trim() || !startDate) {
      setStatus('failed');
      setStatusMessage('Please complete traveler full name, email address, and desired departure date.');
      return;
    }

    setStatus('loading');
    setStatusMessage('Initializing Razorpay Checkout...');

    try {
      // 1. Ensure Razorpay Checkout script is loaded
      const isSdkLoaded = await loadRazorpaySdk();
      if (!isSdkLoaded) {
        setStatus('failed');
        setStatusMessage('Razorpay payment gateway failed to load. Please check your internet connection.');
        return;
      }

      // 2. Create Razorpay order securely on the backend (backend calculates exact amount)
      const orderPayload = {
        destinationId: destination.id || destination.slug,
        packageId: destination.id || destination.slug,
        slug: destination.slug,
        destinationTitle: destination.title,
        price: destination.price,
        travelerName: travelerName.trim(),
        travelerEmail: travelerEmail.trim(),
        phone: phone.trim(),
        startDate,
        guests: guestCount,
        roomType,
        specialRequests,
        paymentType,
        userId: currentUser?.id || 'guest',
        existingBookingId: activeBookingId || undefined
      };

      const orderData = await createRazorpayOrder(orderPayload);

      if (!orderData || !orderData.orderId) {
        throw new Error(orderData?.message || 'Could not create payment order.');
      }

      setActiveBookingId(orderData.bookingId);

      // 3. Configure Razorpay Standard Checkout options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount, // in paise
        currency: orderData.currency || 'INR',
        name: 'Travelyn Luxury Expeditions',
        description: `${destination.title} · ${isAdvance ? '30% Advance Deposit' : 'Full Journey Payment'}`,
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=200&q=80',
        prefill: {
          name: travelerName,
          email: travelerEmail,
          contact: phone || '+919876543210',
        },
        notes: {
          bookingId: orderData.bookingId,
          destinationTitle: destination.title,
          packageId: destination.id,
          paymentType: paymentType,
        },
        theme: {
          color: '#17191c', // Travelyn luxury aesthetic
        },
        // Callback on successful payment in modal
        handler: async function (response) {
          setStatus('loading');
          setStatusMessage('Verifying payment signature with server...');

          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id || orderData.orderId || '',
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || '',
              bookingId: orderData.bookingId,
            };

            const verificationResult = await verifyRazorpayPayment(verifyPayload);

            if (verificationResult && verificationResult.success) {
              setVerifiedBooking(verificationResult.booking);
              setVerifiedPayment(verificationResult.payment);
              setStatus('success');
              setStatusMessage('Payment verified & booking confirmed! Your luxury journey is reserved.');
            } else {
              setStatus('failed');
              setStatusMessage(verificationResult?.message || 'Payment signature verification failed.');
            }
          } catch (verifyErr) {
            console.error('Payment verification error:', verifyErr);
            setStatus('failed');
            setStatusMessage(verifyErr.message || 'Server failed to verify payment.');
          }
        },
        modal: {
          ondismiss: function () {
            setStatus('cancelled');
            setStatusMessage('Payment was cancelled or window closed. You can retry anytime.');
          },
        },
      };

      // Only attach order_id if it is a real order created on Razorpay's servers (e.g. "order_Oq7J1tqO4u8K")
      // Passing an invalid or non-existent order_id causes Razorpay Checkout to crash with "Uh! oh! Something went wrong"
      if (orderData.orderId && !orderData.orderId.startsWith('order_test_')) {
        options.order_id = orderData.orderId;
      }

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on('payment.failed', function (response) {
        console.warn('Razorpay payment failed callback:', response.error);
        setStatus('failed');
        setStatusMessage(response.error?.description || response.error?.reason || 'Payment was declined or failed.');
      });

      // 4. Open Razorpay Checkout modal
      razorpayInstance.open();

    } catch (err) {
      console.error('Checkout error:', err);
      setStatus('failed');
      setStatusMessage(err.message || 'Unable to open payment gateway.');
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
              <div className="booking-modal-price-from">Package Total</div>
              <div suppressHydrationWarning className="booking-modal-price-val">
                ₹{totalJourneyPrice.toLocaleString('en-IN')}
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

        {/* Modal Body */}
        <div className="booking-modal-body">
          {status === 'success' && verifiedBooking ? (
            /* 1. SUCCESS VIEW */
            <div className="booking-modal-success">
              <div className="booking-modal-status-badge is-success">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="booking-modal-test-badge">● RAZORPAY TEST MODE VERIFIED</span>
              <h3 className="booking-modal-status-title">Payment Successful & Confirmed</h3>
              <p className="booking-modal-status-msg">
                Your luxury journey reservation is confirmed! A confirmation email and travel dispatch have been issued.
              </p>

              {/* Receipt Stub */}
              <div className="booking-success-receipt">
                <div className="booking-receipt-row">
                  <span className="receipt-k">Booking Reference:</span>
                  <span className="receipt-v receipt-code">{verifiedBooking.id || verifiedBooking.bookingId}</span>
                </div>
                <div className="booking-receipt-row">
                  <span className="receipt-k">Destination:</span>
                  <span className="receipt-v">{verifiedBooking.destinationTitle || destination.title}</span>
                </div>
                <div className="booking-receipt-row">
                  <span className="receipt-k">Passenger:</span>
                  <span className="receipt-v">{verifiedBooking.travelerName || travelerName}</span>
                </div>
                <div className="booking-receipt-row">
                  <span className="receipt-k">Departure Date:</span>
                  <span className="receipt-v">{verifiedBooking.startDate || startDate}</span>
                </div>
                <div className="booking-receipt-row">
                  <span className="receipt-k">Payment ID:</span>
                  <span className="receipt-v receipt-code">{verifiedPayment?.razorpayPaymentId || verifiedBooking.razorpayPaymentId || 'rzp_test_pay'}</span>
                </div>
                <div className="booking-receipt-row">
                  <span className="receipt-k">Amount Paid:</span>
                  <span className="receipt-v receipt-price">₹{(verifiedBooking.paidAmount || amountToPay).toLocaleString('en-IN')}</span>
                </div>
                {verifiedBooking.remainingAmount > 0 && (
                  <div className="booking-receipt-row receipt-highlight">
                    <span className="receipt-k">Remaining Balance Due:</span>
                    <span className="receipt-v">₹{verifiedBooking.remainingAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="booking-receipt-row">
                  <span className="receipt-k">Status:</span>
                  <span className="receipt-status-pill">Confirmed · Paid</span>
                </div>
              </div>

              <div className="booking-modal-actions-grid">
                <Link
                  href="/bookings"
                  onClick={onClose}
                  className="booking-btn-primary"
                >
                  <span>View in My Bookings</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={onClose}
                  className="booking-btn-secondary"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : status === 'failed' || status === 'cancelled' ? (
            /* 2. FAILURE / CANCELLED VIEW */
            <div className="booking-modal-failed-view">
              <div className={`booking-modal-status-badge is-${status === 'cancelled' ? 'cancelled' : 'failed'}`}>
                {status === 'cancelled' ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="10" y1="15" x2="10" y2="9" />
                    <line x1="14" y1="15" x2="14" y2="9" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                )}
              </div>
              <span className={`booking-modal-status-eyebrow is-${status === 'cancelled' ? 'cancelled' : 'failed'}`}>
                ● {status === 'cancelled' ? 'CHECKOUT SESSION PAUSED' : 'PAYMENT UNRESOLVED'}
              </span>
              <h3 className="booking-modal-status-title">
                {status === 'cancelled' ? 'Payment Cancelled' : 'Payment Failed'}
              </h3>
              <p className="booking-modal-status-msg">
                {statusMessage || (status === 'cancelled'
                  ? 'Payment was cancelled or window closed. You can retry anytime.'
                  : 'The transaction could not be completed. Your journey reservation details remain pending.')}
              </p>

              {activeBookingId && (
                <div className="booking-ref-strip">
                  <div className="booking-ref-strip-top">
                    <span className="booking-ref-strip-tag">Pending Reservation</span>
                    <span className="booking-ref-strip-badge">24H Courtesy Hold</span>
                  </div>
                  <div className="booking-ref-strip-body">
                    <div className="booking-ref-code-group">
                      <span className="booking-ref-label">Booking Reference:</span>
                      <strong className="booking-ref-code">{activeBookingId}</strong>
                    </div>
                    <div className="booking-ref-note">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>Itinerary locked</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="booking-modal-actions-grid">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={handlePaymentSubmit}
                  className="booking-btn-primary"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                  </svg>
                  <span>Retry Payment Now</span>
                </button>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setStatus('idle')}
                  className="booking-btn-secondary"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <span>Edit Booking Details</span>
                </button>
              </div>
            </div>
          ) : (
            /* 3. NORMAL BOOKING & PAYMENT FORM */
            <form onSubmit={handlePaymentSubmit} className="booking-modal-form">
              {/* Row 1: Dates & Guests */}
              <div className="booking-modal-row-grid">
                <div className="booking-modal-field">
                  <label className="booking-modal-label">Desired Departure Date *</label>
                  <input
                    type="date"
                    required
                    suppressHydrationWarning
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="booking-modal-input"
                  />
                </div>
                <div className="booking-modal-field">
                  <label className="booking-modal-label">Number of Travellers *</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="booking-modal-select"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Traveller' : 'Travellers'}
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
                <label className="booking-modal-label">Phone / WhatsApp Number (Optional)</label>
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
                  placeholder="Anniversary celebration, dietary preferences, private guide language, airport transfers..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="booking-modal-textarea"
                />
              </div>

              {/* Payment Type Selection (Full vs Advance) */}
              <div className="booking-payment-type-block">
                <label className="booking-modal-label">Payment Option</label>
                <div className="booking-payment-options">
                  <label className={`booking-pay-radio ${paymentType === 'full' ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="full"
                      checked={paymentType === 'full'}
                      onChange={() => setPaymentType('full')}
                    />
                    <div className="booking-radio-content">
                      <span className="booking-radio-title">Full Payment (100%)</span>
                      <span className="booking-radio-desc">Pay complete journey amount now</span>
                      <span className="booking-radio-amt">₹{totalJourneyPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </label>

                  <label className={`booking-pay-radio ${paymentType === 'advance' ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="advance"
                      checked={paymentType === 'advance'}
                      onChange={() => setPaymentType('advance')}
                    />
                    <div className="booking-radio-content">
                      <span className="booking-radio-title">Advance Deposit (30%)</span>
                      <span className="booking-radio-desc">Pay 30% to reserve, remainder on arrival</span>
                      <span className="booking-radio-amt">₹{Math.round(totalJourneyPrice * 0.30).toLocaleString('en-IN')}</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="booking-modal-summary">
                <div className="booking-summary-left">
                  <div className="booking-modal-summary-title">Total Journey Price</div>
                  <div className="booking-modal-summary-sub">
                    ₹{basePrice.toLocaleString('en-IN')} × {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
                    {suiteFee > 0 && ` + Suite Upgrade (₹${suiteFee.toLocaleString('en-IN')})`}
                    <span className="booking-tax-tag"> · Includes taxes & concierge</span>
                  </div>
                  {isAdvance && (
                    <div className="booking-advance-note">
                      Remaining balance due on arrival: <strong>₹{remainingBalance.toLocaleString('en-IN')}</strong>
                    </div>
                  )}
                </div>
                <div className="booking-summary-right">
                  <span className="booking-due-label">PAYABLE TODAY</span>
                  <div suppressHydrationWarning className="booking-modal-summary-price">
                    ₹{amountToPay.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {statusMessage && status === 'failed' && (
                <div className="booking-modal-error">{statusMessage}</div>
              )}

              {/* Secure Payment Trigger Button */}
              <button
                type="submit"
                suppressHydrationWarning
                disabled={status === 'loading'}
                className="voyara-btn voyara-btn-dark booking-modal-submit-btn"
              >
                <span>
                  {status === 'loading'
                    ? 'Connecting to Razorpay...'
                    : `Pay ₹${amountToPay.toLocaleString('en-IN')} with Razorpay`}
                </span>
                <span className="voyara-arrow-circle">🔒</span>
              </button>

              <div className="booking-modal-security-note">
                <span>🛡️ 256-bit SSL Encryption · Official Razorpay Test Gateway</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
