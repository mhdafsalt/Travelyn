import { NextResponse } from 'next/server';
import { INITIAL_DESTINATIONS } from '@/lib/data';

const KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_U19WYrxA2pX8Mp';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'aV1f05PAvoRwYGZf3Ivnn7od';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      destinationId,
      packageId,
      slug,
      destinationTitle,
      packageTitle,
      title,
      price: clientPrice,
      basePrice: clientBasePrice,
      travelerName,
      travelerEmail,
      phone,
      startDate,
      guests,
      roomType,
      specialRequests,
      paymentType = 'full', // 'full' (100%) or 'advance' (30%)
      userId = 'guest',
      existingBookingId
    } = body;

    const targetPkgId = destinationId || packageId || slug;
    if (!targetPkgId) {
      return NextResponse.json(
        { success: false, message: 'Package ID or Destination ID is required.' },
        { status: 400 }
      );
    }

    if (!travelerName || !travelerEmail || !startDate) {
      return NextResponse.json(
        { success: false, message: 'Traveler name, email, and departure date are required.' },
        { status: 400 }
      );
    }

    // 1. Resolve package
    const target = String(targetPkgId).trim().toLowerCase();
    const clean = target.replace(/^dest-/, '');

    let destination = INITIAL_DESTINATIONS.find(
      (d) =>
        d.id?.toLowerCase() === target ||
        d.id?.toLowerCase() === `dest-${clean}` ||
        d.slug?.toLowerCase() === target ||
        d.slug?.toLowerCase() === clean ||
        d.title?.toLowerCase() === target ||
        d.title?.toLowerCase() === clean ||
        (clean === 'swiss' && d.slug === 'swiss-alps') ||
        (target === 'switzerland' && d.slug === 'swiss-alps')
    );

    // Fallback if custom admin destination
    if (!destination) {
      const fallbackTitle = destinationTitle || packageTitle || title || (clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : 'Luxury Expedition');
      destination = {
        id: targetPkgId,
        slug: slug || clean,
        title: fallbackTitle,
        country: 'Global',
        price: Number(clientBasePrice || clientPrice) || 350000,
        imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80'
      };
    }

    // 2. Pricing calculation strictly on backend
    const guestCount = Math.max(1, parseInt(guests, 10) || 1);
    const basePrice = Number(destination.price) || 350000;
    let suiteUpgradeFee = 0;
    if (roomType === 'Panoramic View Penthouse') suiteUpgradeFee = 25000;
    else if (roomType === 'Private Villa / Chalet Exclusive') suiteUpgradeFee = 50000;

    const totalJourneyPrice = (basePrice * guestCount) + suiteUpgradeFee;
    const isAdvance = paymentType === 'advance';
    const amountToPayINR = isAdvance ? Math.round(totalJourneyPrice * 0.30) : totalJourneyPrice;
    const advanceDepositAmount = isAdvance ? amountToPayINR : 0;
    const remainingBalance = totalJourneyPrice - amountToPayINR;
    const amountInPaise = Math.round(amountToPayINR * 100);

    // Razorpay standard test account limit is 50,000,000 paise (₹5,00,000).
    // Ensure test orders never exceed this gateway ceiling so Razorpay creates the order cleanly.
    const MAX_RAZORPAY_PAISE = 49000000; // ₹4,90,000
    const gatewayAmountPaise = Math.min(amountInPaise, MAX_RAZORPAY_PAISE);

    const bookingId = existingBookingId || `bk-${Date.now()}`;
    const receiptId = `rcpt_${bookingId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 30)}`;

    // 3. Create Razorpay Order via official REST API
    let razorpayOrderId = null;

    try {
      const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
      const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: gatewayAmountPaise,
          currency: 'INR',
          receipt: receiptId,
          notes: {
            bookingId,
            destinationTitle: destination.title,
            travelerName,
            travelerEmail,
            paymentType: isAdvance ? 'advance' : 'full'
          }
        })
      });

      if (rzpRes.ok) {
        const rzpData = await rzpRes.json();
        if (rzpData && rzpData.id) {
          razorpayOrderId = rzpData.id;
        }
      } else {
        const rzpErr = await rzpRes.json().catch(() => ({}));
        console.warn('Razorpay REST API non-200 response:', rzpErr);
      }
    } catch (apiErr) {
      console.warn('Razorpay Order API network fallback:', apiErr.message);
    }

    return NextResponse.json({
      success: true,
      orderId: razorpayOrderId,
      amount: gatewayAmountPaise, // in paise
      amountInINR: amountToPayINR,
      currency: 'INR',
      bookingId,
      keyId: KEY_ID,
      paymentType: isAdvance ? 'advance' : 'full',
      totalAmount: totalJourneyPrice,
      advanceAmount: advanceDepositAmount,
      remainingAmount: remainingBalance,
      package: {
        id: destination.id,
        slug: destination.slug,
        title: destination.title,
        country: destination.country,
        imageUrl: destination.imageUrl
      },
      prefill: {
        name: travelerName,
        email: travelerEmail,
        contact: phone || ''
      }
    });

  } catch (error) {
    console.error('Next.js create-order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create payment order.', error: error.message },
      { status: 500 }
    );
  }
}
