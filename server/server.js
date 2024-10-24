const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const passportSetup = require('./config/passport'); // Ensure this file exists and is configured properly
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // Import payment routes
const savePaymentRoutes = require('./routes/savepayment'); // Import the new save payment route
const analyticRoutes = require('./routes/analyticRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const SESSION_SECRET = 'asdfghjklqwertyuiopzxcvb'; // Move this to environment variables for better security

// Replace with your MongoDB connection string, ideally stored in an environment variable
const mongoURI = 'mongodb+srv://nishitsaha52:nishit52@eventmanagement.k9zzt.mongodb.net/?retryWrites=true&w=majority&appName=EventManagement';

// Middleware setup
app.use(express.json()); // Ensure this is used before defining routes
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
})); 

// Session configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Initialize Passport for OAuth
app.use(passport.initialize());
app.use(passport.session());

// OAuth routes for Google and GitHub
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: 'http://localhost:3000/dashboard',
  failureRedirect: 'http://localhost:3000/login'
}));

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback', passport.authenticate('github', {
  successRedirect: 'http://localhost:3000/dashboard',
  failureRedirect: 'http://localhost:3000/login'
}));

// API routes - Adding '/api' prefix for better REST convention
app.use('/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payment', paymentRoutes); // Use payment routes
app.use('/api/savepayment', savePaymentRoutes); // Add the new save payment route
app.use('/api', analyticRoutes)
app.use('/api/reports', reportRoutes)

// Catch-all route for undefined routes (404 handler)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');

    // Start the server
    const port = 3001;
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
