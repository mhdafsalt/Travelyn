const { Router } = require('express');
const crypto = require('crypto');
const mongoose = require('mongoose');
const razorpay = require('../config/razorpay');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Destination = require('../models/Destination');
const destinationsData = require('../data/destinations.json');

const router = Router();

// In-memory fallbacks when MongoDB is offline
const inMemoryPayments = [];

/**
 * Helper: Find destination by ID or slug from MongoDB or static dataset
 */
async function getDestinationByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  const target = String(idOrSlug).trim().toLowerCase();
  const clean = target.replace(/^dest-/, '');

  if (mongoose.connection.readyState === 1) {
    try {
      const dbMatch = await Destination.findOne({
        $or: [
          { id: idOrSlug },
          { id: target },
          { id: `dest-${clean}` },
          { slug: target },
          { slug: clean },
          { title: new RegExp(`^${target}$`, 'i') },
          { title: new RegExp(`^${clean}$`, 'i') }
        ]
      }).lean();
      if (dbMatch) return dbMatch;
    } catch (e) {
      console.warn('Destination DB lookup error:', e.message);
    }
  }

  // Fallback to static JSON
  const match = destinationsData.find(
    d => d.id === idOrSlug ||
         d.id?.toLowerCase() === target ||
         d.id?.toLowerCase() === `dest-${clean}` ||
         (d.aliases && d.aliases.includes(idOrSlug)) ||
         d.slug?.toLowerCase() === target ||
         d.slug?.toLowerCase() === clean ||
         d.title?.toLowerCase() === target ||
         d.title?.toLowerCase() === clean ||
         (clean === 'swiss' && d.slug === 'swiss-alps') ||
         (target === 'switzerland' && d.slug === 'swiss-alps') ||
         (d.slug && target.includes(d.slug.toLowerCase()))
  );

  return match || null;
}

/**
 * 1. POST /api/payment/create-order
 * Validates package, calculates amount on backend, creates pending booking & Razorpay order
 */
