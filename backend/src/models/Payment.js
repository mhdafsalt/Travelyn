const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  bookingId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: String,
    default: 'guest',
    index: true
  },
  packageId: {
    type: String,
    required: true,
    index: true
  },
  gateway: {
    type: String,
    default: 'razorpay'
  },
  razorpayOrderId: {
    type: String,
    required: true,
    index: true
  },
  razorpayPaymentId: {
    type: String,
    index: true
  },
  razorpaySignature: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    required: true // Stored in INR
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    default: 'upi' // upi, card, netbanking, wallet
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Captured', 'Failed', 'Refunded', 'Partially Refunded'],
    default: 'Pending',
    index: true
  },
  paymentType: {
    type: String,
    enum: ['full', 'advance'],
    default: 'full'
  },
  isTest: {
    type: Boolean,
    default: true
  },
  receipt: {
    type: String,
    default: ''
  },
  errorDescription: {
    type: String,
    default: ''
  },
  rawResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  transactionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
