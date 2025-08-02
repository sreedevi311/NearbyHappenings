const mongoose = require('mongoose');

const Event = require('../models/events.model'); 
const Theme=require('../models/theme.model');
const City=require('../models/city.model');
const User=require('../models/user.model')

// Get events by theme

const getEventsByTheme = async (req, res) => {
  try {
    const rawTheme = req.params.theme;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: no user info' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.city) {
      return res.status(400).json({ message: 'User city not found' });
    }

    // Normalize theme (e.g., yoga-wellness => yoga.*wellness)
    const cleaned = rawTheme.replace(/-/g, ' ').toLowerCase();
    const regex = new RegExp(cleaned.replace(/\s/g, '.*'), 'i');

    const citiesToSearch = [user.city, ...(user.nearbyCities || [])];

    const events = await Event.find({
      status: 'accepted', // only show accepted events to users
      theme: { $regex: regex },
      city: { $in: citiesToSearch }
    }).sort({ date: 1 });

    if (!events.length) {
      return res.status(404).json({
        message: `No events found for theme "${rawTheme}" in your city or nearby cities`
      });
    }

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const saveFormEvent=async (req,res)=>{
  try {
    const themeName = req.body.theme;
    const matchedTheme = await Theme.findOne({ name: themeName });
    const tag = matchedTheme.tag;
    const newEvent = new Event({
      ...req.body,
      tag
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

const acceptedRequests=async (req, res) => {
  try {
    const acceptedEvents = await Event.find({ createdBy:'host',status: 'accepted' });
    res.status(200).json(acceptedEvents);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending events' });
  }
}

const declinedRequests=async (req, res) => {
  try {
    const declinedEvents = await Event.find({ status: 'declined' });
    res.status(200).json(declinedEvents);
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

const getEventThemesWithCount = async (req, res) => {
  try {
    const themeCounts = await Event.aggregate([
      {
        $group: {
          _id: "$theme",
          eventsCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "themes", // must match the actual MongoDB collection name
          localField: "_id", // theme name in events
          foreignField: "name", // name in themes collection
          as: "themeData"
        }
      },
      {
        $unwind: "$themeData"
      },
      {
        $project: {
          _id: 1,
          eventsCount: 1,
          name: "$themeData.name",
          posterUrl: "$themeData.posterUrl",
          tag: "$themeData.tag",
          isFavorite: { $literal: false } // optional default field
        }
      }
    ]);

    res.status(200).json(themeCounts);
  } catch (error) {
    console.error("Error fetching theme event counts:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllEventThemes = async (req, res) => {
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
    console.log("📥 Fetching 10 upcoming events for user city");

    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userCity = user.city;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ensure time is set to start of the day

    const events = await Event.find({
      city: userCity,
      date: { $gte: today.toISOString().slice(0, 10) },
    })
      .sort({ date: 1 })     // Sort by soonest first
      .limit(10);            // Limit to 10 events

    console.log("🎉 Found events:", events.length);
    return res.status(200).json(events);
  } catch (err) {
    console.error("❌ Error fetching events:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

const upcomingDayEvents = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ensure time is set to start of the day

    const events = await Event.find({
      date: { $gte: today.toISOString().slice(0, 10) },
    })
      .sort({ date: 1 })     // Sort by soonest first
      .limit(10);            // Limit to 10 events
    return res.status(200).json(events);
  } catch (err) {
    console.error("❌ Error fetching events:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /events/random-theme-events
const getRandomThemeEvents = async (req, res) => {
  try {
    // 1. Get total theme count
    const count = await Theme.countDocuments();
    if (count === 0) return res.status(404).json({ error: "No themes available" });

    // 2. Pick a random index
    const random = Math.floor(Math.random() * count);

    // 3. Get one random theme
    const randomThemeDoc = await Theme.findOne().skip(random);
    const randomTheme = randomThemeDoc.name; // adjust field name if needed

    // 4. Get upcoming events for that theme
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await Event.find({
      theme: randomTheme,
      date: { $gte: today },
    })
      .sort({ date: 1 })
      .limit(10);

    res.status(200).json({ theme: randomTheme, events });
  } catch (err) {
    console.error("❌ Error fetching random theme events:", err);
    res.status(500).json({ error: "Server error" });
  }
};


const searchEvents = async (req, res) => {
  const q = req.query.q;

  if (!q || q.trim() === '') {
    // Optional: return popular or recent events instead of 400
    return res.status(200).json([]); // send empty array if query is empty
  }

  try {
    const regex = new RegExp(q, 'i'); // case-insensitive
    const events = await Event.find({
      $or: [
        { eventName: regex },
        { tag: regex }
      ]
    }).limit(10);

    res.json(events);
  } catch (err) {
    console.error('Search Error:', err);
    res.status(500).json({ message: 'Server error while searching' });
  }
};
const getAllTags = async (req, res) => {
  try {
    const tags = await Event.distinct('tag');
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

module.exports = { getEventsByTheme,
  saveFormEvent,
  pendingRequests,
  acceptedRequests,
  declinedRequests,
  updateStatusById,
  adminAdded,
  deleteById,
  adminReAdd,
  getEventById ,
  adminUpdatedEventInfo,
  getEventThemesWithCount,
  getAllEventThemes,
  getAllCities,
  userInterestedEvents,
  userCityUpcomingDayEvents,
  upcomingDayEvents,
  getRandomThemeEvents,
  searchEvents,
  getAllTags,
};
