const mongoose = require('mongoose');

const Event = require('../models/events.model'); 
const Theme=require('../models/theme.model');
const City=require('../models/city.model');
const User=require('../models/user.model')

// Get events by theme
const getEventsByTheme = async (req, res) => {
  try {
    const rawTheme = req.params.theme; // e.g., 'yoga wellness' or 'yoga-wellness'
    
    // Normalize: replace hyphens with space, insert optional & or ignore it
    const cleaned = rawTheme.replace(/-/g, ' ').toLowerCase();

    // Build a regex that ignores special characters like '&'
    const regex = new RegExp(cleaned.replace(/\s/g, '.*'), 'i');

    console.log("🔍 Normalized theme regex:", regex);

    const events = await Event.find({
      theme: { $regex: regex }
    }).sort({ date: 1 });

    if (!events.length) {
      return res.status(404).json({ message: `No events found for theme: ${rawTheme}` });
    }

    res.status(200).json(events);
  } catch (err) {
    console.error("❌ Error fetching events by theme:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const saveFormEvent=async (req,res)=>{
  try {
    const newEvent = new Event({
      ...req.body,
    })
    await newEvent.save()
    res.status(201).json({ message: 'Event submitted successfully.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error.' })
  }
}

const pendingRequests=async (req, res) => {
  try {
    const pendingEvents = await Event.find({ status: 'pending' });
    res.status(200).json(pendingEvents);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending events' });
  }
}

const updateStatusById=async (req, res) => {
  try {
    const { status } = req.body; // "accepted" or "declined"
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { status, updatedByAdmin: true },
      { new: true }
    );
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
}

const adminAdded=async (req, res) => {
  try {
    const events = await Event.find({ createdBy: 'admin' });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

const deleteById=async (req, res) => {
  try {
    console.log("hello")
    await Event.findByIdAndDelete(req.params.id)
    res.json({ message: 'Event deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event' })
  }
}

const adminReAdd=async (req, res) => {
  try {
    const newEvent = new Event({
      ...req.body,
      createdBy: 'admin',
    })
    await newEvent.save()
    res.status(201).json(newEvent)
  } catch (err) {
    console.error('Error re-adding event:', err)
    res.status(500).json({ error: 'Failed to re-add event' })
  }
}

const adminUpdatedEventInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ message: 'Error updating event', error });
  }
};


const getEventById=async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

const getEventThemes = async (req, res) => {
  try {
    const themes = await Theme.find({ active: true }).sort({ name: 1 });
    res.status(200).json(themes);
  } catch (error) {
    console.error("❌ Error fetching themes:", error.message);
    res.status(500).json({ error: "Failed to fetch themes" });
  }
};

const getAllCities=async(req,res)=>{
  try {
    const cities = await City.find({},'name').sort({ name: 1 });
    res.status(200).json(cities);
  } catch (error) {
    console.error("❌ Error fetching cities:", error.message);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
}

const userInterestedEvents = async (req, res) => {
  try {
    const userId = req.params.userId;

    // 1. Get user with populated theme documents
    const user = await User.findById(userId).populate('interests');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Extract theme names
    const themeNames = user.interests.map(theme => theme.name);
    const userCity=user.city;

    // 3. Query events where theme name is in user's interests
    const events = await Event.find({ theme: { $in: themeNames } ,city: userCity}).populate('theme');

    res.status(200).json(events);
  } catch (err) {
    console.error('❌ Error fetching user interested events:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const userCityUpcomingDayEvents = async (req, res) => {
  try {
    console.log("📥 Incoming request to fetch user city upcoming events");

    const userId = req.params.userId;
    console.log("🔍 User ID from params:", userId);

    const user = await User.findById(userId);
    console.log("👤 Found user:", user);

    if (!user) return res.status(404).json({ message: "User not found" });

    const userCity = user.city;
    const today = new Date();
    console.log("📍 User city:", userCity);
    console.log("📅 Today's date:", today.toISOString().slice(0, 10));

    const events = await Event.find({
      city: userCity,
      date: { $gte: today },
    });

    console.log("🎉 Found upcoming events:", events.length);
    res.status(200).json(events);
  } catch (err) {
    console.error("❌ Error in upcoming events controller:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { getEventsByTheme,saveFormEvent,pendingRequests,updateStatusById,adminAdded,deleteById,adminReAdd,getEventById ,adminUpdatedEventInfo,getEventThemes,getAllCities,userInterestedEvents,userCityUpcomingDayEvents};
