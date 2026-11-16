const path = require('path');
const dotenv = require('dotenv');

// Robust dotenv loading: always loads backend/.env regardless of current working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const destinationsRouter = require('./routes/destinations');
const bookingsRouter = require('./routes/bookings');
const newsletterRouter = require('./routes/newsletter');
const contactRouter = require('./routes/contact');
const showcaseRouter = require('./routes/showcase');
const authRouter = require('./routes/auth');
const aiPlannerRouter = require('./routes/aiPlanner');

const app = express();
const DESIRED_PORT = Number(process.env.PORT) || 5001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://travelyn-nu.vercel.app';

// Dynamic CORS configuration allowing localhost and production Vercel frontend domains
const allowedOriginsList = [
  'https://travelyn-nu.vercel.app',
  'https://travelyn-s5a4.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  'http://localhost:5001',
  ...(process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*' ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) : []),
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.trim()] : [])
];

app.use(cors({
  origin: function (origin, callback) {
    // Requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Allow localhost during local dev
    if (origin.startsWith('http://localhost:')) return callback(null, true);

    // Allow Travelyn Vercel domains (production & preview branches)
    if (/^https:\/\/travelyn.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    if (allowedOriginsList.includes(origin) || CORS_ORIGIN === '*') {
      return callback(null, true);
    }

    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
app.use(express.json());

// Serverless cached MongoDB Atlas connection
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    cachedDb = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false,
    });
    console.log(`🍃 Connected to MongoDB Atlas successfully! [Database: ${cachedDb.connection.name || 'Travelyn'}]`);
    const { seedDatabaseIfEmpty } = require('./models/seeder');
    await seedDatabaseIfEmpty();
    return cachedDb;
  } catch (err) {
    console.error('❌ MongoDB Atlas connection error:', err.message);
    if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
      console.error('👉 Tip: Check your MongoDB Atlas username and password in MONGODB_URI.');
    } else if (err.message.includes('ETIMEDOUT') || err.message.includes('selection timed out')) {
      console.error('👉 Tip: Check your MongoDB Atlas Network Access (Allow Access from Anywhere: 0.0.0.0/0).');
    }
    cachedDb = null;
    return null;
  }
}

// Connect immediately on cold start
if (process.env.MONGODB_URI) {
  connectToDatabase();
}

// Middleware ensuring DB connection is ready before handling any request
app.use(async (_req, _res, next) => {
  if (process.env.MONGODB_URI && mongoose.connection.readyState !== 1) {
    await connectToDatabase();
  }
  next();
});

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = dbStates[mongoose.connection.readyState] || 'disconnected';
  res.json({
    status: 'ok',
    service: 'Travelyn Luxury Travel API',
    port: DESIRED_PORT,
    database: {
      type: 'MongoDB Atlas',
      status: dbState,
      name: mongoose.connection.name || 'Travelyn'
    },
    timestamp: new Date().toISOString()
  });
});

// Root API status endpoint
app.get('/', (_req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = dbStates[mongoose.connection.readyState] || 'disconnected';
  res.json({
    success: true,
    service: 'Travelyn Luxury Travel Backend API',
    status: 'online',
    version: '1.0.0',
    database: {
      type: 'MongoDB Atlas',
      status: dbState,
      name: mongoose.connection.name || 'Travelyn'
    },
    endpoints: {
      health: '/api/health',
      destinations: '/api/destinations',
      bookings: '/api/bookings',
      contact: '/api/contact',
      inquiries: '/api/inquiries',
      newsletter: '/api/newsletter',
      showcase: '/api/showcase/auth',
      auth: '/api/auth/login',
      aiPlanner: '/api/ai-planner'
    }
  });
});

// Routes
app.use('/api/destinations', destinationsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/contact', contactRouter);
app.use('/api/inquiries', contactRouter);
app.use('/api/showcase', showcaseRouter);
app.use('/api/auth', authRouter);
app.use('/api/ai-planner', aiPlannerRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Start server with graceful fallback if default port is occupied
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`✨ Travelyn Travel Backend API listening on http://localhost:${port}`);
    console.log(`📍 Health Check: http://localhost:${port}/api/health`);
    console.log(`📍 Destinations: http://localhost:${port}/api/destinations`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = port === 5000 ? 5001 : port + 1;
      console.warn(`⚠️ Port ${port} is occupied. Automatically trying http://localhost:${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('Server startup error:', err);
    }
  });

  return server;
}

if (!process.env.VERCEL) {
  startServer(DESIRED_PORT);
}

module.exports = app;
