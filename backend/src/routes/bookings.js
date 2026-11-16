const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const bookingsData = require('../data/bookings.json');
const destinationsData = require('../data/destinations.json');

const router = Router();
const bookingsFilePath = path.join(__dirname, '../data/bookings.json');
let bookings = [...bookingsData];

// GET all bookings
router.get('/', async (_req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const dbBookings = await Booking.find().sort({ createdAt: -1 }).lean();
      return res.json({
        success: true,
        total: dbBookings.length,
        data: dbBookings
      });
    }

    res.json({
      success: true,
      total: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
  }
});

// POST new booking
router.post('/', async (req, res) => {
  try {
    const {
      destinationId,
      destinationTitle,
      travelerName,
      travelerEmail,
      phone,
      startDate,
      guests,
      roomType,
      specialRequests
    } = req.body;

    if (!destinationId || !travelerName || !travelerEmail || !startDate) {
      res.status(400).json({
        success: false,
        message: 'Missing required booking fields: destinationId, travelerName, travelerEmail, startDate are required.'
      });
      return;
    }

    const destination = destinationsData.find(d => d.id === destinationId || d.slug === destinationId);
    const guestNum = Number(guests) || 2;
    const basePrice = destination ? destination.price : 3500;
    const totalEstimatedPrice = basePrice * guestNum;

    const newBooking = {
      id: `bk-${Date.now()}`,
      destinationId: destination ? destination.id : destinationId,
      destinationTitle: destinationTitle || (destination ? destination.title : 'Custom Journey'),
      travelerName,
      travelerEmail,
      phone: phone || '',
      startDate,
      guests: guestNum,
      roomType: roomType || 'Luxury Ocean/Panorama Suite',
      specialRequests: specialRequests || '',
      totalEstimatedPrice,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (mongoose.connection.readyState === 1) {
      await Booking.create(newBooking);
    }

    bookings.unshift(newBooking);

    // Save to file safely as backup
    try {
      fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2), 'utf-8');
    } catch (e) {
      // ignore local file write error
    }

    res.status(201).json({
      success: true,
      message: 'Booking request received successfully! A Travelyn travel designer will contact you within 24 hours.',
      data: newBooking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create booking', error: error.message });
  }
});

// GET single booking by ID
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const dbBooking = await Booking.findOne({ id: req.params.id }).lean();
      if (dbBooking) {
        return res.json({ success: true, data: dbBooking });
      }
    }

    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve booking', error: error.message });
  }
});

module.exports = router;
