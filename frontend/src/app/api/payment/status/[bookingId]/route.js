import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { bookingId } = await params;

    return NextResponse.json({
      success: true,
      booking: {
        id: bookingId,
        bookingId,
        destinationTitle: 'Travelyn Luxury Journey',
        travelerName: 'Valued Passenger',
        guests: 2,
        startDate: '2026-06-15',
        bookingStatus: 'Confirmed',
        paymentStatus: 'Captured',
        paidAmount: 495000,
        remainingAmount: 0,
        razorpayPaymentId: 'pay_test_verified',
        createdAt: new Date().toISOString()
      },
      payment: {
        paymentId: `pay_test_${bookingId}`,
        razorpayPaymentId: 'pay_test_verified',
        amount: 495000,
        currency: 'INR',
        paymentMethod: 'Razorpay UPI / Cards (Test Mode)',
        paymentStatus: 'Captured',
        transactionDate: new Date().toISOString(),
        isTest: true
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch status.' },
      { status: 500 }
    );
  }
}
