const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: { 
  type: String, 
  enum: ['user', 'admin'], 
  default: 'user' 
  },

  city: {
    type: String,
    default: '',
  },

  interests: {
    type: [String], // e.g., ["Yoga", "Music", "Gardening"]
    default: [],
  },

  isOrganizer: {
    type: Boolean,
    default: false,
  },

  hostedEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    }
  ],

  interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Theme' }],

  refreshToken: {
    type: String,
    default: '',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
