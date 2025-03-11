const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

// Get user profile
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Check if the username or email is already taken by another user
    if (username || email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: req.session.userId } },
          { $or: [
            username ? { username } : { _id: null },
            email ? { email } : { _id: null }
          ]}
        ]
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already in use' });
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.session.userId,
      { $set: req.body },
      { new: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save game history
router.post('/game-history', isAuthenticated, async (req, res) => {
  try {
    const { difficultyLevel, questionsAsked, round } = req.body;
    
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.gameHistory.push({
      difficultyLevel,
      questionsAsked,
      round
    });
    
    await user.save();
    
    res.status(201).json({ success: true, gameHistory: user.gameHistory });
  } catch (error) {
    console.error('Save game history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get game history
router.get('/game-history', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.gameHistory);
  } catch (error) {
    console.error('Get game history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
