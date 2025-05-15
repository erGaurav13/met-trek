const express = require('express');
const CORS = require('cors');
const app = express();
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const AllRoutes = require('./src/routes/index.routes');

require('dotenv').config();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

// Logging requests
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Middleware
app.use(helmet()); // For securing HTTP headers
app.use(compression()); // To compress the response body
app.use(CORS()); // For Cross-Origin Resource Sharing
app.use(express.urlencoded({ extended: true })); // For handling URL-encoded data
app.use(express.json({ limit: '10kb' })); // For handling JSON data
app.use(limiter); // For rate limiting requests

// Timeout handler
app.use((req, res, next) => {
  res.setTimeout(5000, () => {
    res.status(408).send('Request Timeout');
  });
  next();
});

// Routes

app.use('/auth', AllRoutes.authRoutes);
app.use('/creator', AllRoutes.caseStudyRoutes);
app.use('/admin', AllRoutes.analyticsRoutes);

app.get('/health', (req, res) => {
  const healthStatus = {
    status: 'ok',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: Date.now(),
  };
  res.json(healthStatus);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  app.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

module.exports = app;
