const { Router } = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = Router();

const DEMO_USERS = [
  {
    id: 'user-demo-traveller',
    name: 'Eleanor Vance',
    email: 'traveller@travelyn.com',
    password: 'password123',
    role: 'traveller',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    memberSince: '2024',
    tier: 'Patron of Travelyn'
  },
  {
    id: 'user-demo-admin',
    name: 'Laurent de Valois',
    email: 'admin@travelyn.com',
    password: 'admin',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    memberSince: '2022',
    tier: 'Founding Custodian (Admin)'
  }
];

// In-memory fallback
let inMemoryUsers = [...DEMO_USERS];

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password.'
      });
    }

    const trimmed = email.trim().toLowerCase();

    // Check DB if connected
    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: trimmed });
    }

    // Fallback to in-memory
    if (!user) {
      user = inMemoryUsers.find(u => u.email.toLowerCase() === trimmed);
    }

    // Allow default demo admin & traveller credentials even if DB had not seeded yet
    if (!user) {
      if (trimmed === 'admin@travelyn.com' && password === 'admin') {
        user = DEMO_USERS[1];
      } else if (trimmed === 'traveller@travelyn.com' && password === 'password123') {
        user = DEMO_USERS[0];
      }
    }

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Please verify your email and password.'
      });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      memberSince: user.memberSince,
      tier: user.tier
    };

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: safeUser,
      token: `token-${user.id}-${Date.now()}`
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Authentication failed',
      details: err.message
    });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email and password.'
      });
    }

    const trimmed = email.trim().toLowerCase();

    // Check for existing
    if (mongoose.connection.readyState === 1) {
      const existing = await User.findOne({ email: trimmed });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email already exists. Please sign in.'
        });
      }
    } else {
      const existing = inMemoryUsers.find(u => u.email.toLowerCase() === trimmed);
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email already exists. Please sign in.'
        });
      }
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: (name && name.trim()) || trimmed.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: trimmed,
      password: password,
      role: trimmed.includes('admin') ? 'admin' : 'traveller',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      memberSince: new Date().getFullYear().toString(),
      tier: 'Voyager Member'
    };

    if (mongoose.connection.readyState === 1) {
      await User.create(newUser);
    }
    inMemoryUsers.push(newUser);

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      memberSince: newUser.memberSince,
      tier: newUser.tier
    };

    return res.status(201).json({
      success: true,
      message: `Welcome to Travelyn, ${newUser.name}!`,
      user: safeUser,
      token: `token-${newUser.id}-${Date.now()}`
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Registration failed',
      details: err.message
    });
  }
});

// GET /api/auth/users
router.get('/users', async (_req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const dbUsers = await User.find().select('-password').lean();
      return res.json({ success: true, total: dbUsers.length, data: dbUsers });
    }
    const safeList = inMemoryUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      memberSince: u.memberSince,
      tier: u.tier
    }));
    return res.json({ success: true, total: safeList.length, data: safeList });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
