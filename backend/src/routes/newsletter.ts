import { Router, Request, Response } from 'express';
import { NewsletterSubscription } from '../types';

const router = Router();
const subscribers: NewsletterSubscription[] = [
  {
    id: 'sub-1',
    email: 'traveler@voyara.travel',
    subscribedAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  }
];

// POST subscribe to newsletter
router.post('/subscribe', (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
    return;
  }

  const normalized = email.trim().toLowerCase();
  const existing = subscribers.find(s => s.email.toLowerCase() === normalized);

  if (existing) {
    res.json({
      success: true,
      message: 'You are already subscribed to Voyara Travel stories! Check your inbox soon.'
    });
    return;
  }

  const newSub: NewsletterSubscription = {
    id: `sub-${Date.now()}`,
    email: normalized,
    subscribedAt: new Date().toISOString(),
    status: 'active'
  };

  subscribers.push(newSub);

  res.status(201).json({
    success: true,
    message: 'Welcome to the Voyara community. Your first journey inspiration is on its way.',
    data: newSub
  });
});

// GET all subscribers (admin/internal)
router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    total: subscribers.length,
    data: subscribers
  });
});

export default router;
