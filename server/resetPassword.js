require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const username = process.argv[2];
const newPassword = process.argv[3];

if (!username || !newPassword) {
  console.error('Usage: node resetPassword.js <username> <newPassword>');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dating_game')
  .then(async () => {
    console.log('MongoDB connected');
    
    try {
      // Find the user
      const user = await User.findOne({ username });
      
      if (!user) {
        console.error(`User "${username}" not found`);
        process.exit(1);
      }
      
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
      
      console.log(`Password updated for user "${username}"`);
      process.exit(0);
    } catch (error) {
      console.error('Error updating password:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
