const mongoose = require('mongoose');

const AuthShowcaseSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    unique: true,
    enum: ['login', 'signup']
  },
  backdropImageUrl: {
    type: String,
    required: true
  },
  tagText: {
    type: String,
    default: 'Bespoke Journeys'
  },
  quote: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorTrip: {
    type: String,
    required: true
  },
  authorAvatarUrl: {
    type: String,
    default: 'https://framerusercontent.com/images/cwjju4oQ9SWH1nkXN95LfTNt94.jpg'
  },
  rating: {
    type: String,
    default: '4.9'
  },
  footerLeft: {
    type: String,
    default: 'EST. 2014 — LISBON ATELIER'
  },
  footerRight: {
    type: String,
    default: 'PRIVATE MEMBER ACCESS'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.AuthShowcase || mongoose.model('AuthShowcase', AuthShowcaseSchema);
