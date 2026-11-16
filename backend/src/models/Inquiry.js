const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  destinationPreference: { type: String, default: '' },
  travelDates: { type: String, default: '' },
  budgetRange: { type: String, default: '' },
  guestCount: { type: Number, default: 2 },
  message: { type: String, required: true },
  status: { type: String, default: 'new', enum: ['new', 'contacted', 'resolved'] }
}, {
  timestamps: true
});

module.exports = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
