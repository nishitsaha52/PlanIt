const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User'); // Import your User model
const upload = require('../config/multerConfig'); // Import multer configuration
const cloudinary = require('../config/cloudinaryConfig'); // Import Cloudinary configuration
const { getUserProfile } = require('../controllers/userController');

const CLIENT_URL = "http://localhost:3000/";

// Generate a JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, 'asdfghjklqwertyuiopzxcvb', { algorithm: 'HS256', expiresIn: '1500h' });
  console.log('Generated Token:', token);
};

// User Registration Route with Image Upload
router.post('/register', upload.single('profileImage'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let profileImageUrl = '';

    // Handle image upload if a file is provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      profileImageUrl = result.secure_url;
    }

    // Create and save the new user
    const newUser = new User({ name, email, password, profileImage: profileImageUrl });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', profileImageUrl });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
});

// User Login Route (Implement as needed)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Check if the user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a token for the user
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upload Profile Image Route (for authenticated users)
router.post('/upload-profile-image', upload.single('profileImage'), async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Update the user's profile image URL
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profileImage = result.secure_url;
    await user.save();

    res.status(200).json({ message: 'Profile image uploaded successfully', imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error });
  }
});

// Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

// GitHub OAuth Routes
router.get("/github", passport.authenticate("github", { scope: ["profile", "email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

// Facebook OAuth Routes
router.get("/facebook", passport.authenticate("facebook", { scope: ["profile", "email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get('/user/:id', getUserProfile);

module.exports = router;
