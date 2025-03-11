require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Check environment
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dating_game')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS setup for development
app.use(cors({
  origin: isDevelopment ? true : 'https://yourdomain.com', // Allow any origin in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security headers
app.use((req, res, next) => {
  // Helps prevent XSS attacks
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Prevents the browser from MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevents clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/dating_game',
    ttl: 14 * 24 * 60 * 60 // = 14 days. Default
  }),
  cookie: {
    maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 1000 * 60 * 60 * 24 * 7, // Use env var or default to 1 week
    secure: !isDevelopment, // Use secure cookies in production
    httpOnly: true, // Prevents client side JS from reading the cookie
    sameSite: 'strict' // CSRF protection
  }
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Serve static files in production
if (!isDevelopment) {
  app.use(express.static(path.join(__dirname, '../client')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${isDevelopment ? 'development' : 'production'} mode`);
});
