const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  subscribedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'active', enum: ['active', 'unsubscribed'] }
}, {
  timestamps: true
});

module.exports = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);
