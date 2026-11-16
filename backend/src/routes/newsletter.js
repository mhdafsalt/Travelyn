const { Router } = require('express');
const mongoose = require('mongoose');
const Subscriber = require('../models/Subscriber');

const router = Router();
const inMemorySubscribers = [
  {
    id: 'sub-1',
    email: 'traveler@travelyn.com',
    subscribedAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  }
];

// POST subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
      return;
    }

    const normalized = email.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const existing = await Subscriber.findOne({ email: normalized });
      if (existing) {
        return res.json({
          success: true,
          message: 'You are already subscribed to Travelyn stories! Check your inbox soon.'
        });
      }

      const newSub = await Subscriber.create({
        id: `sub-${Date.now()}`,
        email: normalized,
        status: 'active'
      });

      return res.status(201).json({
        success: true,
        message: 'Welcome to the Travelyn community. Your first journey inspiration is on its way.',
        data: newSub
      });
    }

    const existing = inMemorySubscribers.find(s => s.email.toLowerCase() === normalized);
    if (existing) {
      return res.json({
        success: true,
        message: 'You are already subscribed to Travelyn stories! Check your inbox soon.'
      });
    }

    const newSub = {
      id: `sub-${Date.now()}`,
      email: normalized,
      subscribedAt: new Date().toISOString(),
      status: 'active'
    };

    inMemorySubscribers.push(newSub);

    res.status(201).json({
      success: true,
      message: 'Welcome to the Travelyn community. Your first journey inspiration is on its way.',
      data: newSub
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Subscription failed', error: err.message });
  }
});

// GET all subscribers (admin/internal)
router.get('/', async (_req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const dbSubs = await Subscriber.find().sort({ subscribedAt: -1 }).lean();
      return res.json({
        success: true,
        total: dbSubs.length,
        data: dbSubs
      });
    }

    res.json({
      success: true,
      total: inMemorySubscribers.length,
      data: inMemorySubscribers
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve subscribers', error: err.message });
  }
});

module.exports = router;
