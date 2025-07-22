const mongoose = require('mongoose');
require('dotenv').config();

const eventSchema = new mongoose.Schema({
  eventName: String,
  theme: String,
  date: Date,
  time: String,
  city: String,
  location: {
    address: String,
    lat: Number,
    lng: Number,
  },
  posterUrl: String,
  tag: String,
  description: String,
  organizer: {
    name: String,
    email: String,
    mobile: String,
  },
  others: {
    registrationLink: String,
    registrationFee: String,
    targetAudience: String,
    capacity: String,
    essentialsToCarry: String,
  },
  createdBy: String,
  createdAt: Date,
  status: String,
  updatedByAdmin: Boolean,
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sree:sree%40311@nearby-happenings-db.canncfd.mongodb.net/nearby_happenings_db?retryWrites=true&w=majority&appName=nearby-happenings-db';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error('❌ Error connecting/inserting:', err);
  });

module.exports = Event;
