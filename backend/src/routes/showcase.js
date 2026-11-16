const { Router } = require('express');
const mongoose = require('mongoose');
const AuthShowcase = require('../models/AuthShowcase');

const router = Router();

const DEFAULT_AUTH_SHOWCASE = {
  login: {
    page: 'login',
    backdropImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=85',
    tagText: 'Bespoke Journeys',
    quote: 'Slow trains, quiet mountain villages, and the best fondue of our lives. We didn’t want to come home.',
    authorName: 'Claire & Tom',
    authorTrip: 'Swiss Alps · 2026 Journey',
    authorAvatarUrl: 'https://framerusercontent.com/images/cwjju4oQ9SWH1nkXN95LfTNt94.jpg',
    rating: '4.9',
    footerLeft: 'EST. 2014 — LISBON ATELIER',
    footerRight: 'PRIVATE MEMBER ACCESS'
  },
  signup: {
    page: 'signup',
    backdropImageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=85',
    tagText: 'Private Collective',
    quote: 'Travelyn doesn’t just book luxury rooms. They curate the quiet, irreplaceable memories of our lives.',
    authorName: 'Marcus Lindqvist',
    authorTrip: 'Stockholm · Patron Member',
    authorAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: '4.9',
    footerLeft: 'EST. 2014 — LISBON ATELIER',
    footerRight: 'FOUNDING PATRON PASS'
  }
};

// GET /api/showcase/auth
router.get('/auth', async (_req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const records = await AuthShowcase.find();
      const loginDoc = records.find(r => r.page === 'login');
      const signupDoc = records.find(r => r.page === 'signup');

      return res.json({
        success: true,
        data: {
          login: loginDoc ? loginDoc.toObject() : DEFAULT_AUTH_SHOWCASE.login,
          signup: signupDoc ? signupDoc.toObject() : DEFAULT_AUTH_SHOWCASE.signup
        }
      });
    }

    return res.json({
      success: true,
      data: DEFAULT_AUTH_SHOWCASE
    });
  } catch (err) {
    console.error('Error fetching auth showcase:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve auth showcase data',
      error: err.message,
      data: DEFAULT_AUTH_SHOWCASE
    });
  }
});

// PUT /api/showcase/auth
router.put('/auth', async (req, res) => {
  try {
    const { login, signup } = req.body;

    if (mongoose.connection.readyState === 1) {
      const results = {};

      if (login) {
        const updatedLogin = await AuthShowcase.findOneAndUpdate(
          { page: 'login' },
          { ...login, page: 'login', updatedAt: new Date() },
          { new: true, upsert: true }
        );
        results.login = updatedLogin.toObject();
      }

      if (signup) {
        const updatedSignup = await AuthShowcase.findOneAndUpdate(
          { page: 'signup' },
          { ...signup, page: 'signup', updatedAt: new Date() },
          { new: true, upsert: true }
        );
        results.signup = updatedSignup.toObject();
      }

      return res.json({
        success: true,
        message: 'Auth showcase updated successfully in MongoDB Atlas!',
        data: results
      });
    }

    return res.json({
      success: true,
      message: 'Auth showcase updated (in-memory mode)',
      data: {
        login: login || DEFAULT_AUTH_SHOWCASE.login,
        signup: signup || DEFAULT_AUTH_SHOWCASE.signup
      }
    });
  } catch (err) {
    console.error('Error updating auth showcase:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update auth showcase settings',
      error: err.message
    });
  }
});

module.exports = router;
