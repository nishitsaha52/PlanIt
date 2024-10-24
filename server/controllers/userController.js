const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const mongoose = require('mongoose');

// Generate a JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, 'asdfghjklqwertyuiopzxcvb', { algorithm: 'HS256', expiresIn: '1500h' });
  console.log('Generated Token:', token);
  return token;
};


// Register new users
/*exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};*/

// Login users
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Google OAuth callback
exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect('/login'); // Redirect to login page on error
    }
    const token = generateToken(user);
    // Append token to the dashboard URL
    res.redirect(`/dashboard?token=${token}`);
  })(req, res, next);
};

// GitHub OAuth callback
exports.githubCallback = (req, res, next) => {
  passport.authenticate('github', { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect('/login'); // Redirect to login page on error
    }
    const token = generateToken(user);
    // Append token to the dashboard URL
    res.redirect(`/dashboard?token=${token}`);
  })(req, res, next);
};

// Facebook OAuth callback
exports.facebookCallback = (req, res, next) => {
  passport.authenticate('facebook', { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect('/login'); // Redirect to login page on error
    }
    const token = generateToken(user);
    // Append token to the dashboard URL
    res.redirect(`/dashboard?token=${token}`);
  })(req, res, next);
};

// Fetch user by ID and return name and profile image
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate if the userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Fetch only the name and profileImage fields
    const user = await User.findById(userId).select('name profileImage');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user profile
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};