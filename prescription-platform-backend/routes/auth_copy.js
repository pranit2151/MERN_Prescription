const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import your User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const requireAuth = require('../middleware/authMiddleware');

// User registration
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password, // Store the plain-text password for now
    });

    // Password will be hashed automatically before saving
    const savedUser = await user.save();

    // Generate JWT token (implement after login)

    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user not found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token only after successful password verification
    console.log("process.env.JWT_SECRET^^^^", process.env.JWT_SECRET);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
    console.log("token^^^^", token);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Protected route example
router.get('/protected', requireAuth, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Get user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password from response
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
