const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, index: true },
  title: { type: String, required: true },
  country: { type: String, required: true },
  region: { type: String, required: true },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  durationDays: { type: Number, default: 7 },
  rating: { type: Number, default: 4.9 },
  reviewCount: { type: Number, default: 120 },
  season: { type: String, default: 'All Year' },
  groupSize: { type: String, default: '2 – 8 guests' },
  category: [{ type: String }],
  imageUrl: { type: String, default: '' },
  gallery: [{ type: String }],
  highlights: [{ type: String }],
  itinerary: [{
    day: Number,
    title: String,
    description: String
  }],
  included: [{ type: String }],
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.models.Destination || mongoose.model('Destination', destinationSchema);
