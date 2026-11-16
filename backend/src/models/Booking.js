const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  destinationId: { type: String, required: true },
  destinationTitle: { type: String, default: 'Custom Journey' },
  travelerName: { type: String, required: true },
  travelerEmail: { type: String, required: true },
  phone: { type: String, default: '' },
  startDate: { type: String, required: true },
  guests: { type: Number, default: 2 },
  roomType: { type: String, default: 'Signature Luxury Suite' },
  specialRequests: { type: String, default: '' },
  totalEstimatedPrice: { type: Number, default: 0 },
  status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'cancelled'] }
}, {
  timestamps: true
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
