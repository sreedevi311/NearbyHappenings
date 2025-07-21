const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('City', citySchema);
