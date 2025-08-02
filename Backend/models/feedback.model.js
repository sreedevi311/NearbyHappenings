
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  rating: {
    type: Number, // 1 to 5 stars
    required: true,
    min: 1,
    max: 5,
  }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);