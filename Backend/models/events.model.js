const mongoose = require('mongoose');
//const fs = require('fs');
require('dotenv').config(); // optional if using .env for DB URI

//const eventData = JSON.parse(fs.readFileSync('./updated_theme_city_events.json', 'utf-8'));

const eventSchema = new mongoose.Schema({
  eventName: String,
  theme: String,
  date: String,
  time: String,
  city: String,
  location: {
    address: String,
    lat: Number,
    lng: Number,
  },
  posterUrl: String,
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
  tag:String,
  description:String
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sree:sree%40311@nearby-happenings-db.canncfd.mongodb.net/nearby_happenings_db?retryWrites=true&w=majority&appName=nearby-happenings-db';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas');
    //await Event.insertMany(eventData);
    //console.log('🎉 Events inserted successfully');
    //mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error connecting/inserting:', err);
  });

  module.exports = mongoose.model('Event', eventSchema);
