const { Router } = require('express');
const mongoose = require('mongoose');
const Inquiry = require('../models/Inquiry');

const router = Router();
const inMemoryInquiries = [];

// POST submit custom inquiry / contact form
router.post('/', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      destinationPreference,
      travelDates,
      budgetRange,
      guestCount,
      message
    } = req.body;

    if (!fullName || !email || !message) {
      res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and your journey vision message.'
      });
      return;
    }

    const newInquiry = {
      id: `inq-${Date.now()}`,
      fullName,
      email,
      phone: phone || '',
      destinationPreference: destinationPreference || 'Curated Signature Itinerary',
      travelDates: travelDates || '',
      budgetRange: budgetRange || '',
      guestCount: Number(guestCount) || 2,
      message,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    if (mongoose.connection.readyState === 1) {
      await Inquiry.create(newInquiry);
    }

    inMemoryInquiries.unshift(newInquiry);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to Travelyn. A personal travel designer will tailor an itinerary and respond within 24 hours.',
      data: newInquiry
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit inquiry', error: err.message });
  }
});

// GET all inquiries
router.get('/', async (_req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const dbInquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
      return res.json({
        success: true,
        total: dbInquiries.length,
        data: dbInquiries
      });
    }

    res.json({
      success: true,
      total: inMemoryInquiries.length,
      data: inMemoryInquiries
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve inquiries', error: err.message });
  }
});

module.exports = router;
