import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import bookingsData from '../data/bookings.json';
import destinationsData from '../data/destinations.json';
import { Booking } from '../types';

const router = Router();
const bookingsFilePath = path.join(__dirname, '../data/bookings.json');
let bookings: Booking[] = [...bookingsData] as Booking[];

// GET all bookings
router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    total: bookings.length,
    data: bookings
  });
});

// POST new booking
router.post('/', (req: Request, res: Response) => {
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

    const destination = (destinationsData as any[]).find(d => d.id === destinationId || d.slug === destinationId);
    const guestNum = Number(guests) || 2;
    const basePrice = destination ? destination.price : 3500;
    const totalEstimatedPrice = basePrice * guestNum;

    const newBooking: Booking = {
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

    bookings.unshift(newBooking);

    // Save to file safely
    try {
      fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not write to bookings.json directly, keeping in memory:', e);
    }

    res.status(201).json({
      success: true,
      message: 'Booking request received successfully! A Voyara travel designer will contact you within 24 hours.',
      data: newBooking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create booking', error });
  }
});

// GET single booking by ID
router.get('/:id', (req: Request, res: Response) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) {
    res.status(404).json({ success: false, message: 'Booking not found' });
    return;
  }
  res.json({ success: true, data: booking });
});

export default router;
