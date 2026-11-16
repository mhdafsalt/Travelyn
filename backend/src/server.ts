import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import destinationsRouter from './routes/destinations';
import bookingsRouter from './routes/bookings';
import newsletterRouter from './routes/newsletter';
import contactRouter from './routes/contact';

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Start server with graceful fallback if default port is occupied
function startServer(port: number) {
  const server = app.listen(port, () => {
    console.log(`✨ Travelyn Travel Backend API listening on http://localhost:${port}`);
    console.log(`📍 Health Check: http://localhost:${port}/api/health`);
    console.log(`📍 Destinations: http://localhost:${port}/api/destinations`);
  });

  server.on('error', (err: any) => {
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
  mongoose
    .connect(MONGODB_URI)
    .then((conn) => {
      console.log(`🍃 Connected to MongoDB Atlas successfully! [Database: ${conn.connection.name || 'Travelyn'}]`);
    })
    .catch((err: any) => {
      console.error('❌ MongoDB Atlas connection error:', err.message);
    });
} else {
  console.log('ℹ️ No MONGODB_URI found in .env (running in-memory)');
}

startServer(DESIRED_PORT);

export default app;
