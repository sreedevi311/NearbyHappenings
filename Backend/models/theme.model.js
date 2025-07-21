const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  tag: {
    type: String,
    required: true,
    trim: true
  },
  posterUrl: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  eventsCount:Number,
  isFavorite:Boolean,
});

module.exports = mongoose.model('Theme', themeSchema);