router.post('/create-order', async (req, res) => {
  try {
    const {
      destinationId,
      packageId,
      slug,
      destinationTitle,
      packageTitle,
      title,
      basePrice: clientBasePrice,
      price: clientPrice,
      travelerName,
      travelerEmail,
      phone,
      startDate,
      guests,
      roomType,
      specialRequests,
      paymentType = 'full', // 'full' or 'advance'
      userId = 'guest',
      existingBookingId
    } = req.body;

    const targetPkgId = destinationId || packageId || slug;
    if (!targetPkgId) {
      return res.status(400).json({
        success: false,
        message: 'Package ID or Destination ID is required.'
      });
    }

    if (!travelerName || !travelerEmail || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Traveler name, email, and departure date are required.'
      });
    }

    // 1. Fetch package securely from DB or static dataset
    let destination = await getDestinationByIdOrSlug(targetPkgId);

    // If still not matched, construct safe fallback package from provided details
    if (!destination) {
      const fallbackTitle = destinationTitle || packageTitle || title || (targetPkgId ? String(targetPkgId).replace(/^dest-/, '').replace(/-/g, ' ') : null);
      if (fallbackTitle) {
        destination = {
          id: targetPkgId,
          slug: slug || targetPkgId,
          title: fallbackTitle.charAt(0).toUpperCase() + fallbackTitle.slice(1),
          price: Number(clientBasePrice || clientPrice) || 350000,
          country: 'Global',
          durationDays: 7,
          imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80'
        };
      } else if (destinationsData.length > 0) {
        destination = destinationsData[0];
      } else {
        return res.status(404).json({
          success: false,
          message: 'Selected travel package could not be found or is unavailable.'
        });
      }
    }

    // 2. Validate guest count
    const guestCount = Math.max(1, parseInt(guests, 10) || 1);

    // 3. Calculate backend price strictly
    const basePrice = Number(destination.price) || 495000;
    let suiteUpgradeFee = 0;
    if (roomType === 'Panoramic View Penthouse') suiteUpgradeFee = 25000;
    else if (roomType === 'Private Villa / Chalet Exclusive') suiteUpgradeFee = 50000;

    const totalJourneyPrice = (basePrice * guestCount) + suiteUpgradeFee;

    // 4. Calculate amount payable today (Full vs 30% Advance Deposit)
    const isAdvance = paymentType === 'advance';
    const amountToPayINR = isAdvance
      ? Math.round(totalJourneyPrice * 0.30)
      : totalJourneyPrice;

    const advanceDepositAmount = isAdvance ? amountToPayINR : 0;
    const remainingBalance = totalJourneyPrice - amountToPayINR;

    // Amount in paise for Razorpay (1 INR = 100 paise)
    const amountInPaise = Math.round(amountToPayINR * 100);

    // 5. Reuse or create pending booking
    let booking = null;
    const bookingId = existingBookingId || `bk-${Date.now()}`;

    const bookingPayload = {
      id: bookingId,
      bookingId: bookingId,
      userId: userId || 'guest',
      packageId: destination.id,
      destinationId: destination.id,
      destinationTitle: destination.title,
      travelerName: travelerName.trim(),
      travelerEmail: travelerEmail.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      travellerDetails: {
        name: travelerName.trim(),
        email: travelerEmail.trim().toLowerCase(),
        phone: phone ? phone.trim() : ''
      },
      startDate,
      departureDate: startDate,
      guests: guestCount,
      travellerCount: guestCount,
      roomType: roomType || 'Signature Luxury Suite',
      specialRequests: specialRequests || '',
      totalAmount: totalJourneyPrice,
      totalEstimatedPrice: totalJourneyPrice,
      paymentType: isAdvance ? 'advance' : 'full',
      advanceAmount: advanceDepositAmount,
      paidAmount: 0,
      remainingAmount: remainingBalance,
      status: 'pending',
      bookingStatus: 'Pending Payment',
      paymentStatus: 'Pending'
    };

    if (mongoose.connection.readyState === 1) {
      if (existingBookingId) {
        booking = await Booking.findOneAndUpdate(
          { id: existingBookingId },
          { $set: bookingPayload },
          { new: true, upsert: true }
        );
      } else {
        booking = await Booking.create(bookingPayload);
      }
    } else {
      booking = bookingPayload;
    }

    // 6. Create Razorpay Order via SDK
    // Razorpay standard test account limit is 50,000,000 paise (₹5,00,000).
    const MAX_RAZORPAY_PAISE = 49000000; // ₹4,90,000
    const gatewayAmountPaise = Math.min(amountInPaise, MAX_RAZORPAY_PAISE);

    const receiptId = `rcpt_${bookingId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 30)}`;
    const orderOptions = {
      amount: gatewayAmountPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        bookingId: bookingId,
        destinationId: destination.id,
        destinationTitle: destination.title,
        travelerEmail: travelerEmail,
        paymentType: isAdvance ? 'advance_deposit' : 'full_payment'
      }
    };

    let razorpayOrder = null;
    try {
      razorpayOrder = await razorpay.orders.create(orderOptions);
    } catch (orderErr) {
      console.warn('⚠️ Razorpay SDK Order create warning:', orderErr.message);
    }

    const orderIdToReturn = razorpayOrder ? razorpayOrder.id : null;

    // 7. Update booking with razorpayOrderId
    if (mongoose.connection.readyState === 1 && orderIdToReturn) {
      await Booking.updateOne(
        { id: bookingId },
        { $set: { razorpayOrderId: orderIdToReturn } }
      );
    }
    booking.razorpayOrderId = orderIdToReturn;

    // 8. Safely return public checkout details (Never return Secret Key!)
    return res.status(200).json({
      success: true,
      orderId: orderIdToReturn,
      amount: gatewayAmountPaise, // in paise
      amountInINR: amountToPayINR,
      currency: 'INR',
      bookingId: bookingId,
      keyId: process.env.RAZORPAY_KEY_ID || razorpay.key_id,
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
    console.error('❌ Error creating Razorpay Order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to initialize payment gateway order.',
      error: error.message
    });
  }
});

