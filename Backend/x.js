const mongoose = require('mongoose')
const Event = require('./models/events.model') // Adjust path if needed

mongoose.connect('mongodb+srv://sree:sree%40311@nearby-happenings-db.canncfd.mongodb.net/nearby_happenings_db?retryWrites=true&w=majority&appName=nearby-happenings-db', { useNewUrlParser: true, useUnifiedTopology: true })

async function convertDateStrings() {
  try {
    const events = await Event.find({})
    console.log(`📦 Total events found: ${events.length}`)

    let convertedCount = 0

    for (const event of events) {
      if (typeof event.date === 'string') {
  const [day, month, year] = event.date.split('-');
  const isoDate = new Date(`${year}-${month}-${day}`);

  if (!isNaN(isoDate)) {
    event.date = isoDate;
    await event.save();
    console.log(`✅ Converted: ${event.eventName} -> ${isoDate.toISOString().slice(0, 10)}`);
  } else {
    console.warn(`⚠️ Invalid date format: ${event.eventName} (${event.date})`);
  }
} else {
  console.log(`Skipped (not a string): ${event.eventName} (${event.date})`);
}

    }

    console.log(`🎉 Done. Converted ${convertedCount} event(s).`)
    process.exit()
  } catch (error) {
    console.error('❌ Error during conversion:', error)
    process.exit(1)
  }
}

convertDateStrings()
