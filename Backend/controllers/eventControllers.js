// controllers/eventController.js

const Event = require('../models/events.model'); // adjust path to your Event model

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




module.exports = { getEventsByTheme };