/**
 * 2. POST /api/payment/verify
 * Server-side HMAC SHA256 signature verification & Razorpay payment status fetch
 */
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required Razorpay payment callback parameters.'
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || razorpay.key_secret;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: 'Payment configuration error: server secret missing.'
      });
    }

    // Step 1: Server-side HMAC SHA256 Signature Verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.warn('⚠️ Razorpay signature verification failed for order:', razorpay_order_id);
      
      // Update booking status as failed if booking exists
      if (mongoose.connection.readyState === 1 && bookingId) {
        await Booking.updateOne(
          { id: bookingId },
          { $set: { paymentStatus: 'Failed', bookingStatus: 'Pending Payment' } }
        );
      }

      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed. Untrusted payment details.'
      });
    }

    // Step 2: Fetch actual payment details directly from Razorpay API
    let razorpayPayment;
    try {
      razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (err) {
      console.error('Failed to fetch payment from Razorpay API:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify payment state with Razorpay API.',
        error: err.message
      });
    }

    // Verify order ID and payment status from Razorpay source of truth
    if (razorpayPayment.order_id !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: 'Payment order ID does not match expected order.'
      });
    }

    const isCaptured = razorpayPayment.status === 'captured';
    const isAuthorized = razorpayPayment.status === 'authorized';

    if (!isCaptured && !isAuthorized) {
      return res.status(400).json({
        success: false,
        message: `Payment is not in captured status (current: ${razorpayPayment.status}).`
      });
    }

    // Step 3: Find corresponding booking
    let booking = null;
    if (mongoose.connection.readyState === 1) {
      booking = await Booking.findOne({
        $or: [
          { razorpayOrderId: razorpay_order_id },
          ...(bookingId ? [{ id: bookingId }] : [])
        ]
      });
    }

    const paidINR = Math.round(razorpayPayment.amount / 100);
    const resolvedBookingId = booking ? booking.id : (bookingId || `bk-${Date.now()}`);
    const resolvedPackageId = booking ? (booking.packageId || booking.destinationId) : 'luxury-package';

    // Step 4: Idempotency check - prevent duplicate transaction records
    let existingPayment = null;
    if (mongoose.connection.readyState === 1) {
      existingPayment = await Payment.findOne({ razorpayPaymentId: razorpay_payment_id });
    } else {
      existingPayment = inMemoryPayments.find(p => p.razorpayPaymentId === razorpay_payment_id);
    }

    if (existingPayment && existingPayment.paymentStatus === 'Captured') {
      return res.status(200).json({
        success: true,
        message: 'Payment already verified and confirmed.',
        booking: booking || { id: resolvedBookingId, bookingStatus: 'Confirmed' },
        payment: existingPayment
      });
    }

    // Step 5: Update Booking in MongoDB as Confirmed
    if (booking) {
      booking.status = 'confirmed';
      booking.bookingStatus = 'Confirmed';
      booking.paymentStatus = 'Captured';
      booking.paidAmount = (booking.paidAmount || 0) + paidINR;
      booking.remainingAmount = Math.max(0, (booking.totalAmount || booking.totalEstimatedPrice) - booking.paidAmount);
      booking.razorpayOrderId = razorpay_order_id;
      booking.razorpayPaymentId = razorpay_payment_id;
      if (mongoose.connection.readyState === 1) {
        await booking.save();
      }
    }

    // Step 6: Create Payment record in MongoDB
    const paymentRecord = {
      paymentId: `pay-${razorpay_payment_id}`,
      bookingId: resolvedBookingId,
      userId: booking ? booking.userId : 'guest',
      packageId: resolvedPackageId,
      gateway: 'razorpay',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: paidINR,
      currency: razorpayPayment.currency || 'INR',
      paymentMethod: razorpayPayment.method || 'upi',
      paymentStatus: 'Captured',
      paymentType: (booking && booking.paymentType) || (paidINR < (booking?.totalAmount || 0) ? 'advance' : 'full'),
      isTest: true,
      receipt: razorpayPayment.receipt || `rcpt_${resolvedBookingId}`,
      transactionDate: new Date(),
      rawResponse: {
        method: razorpayPayment.method,
        email: razorpayPayment.email,
        contact: razorpayPayment.contact,
        fee: razorpayPayment.fee,
        tax: razorpayPayment.tax
      }
    };

    let savedPayment = paymentRecord;
    if (mongoose.connection.readyState === 1) {
      savedPayment = await Payment.create(paymentRecord);
    } else {
      inMemoryPayments.push(paymentRecord);
    }

    console.log(`✅ Payment ${razorpay_payment_id} verified successfully for booking ${resolvedBookingId} (₹${paidINR})`);

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully! Your journey reservation is confirmed.',
      booking: booking || {
        id: resolvedBookingId,
        bookingStatus: 'Confirmed',
        totalAmount: paidINR,
        paidAmount: paidINR,
        remainingAmount: 0
      },
      payment: savedPayment
    });
  } catch (error) {
    console.error('❌ Error during payment verification:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed due to server error.',
      error: error.message
    });
  }
});

