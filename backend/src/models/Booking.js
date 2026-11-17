const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  bookingId: { type: String, index: true },
  userId: { type: String, default: 'guest', index: true },
  packageId: { type: String },
  destinationId: { type: String, required: true, index: true },
  destinationTitle: { type: String, default: 'Custom Journey' },
  travelerName: { type: String, required: true },
  travelerEmail: { type: String, required: true },
  phone: { type: String, default: '' },
  travellerDetails: {
    name: { type: String },
    email: { type: String },
    phone: { type: String }
  },
  startDate: { type: String, required: true },
  departureDate: { type: String },
  guests: { type: Number, default: 2 },
  travellerCount: { type: Number, default: 2 },
  roomType: { type: String, default: 'Signature Luxury Suite' },
  specialRequests: { type: String, default: '' },
  totalEstimatedPrice: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  paymentType: { type: String, enum: ['full', 'advance'], default: 'full' },
  advanceAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'confirmed', 'cancelled']
  },
  bookingStatus: {
    type: String,
    default: 'Pending Payment',
    enum: ['Pending Payment', 'Confirmed', 'Cancelled', 'Refund Processing', 'Refunded'],
    index: true
  },
  paymentStatus: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Processing', 'Captured', 'Failed', 'Refunded', 'Partially Refunded'],
    index: true
  },
  razorpayOrderId: { type: String, index: true },
  razorpayPaymentId: { type: String, index: true }
}, {
  timestamps: true
});

// Sync redundant fields before save for seamless backward compatibility
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) this.bookingId = this.id;
  if (!this.packageId) this.packageId = this.destinationId;
  if (!this.travellerCount) this.travellerCount = this.guests;
  if (!this.departureDate) this.departureDate = this.startDate;
  if (!this.totalAmount && this.totalEstimatedPrice) this.totalAmount = this.totalEstimatedPrice;
  if (!this.totalEstimatedPrice && this.totalAmount) this.totalEstimatedPrice = this.totalAmount;
  if (!this.travellerDetails) {
    this.travellerDetails = {
      name: this.travelerName,
      email: this.travelerEmail,
      phone: this.phone
    };
  }
  next();
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
