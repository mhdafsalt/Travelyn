'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import BookingModal from '@/components/BookingModal';
import '../payment.css';

function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId') || searchParams.get('id') || '';
  const reason = searchParams.get('reason') || 'Transaction was cancelled or declined by the payment gateway.';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fallbackDestination = {
    id: 'dest-1',
    title: 'Travelyn Luxury Expedition',
    price: 495000,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
  };

  return (
    <div className="payment-result-page">
      <div className="payment-result-card">
        {/* Header with failure icon */}
        <div className="payment-result-header">
          <div className="payment-icon-wrap is-failed">✕</div>
          <span className="payment-test-pill" style={{ color: '#b91c1c', borderColor: '#fecaca', background: '#fef2f2' }}>
            ● PAYMENT ATTEMPT FAILED OR CANCELLED
          </span>
          <h1 className="payment-result-title">Payment Unsuccessful</h1>
          <p className="payment-result-desc">
            {reason} No funds have been captured. Your journey reservation reference remains saved and pending payment.
          </p>
        </div>

        {/* Failed Details Box */}
        <div className="payment-receipt-box">
          {bookingId && (
            <div className="receipt-row">
              <span className="receipt-k">Pending Booking Reference:</span>
              <span className="receipt-v code">{bookingId}</span>
            </div>
          )}
          <div className="receipt-row">
            <span className="receipt-k">Gateway Status:</span>
            <span className="receipt-v" style={{ color: '#b91c1c' }}>Failed / Incomplete</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-k">Reservation Hold:</span>
            <span className="receipt-v" style={{ color: '#b45309' }}>24 Hours Courtesy Hold Active</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="payment-result-actions">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="voyara-btn voyara-btn-dark"
          >
            <span>Retry Payment with Razorpay</span>
            <span className="voyara-arrow-circle">↻</span>
          </button>
          <Link href="/destinations" className="secondary-action-btn">
            <span>Return to Expeditions</span>
          </Link>
          <Link href="/bookings" className="secondary-action-btn">
            <span>View My Bookings</span>
          </Link>
        </div>

        {isModalOpen && (
          <BookingModal
            destination={fallbackDestination}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialData={{
              existingBookingId: bookingId
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={
      <div className="payment-result-page">
        <div className="payment-result-card" style={{ padding: '60px 20px' }}>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <PaymentFailureContent />
    </Suspense>
  );
}