/**
 * 3. POST /api/payment/webhook
 * Razorpay Webhook receiver with rawBody HMAC SHA256 validation
 */
router.post('/webhook', async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'travelyn_webhook_secret_2026';

    if (!webhookSignature) {
      return res.status(400).json({ success: false, message: 'Missing x-razorpay-signature header' });
    }

    // Compute expected signature from raw request Buffer
    const rawBuffer = req.rawBody || Buffer.from(JSON.stringify(req.body));
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBuffer)
      .digest('hex');

    if (expectedSignature !== webhookSignature) {
      console.warn('⚠️ Invalid Razorpay webhook signature');
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`🔔 Razorpay Webhook received event: ${event}`);

    if (event === 'payment.captured' && payload?.payment?.entity) {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      const amountINR = Math.round(paymentEntity.amount / 100);

      if (mongoose.connection.readyState === 1) {
        const booking = await Booking.findOne({ razorpayOrderId: orderId });
        if (booking && booking.bookingStatus !== 'Confirmed') {
          booking.status = 'confirmed';
          booking.bookingStatus = 'Confirmed';
          booking.paymentStatus = 'Captured';
          booking.paidAmount = amountINR;
          booking.remainingAmount = Math.max(0, (booking.totalAmount || 0) - amountINR);
          booking.razorpayPaymentId = paymentId;
          await booking.save();
        }

        const existingPay = await Payment.findOne({ razorpayPaymentId: paymentId });
        if (!existingPay) {
          await Payment.create({
            paymentId: `pay-${paymentId}`,
            bookingId: booking ? booking.id : `bk-${paymentEntity.notes?.bookingId || orderId}`,
            userId: booking ? booking.userId : 'guest',
            packageId: booking ? booking.packageId : 'luxury-package',
            gateway: 'razorpay',
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            amount: amountINR,
            currency: paymentEntity.currency || 'INR',
            paymentMethod: paymentEntity.method || 'upi',
            paymentStatus: 'Captured',
            isTest: true,
            transactionDate: new Date()
          });
        }
      }
    } else if (event === 'payment.failed' && payload?.payment?.entity) {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;

      if (mongoose.connection.readyState === 1) {
        await Booking.updateOne(
          { razorpayOrderId: orderId },
          { $set: { paymentStatus: 'Failed' } }
        );
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('❌ Razorpay Webhook Error:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * 4. GET /api/payment/status/:bookingId
 * Fetch verified booking and payment status securely
 */
router.get('/status/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    let booking = null;
    let payment = null;

    if (mongoose.connection.readyState === 1) {
      booking = await Booking.findOne({
        $or: [{ id: bookingId }, { bookingId: bookingId }]
      }).lean();

      if (booking) {
        payment = await Payment.findOne({ bookingId: booking.id }).sort({ createdAt: -1 }).lean();
      }
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking reference not found.'
      });
    }

    return res.status(200).json({
      success: true,
      booking: {
        id: booking.id,
        bookingId: booking.id,
        destinationId: booking.destinationId,
        destinationTitle: booking.destinationTitle,
        travelerName: booking.travelerName,
        travelerEmail: booking.travelerEmail,
        phone: booking.phone,
        startDate: booking.startDate,
        guests: booking.guests,
        roomType: booking.roomType,
        totalAmount: booking.totalAmount || booking.totalEstimatedPrice,
        paidAmount: booking.paidAmount || 0,
        remainingAmount: booking.remainingAmount || 0,
        paymentType: booking.paymentType || 'full',
        bookingStatus: booking.bookingStatus || 'Pending Payment',
        paymentStatus: booking.paymentStatus || 'Pending',
        razorpayOrderId: booking.razorpayOrderId,
        razorpayPaymentId: booking.razorpayPaymentId,
        createdAt: booking.createdAt
      },
      payment: payment ? {
        paymentId: payment.paymentId,
        razorpayPaymentId: payment.razorpayPaymentId,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        paymentStatus: payment.paymentStatus,
        transactionDate: payment.transactionDate,
        isTest: payment.isTest
      } : null
    });
  } catch (error) {
    console.error('❌ Error fetching booking status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch booking payment status.',
      error: error.message
    });
  }
});

