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

const app = express();
const DESIRED_PORT = Number(process.env.PORT) || 5001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
const allowedOrigins = CORS_ORIGIN === '*'
  ? '*'
  : Array.from(new Set([
      ...(CORS_ORIGIN.includes(',') ? CORS_ORIGIN.split(',').map(o => o.trim()) : [CORS_ORIGIN]),
      FRONTEND_URL
    ]));

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

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

// Routes
app.use('/api/destinations', destinationsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/contact', contactRouter);
app.use('/api/inquiries', contactRouter);
app.use('/api/showcase', showcaseRouter);

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

// Connect to MongoDB Atlas if MONGODB_URI is provided
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  console.log('⏳ Connecting to MongoDB Atlas...');
  const { seedDatabaseIfEmpty } = require('./models/seeder');

  mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    })
    .then(async (conn) => {
      console.log(`🍃 Connected to MongoDB Atlas successfully! [Database: ${conn.connection.name || 'Travelyn'}]`);
      await seedDatabaseIfEmpty();
    })
    .catch((err) => {
      console.error('❌ MongoDB Atlas connection error:', err.message);
      if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
        console.error('👉 Tip: Check your MongoDB Atlas username and password in MONGODB_URI.');
      } else if (err.message.includes('ETIMEDOUT') || err.message.includes('selection timed out')) {
        console.error('👉 Tip: Check your MongoDB Atlas Network Access (Allow Access from Anywhere: 0.0.0.0/0).');
      }
    });
} else {
  console.log('ℹ️ No MONGODB_URI found in .env (running in-memory)');
}

startServer(DESIRED_PORT);

module.exports = app;
