import express from 'express';
import cors from 'cors';
import destinationsRouter from './routes/destinations';
import bookingsRouter from './routes/bookings';
import newsletterRouter from './routes/newsletter';
import contactRouter from './routes/contact';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Travelyn Luxury Travel API',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/destinations', destinationsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/contact', contactRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✨ Travelyn Travel Backend API listening on http://localhost:${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Destinations: http://localhost:${PORT}/api/destinations`);
});

export default app;
