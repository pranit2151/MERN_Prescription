const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password:   
 {
    type: String,
    required: true
  },
  role: {
    type:   
 String,
    enum: ['user', 'admin'], // Example roles
    default: 'user'
  },
  // Add other fields as needed (e.g., profile picture, address, phone number)
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



const User = mongoose.model('User', userSchema);

module.exports = User;
