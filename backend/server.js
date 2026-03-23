const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { spawn } = require('child_process');
const { getLocalIPAddress } = require('./utils/network');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 24365;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'database', 'ecommerce.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    logger.error('Error opening database', err);
    console.error('Error opening database:', err.message);
  } else {
    logger.info('Connected to SQLite database');
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Make database available to routes
app.locals.db = db;

// Initialize database tables and run migrations
async function initializeDatabase() {
  try {
    
    logger.info('Database initialization completed');
    console.log('Database initialization completed');
  } catch (error) {
    logger.error('Database initialization error', error);
    console.error('Database initialization error:', error);
  }
}

// Routes
const userRoutes = require('./src/routes/user');
const auditRoutes = require('./src/routes/audit');
const searchHistoryRoutes = require('./src/routes/searchHistory');
const searchEngineRoutes = require('./src/routes/searchEngine');
const categoryRoutes = require('./src/routes/category');
const wishlistRoutes = require('./src/routes/wishlist');
const biodataRoutes = require('./src/routes/biodata');
const productRoutes = require('./src/routes/product');

app.use('/api/users', userRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/search-history', searchHistoryRoutes);
app.use('/api/search-engines', searchEngineRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/biodata', biodataRoutes);
app.use('/api/products', productRoutes);

// Test discovery route directly
app.get('/api/test-discovery', (req, res) => {
  const localIP = getLocalIPAddress();
  const port = process.env.PORT || 3000;
  
  res.json({
    server: 'backend',
    version: '1.0.0',
    ip: localIP,
    port: port,
    baseUrl: `http://${localIP}:${port}`,
    timestamp: new Date().toISOString()
  });
});

// Basic routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Your Backend API is running!',
    endpoints: {
      queue: '/api/queue',
      stats: '/api/queue/stats',
      discovery: '/api/discovery'
    }
  });
});

// Discovery endpoint
app.get('/api/discovery', (req, res) => {
  const localIP = getLocalIPAddress();
  const port = process.env.PORT || 3000;
  
  res.json({
    server: 'backend',
    version: '1.0.0',
    ip: localIP,
    port: port,
    baseUrl: `http://${localIP}:${port}`,
    endpoints: {
      queue: '/api/queue',
      stats: '/api/queue/stats',
      health: '/health'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const localIP = getLocalIPAddress();
const adminPort = 24364; // Default Expo web port

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server started on port ${PORT}`, {
    localAPI: `http://localhost:${PORT}`,
    networkAPI: `http://${localIP}:${PORT}`,
    mobileAPI: `http://${localIP}:${PORT}`
  });
  
  console.log('\n========================================');
  console.log('✅ BACKEND SERVER RUNNING');
  console.log('========================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`Local API:    http://localhost:${PORT}`);
  console.log(`Network API:  http://${localIP}:${PORT}`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`  GET  ${localIP}:${PORT}/api/queue`);
  console.log(`  POST ${localIP}:${PORT}/api/queue`);
  console.log(`  GET  ${localIP}:${PORT}/api/queue/stats`);
  console.log('');
  console.log('========================================');
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Shutting down server gracefully');
  console.log('\n\nShutting down...');
  
  // Kill admin process if it exists
  if (global.adminProcess) {
    console.log('Stopping admin dashboard...');
    global.adminProcess.kill();
  }
  
  db.close((err) => {
    if (err) {
      logger.error('Error closing database', err);
      console.error(err.message);
    }
    logger.info('Database connection closed');
    console.log('Database connection closed.');
    process.exit(0);
  });
});