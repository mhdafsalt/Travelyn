import { Router, Request, Response } from 'express';
import { ContactInquiry } from '../types';

const router = Router();
const inquiries: ContactInquiry[] = [];

// POST submit custom inquiry / contact form
router.post('/', (req: Request, res: Response) => {
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

  const newInquiry: ContactInquiry = {
    id: `inq-${Date.now()}`,
    fullName,
    email,
    phone,
    destinationPreference,
    travelDates,
    budgetRange,
    guestCount: Number(guestCount) || 2,
    message,
    createdAt: new Date().toISOString()
  };

  inquiries.push(newInquiry);

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out to Voyara. A personal travel designer will tailor an itinerary and respond within 24 hours.',
    data: newInquiry
  });
});

// GET all inquiries
router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    total: inquiries.length,
    data: inquiries
  });
});

export default router;
