'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getStoredUser, getStoredBookings } from '@/lib/store';
import { getPaymentHistory } from '@/lib/api';
import BookingModal from '@/components/BookingModal';
import './bookings.css';

export default function UserBookingsPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [retryBooking, setRetryBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentUser = getStoredUser();
    setUser(currentUser);

    // 1. Load bookings from stored bookings
    const localBookings = getStoredBookings() || [];
    
    // Filter bookings for this user if logged in
    let userBookings = localBookings;
    if (currentUser && currentUser.email) {
      const emailLower = currentUser.email.toLowerCase();
      userBookings = localBookings.filter(
        b => (b.travelerEmail && b.travelerEmail.toLowerCase() === emailLower) ||
             (b.userId && b.userId === currentUser.id)
      );
    }
    setBookings(userBookings.length > 0 ? userBookings : localBookings);

    // 2. Fetch payment transactions from backend
    if (currentUser?.email) {
      getPaymentHistory({ email: currentUser.email })
        .then(res => {
          if (res && res.payments) {
            setPayments(res.payments);
          }
        })
        .catch(err => console.warn('Could not fetch payment history:', err));
    }
  }, []);

  // Filter bookings based on active tab
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const bStatus = (b.bookingStatus || b.status || 'pending').toLowerCase();
      const pStatus = (b.paymentStatus || 'pending').toLowerCase();

      if (activeTab === 'all') return true;
      if (activeTab === 'confirmed') return bStatus === 'confirmed' || pStatus === 'captured';
      if (activeTab === 'pending') return bStatus === 'pending' || bStatus === 'pending payment' || pStatus === 'pending';
      if (activeTab === 'refunded') return bStatus === 'refunded' || pStatus === 'refunded';
      return true;
    });
  }, [bookings, activeTab]);

  const handlePrintInvoice = (booking) => {
    setSelectedInvoice(booking);
  };

  const handleTriggerRetry = (booking) => {
    setRetryBooking({
      id: booking.destinationId || 'dest-1',
      title: booking.destinationTitle || 'Luxury Expedition',
      price: booking.totalEstimatedPrice || booking.totalAmount || 495000,
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    });
    setIsModalOpen(true);
  };

  if (!mounted) {
    return (
      <div className="user-bookings-page" suppressHydrationWarning>
        <div className="bookings-container" suppressHydrationWarning>
          <div className="bookings-header" suppressHydrationWarning>
            <div>
              <span className="bookings-tag">MEMBER PORTFOLIO</span>
              <h1 className="bookings-title">My Journey Reservations</h1>
              <p className="bookings-subtitle">
                Review your bespoke itineraries, verified Razorpay payment receipts, and dispatch vouchers.
              </p>
            </div>
          </div>
          <div className="bookings-loading-state" suppressHydrationWarning>
            <div className="bookings-spinner" />
            <p>Accessing your reserved itineraries...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-bookings-page" suppressHydrationWarning>
      <div className="bookings-container" suppressHydrationWarning>
        {/* Top Header */}
        <div className="bookings-header" suppressHydrationWarning>
          <div>
            <span className="bookings-tag">MEMBER PORTFOLIO</span>
            <h1 className="bookings-title">My Journey Reservations</h1>
            <p className="bookings-subtitle">
              Review your bespoke itineraries, verified Razorpay payment receipts, and dispatch vouchers.
            </p>
          </div>

          {user && (
            <div className="bookings-user-badge" suppressHydrationWarning>
              <div className="bookings-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="bookings-user-meta">
                <span className="bookings-user-name">{user.name || 'Travelyn Member'}</span>
                <span className="bookings-user-email">{user.email || 'VIP Guest'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Filter Navigation Bar */}
        <div className="bookings-filter-bar" suppressHydrationWarning>
          <div className="bookings-tabs" suppressHydrationWarning>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setActiveTab('all')}
              className={`bookings-tab-btn ${activeTab === 'all' ? 'is-active' : ''}`}
            >
              All Journeys
              <span className="bookings-count-badge">{bookings.length}</span>
            </button>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setActiveTab('confirmed')}
              className={`bookings-tab-btn ${activeTab === 'confirmed' ? 'is-active' : ''}`}
            >
              Confirmed
              <span className="bookings-count-badge">
                {bookings.filter(b => (b.bookingStatus || b.status || '').toLowerCase() === 'confirmed').length}
              </span>
            </button>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setActiveTab('pending')}
              className={`bookings-tab-btn ${activeTab === 'pending' ? 'is-active' : ''}`}
            >
              Pending Payment
              <span className="bookings-count-badge">
                {bookings.filter(b => (b.bookingStatus || b.status || '').toLowerCase().includes('pending')).length}
              </span>
            </button>
          </div>

          <Link href="/destinations" className="bookings-explore-link">
            <span>Explore Curated Expeditions</span>
            <span>→</span>
          </Link>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="bookings-list" suppressHydrationWarning>
            {filteredBookings.map((b) => {
              const isConfirmed = (b.bookingStatus || b.status || '').toLowerCase() === 'confirmed';
              const isPaid = (b.paymentStatus || '').toLowerCase() === 'captured' || isConfirmed;
              const isPending = !isPaid && (b.bookingStatus || b.status || '').toLowerCase().includes('pending');
              const isRefunded = (b.bookingStatus || b.paymentStatus || '').toLowerCase().includes('refund');

              const totalAmount = b.totalAmount || b.totalEstimatedPrice || 495000;
              const paidAmount = b.paidAmount || (isPaid ? totalAmount : 0);
              const remainingAmount = b.remainingAmount || (totalAmount - paidAmount);
              const bookingRef = b.id || b.bookingId || 'BK-TRAVELYN';

              return (
                <div key={b.id || bookingRef} className="booking-card" suppressHydrationWarning>
                  {/* Card Top Strip */}
                  <div className="booking-card-top" suppressHydrationWarning>
                    <div className="booking-ref-block">
                      <span className="booking-ref-label">Booking Reference:</span>
                      <span className="booking-ref-code">{bookingRef}</span>
                      <span className="booking-test-tag">● RAZORPAY TEST MODE</span>
                    </div>

                    <div className="booking-statuses">
                      {isConfirmed && <span className="status-badge is-confirmed">✓ Booking Confirmed</span>}
                      {isPending && <span className="status-badge is-pending">⏳ Payment Pending</span>}
                      {isRefunded && <span className="status-badge is-refunded">↩ Refunded</span>}
                      <span className={`status-badge ${isPaid ? 'is-captured' : 'is-pending'}`}>
                        {isPaid ? '● Payment Captured' : '○ Awaiting Checkout'}
                      </span>
                    </div>
                  </div>

                  {/* Card Main Body */}
                  <div className="booking-card-main" suppressHydrationWarning>
                    <div className="booking-img-wrap">
                      <img
                        src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80"
                        alt={b.destinationTitle || 'Expedition'}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>

                    <div className="booking-dest-info">
                      <h3 className="booking-dest-title">{b.destinationTitle || 'Bespoke Travel Expedition'}</h3>
                      <div className="booking-meta-grid">
                        <div className="booking-meta-item">
                          <span className="meta-k">Departure Date</span>
                          <span className="meta-v">{b.startDate || '2026-06-15'}</span>
                        </div>
                        <div className="booking-meta-item">
                          <span className="meta-k">Travellers</span>
                          <span className="meta-v">{b.guests || 2} Guests</span>
                        </div>
                        <div className="booking-meta-item">
                          <span className="meta-k">Suite / Class</span>
                          <span className="meta-v">{b.roomType || 'Signature Luxury Suite'}</span>
                        </div>
                        <div className="booking-meta-item">
                          <span className="meta-k">Passenger Name</span>
                          <span className="meta-v">{b.travelerName || user?.name || 'Valued Guest'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="booking-financial-box">
                      <div>
                        <div className="financial-row">
                          <span>Total Journey Fare:</span>
                          <span>₹{Number(totalAmount).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="financial-row highlight">
                          <span>Amount Paid:</span>
                          <span>₹{Number(paidAmount).toLocaleString('en-IN')}</span>
                        </div>
                        {remainingAmount > 0 && (
                          <div className="financial-row balance-due">
                            <span>Balance Due on Arrival:</span>
                            <span>₹{Number(remainingAmount).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                      </div>

                      <div className="pay-id-row">
                        <span>Payment ID: </span>
                        <code>{b.razorpayPaymentId || 'pay_test_' + (b.id ? b.id.replace('bk-', '') : '2026')}</code>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="booking-card-actions" suppressHydrationWarning>
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => handlePrintInvoice(b)}
                      className="invoice-btn"
                    >
                      <span>📄 Download Tax Invoice & E-Ticket</span>
                    </button>

                    {isPending && (
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => handleTriggerRetry(b)}
                        className="retry-pay-btn"
                      >
                        <span>🔒 Complete Razorpay Payment</span>
                        <span>→</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bookings-empty-state" suppressHydrationWarning>
            <div className="empty-icon">🗺️</div>
            <h2 className="empty-title">No Reservations Found</h2>
            <p className="empty-subtitle">
              You do not have any {activeTab !== 'all' ? activeTab : ''} bookings yet. Discover our collection of handpicked private expeditions and reserve your journey.
            </p>
            <Link href="/destinations" className="voyara-btn voyara-btn-dark">
              <span>Browse Destinations</span>
              <span className="voyara-arrow-circle">→</span>
            </Link>
          </div>
        )}

        {/* Printable Tax Invoice Modal */}
        {selectedInvoice && (
          <div className="invoice-modal-overlay" onClick={() => setSelectedInvoice(null)} suppressHydrationWarning>
            <div className="invoice-modal" onClick={(e) => e.stopPropagation()} suppressHydrationWarning>
              <button
                type="button"
                suppressHydrationWarning
                className="invoice-modal-close"
                onClick={() => setSelectedInvoice(null)}
              >
                ✕
              </button>

              <div className="invoice-header">
                <div>
                  <span className="invoice-tag">OFFICIAL TRAVELYN TAX INVOICE & DISPATCH</span>
                  <div className="invoice-brand">travelyn.</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Travelyn Global Expeditions Ltd. · Chiado Studio, Lisbon · GSTIN: 27AABCT1332L1Z8
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Invoice Date</div>
                  <div suppressHydrationWarning style={{ fontWeight: 700, fontSize: '14px' }}>{new Date().toLocaleDateString('en-GB')}</div>
                  <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600, marginTop: '4px' }}>● TEST PAYMENT CAPTURED</div>
                </div>
              </div>

              <div className="invoice-grid">
                <div>
                  <strong style={{ display: 'block', marginBottom: '4px', color: '#17191c' }}>Billed To:</strong>
                  <div>{selectedInvoice.travelerName || 'Guest'}</div>
                  <div style={{ color: '#64748b' }}>{selectedInvoice.travelerEmail || 'guest@example.com'}</div>
                  {selectedInvoice.phone && <div style={{ color: '#64748b' }}>{selectedInvoice.phone}</div>}
                </div>
                <div>
                  <strong style={{ display: 'block', marginBottom: '4px', color: '#17191c' }}>Reservation Details:</strong>
                  <div>Booking ID: <strong>{selectedInvoice.id || selectedInvoice.bookingId}</strong></div>
                  <div>Razorpay Payment ID: <strong>{selectedInvoice.razorpayPaymentId || 'pay_test_verified'}</strong></div>
                  <div>Departure Date: {selectedInvoice.startDate || '15-06-2026'}</div>
                  <div>Guests: {selectedInvoice.guests || 2} Pax</div>
                </div>
              </div>

              <table className="invoice-items-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Suite / Class</th>
                    <th>Pax</th>
                    <th style={{ textAlign: 'right' }}>Total (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div style={{ fontWeight: 600 }}>{selectedInvoice.destinationTitle || 'Luxury Expedition'}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Private transfers, all-inclusive luxury concierge</div>
                    </td>
                    <td>{selectedInvoice.roomType || 'Signature Luxury Suite'}</td>
                    <td>{selectedInvoice.guests || 2}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      ₹{Number(selectedInvoice.totalAmount || selectedInvoice.totalEstimatedPrice || 495000).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="invoice-totals">
                <div className="invoice-totals-row">
                  <span>Subtotal:</span>
                  <span>₹{Math.round((selectedInvoice.totalAmount || selectedInvoice.totalEstimatedPrice || 495000) * 0.82).toLocaleString('en-IN')}</span>
                </div>
                <div className="invoice-totals-row">
                  <span>Integrated GST (18%):</span>
                  <span>₹{Math.round((selectedInvoice.totalAmount || selectedInvoice.totalEstimatedPrice || 495000) * 0.18).toLocaleString('en-IN')}</span>
                </div>
                <div className="invoice-totals-row grand-total">
                  <span>Amount Paid:</span>
                  <span style={{ color: '#047857' }}>
                    ₹{Number(selectedInvoice.paidAmount || selectedInvoice.totalAmount || selectedInvoice.totalEstimatedPrice || 495000).toLocaleString('en-IN')}
                  </span>
                </div>
                {(selectedInvoice.remainingAmount > 0) && (
                  <div className="invoice-totals-row" style={{ color: '#b45309', fontWeight: 600 }}>
                    <span>Remaining Balance Due:</span>
                    <span>₹{Number(selectedInvoice.remainingAmount).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="invoice-print-actions">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => window.print()}
                  className="voyara-btn voyara-btn-dark"
                >
                  <span>🖨️ Print / Save as PDF</span>
                </button>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setSelectedInvoice(null)}
                  className="invoice-btn"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Retry Payment Modal */}
        {isModalOpen && retryBooking && (
          <BookingModal
            destination={retryBooking}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