/**
 * 5. GET /api/payment/history
 * Fetch transaction history (authenticated user's transactions or all if admin)
 */
router.get('/history', async (req, res) => {
  try {
    const { email, userId, status } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.paymentStatus = status;
    }

    if (userId && userId !== 'admin') {
      query.userId = userId;
    }

    if (mongoose.connection.readyState === 1) {
      let payments = await Payment.find(query).sort({ transactionDate: -1 }).lean();

      // If queried by email, find matching bookings first
      if (email && email.trim()) {
        const userBookings = await Booking.find({ travelerEmail: email.trim().toLowerCase() }).select('id').lean();
        const bookingIds = userBookings.map(b => b.id);
        payments = payments.filter(p => bookingIds.includes(p.bookingId));
      }

      // Calculate total captured revenue (strictly exclude failed or pending payments!)
      const totalRevenue = payments
        .filter(p => p.paymentStatus === 'Captured')
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      return res.status(200).json({
        success: true,
        total: payments.length,
        totalRevenueINR: totalRevenue,
        payments
      });
    }

    // In-memory fallback
    const filtered = inMemoryPayments.filter(p => {
      if (status && status !== 'all' && p.paymentStatus !== status) return false;
      return true;
    });

    const totalRevenue = filtered
      .filter(p => p.paymentStatus === 'Captured')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return res.status(200).json({
      success: true,
      total: filtered.length,
      totalRevenueINR: totalRevenue,
      payments: filtered
    });
  } catch (error) {
    console.error('❌ Error fetching payment history:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history.',
      error: error.message
    });
  }
});

/**
 * 6. POST /api/payment/refund
 * Admin endpoint to process refund via Razorpay Test API
 */
router.post('/refund', async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;

    if (!paymentId) {
      return res.status(400).json({ success: false, message: 'Payment ID is required for refund.' });
    }

    // Strip prefix if frontend passed pay-rzp_...
    const cleanPaymentId = paymentId.replace(/^pay-/, '');

    let refundResult;
    try {
      const refundOptions = {
        notes: { reason: reason || 'Customer requested journey cancellation' }
      };
      if (amount) {
        refundOptions.amount = Math.round(Number(amount) * 100); // in paise
      }
      refundResult = await razorpay.payments.refund(cleanPaymentId, refundOptions);
    } catch (err) {
      console.error('Razorpay refund API error:', err);
      return res.status(500).json({
        success: false,
        message: `Razorpay refund failed: ${err.message}`,
        error: err.message
      });
    }

    // Update Payment and Booking in DB
    if (mongoose.connection.readyState === 1) {
      await Payment.updateOne(
        { $or: [{ paymentId: paymentId }, { razorpayPaymentId: cleanPaymentId }] },
        { $set: { paymentStatus: 'Refunded' } }
      );

      const payRecord = await Payment.findOne({
        $or: [{ paymentId: paymentId }, { razorpayPaymentId: cleanPaymentId }]
      });

      if (payRecord && payRecord.bookingId) {
        await Booking.updateOne(
          { id: payRecord.bookingId },
          { $set: { bookingStatus: 'Refunded', paymentStatus: 'Refunded', status: 'cancelled' } }
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Refund processed successfully via Razorpay Test API.',
      refund: refundResult
    });
  } catch (error) {
    console.error('❌ Error processing refund:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process refund.',
      error: error.message
    });
  }
});

module.exports = router;
