const cron = require('node-cron');
const mongoose = require('mongoose');
const { sendEmail } = require('./utils/emailSender');
const User = require('./models/user.model');
const Event = require('./models/events.model');
const Theme = require('./models/theme.model'); // <-- This is the fix

cron.schedule('55 7 * * *', async () => {
  console.log('🕘 Running scheduled notification job...');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(tomorrow.getDate() + 1);

  try {
    const events = await Event.find({
      date: { $gte: tomorrow, $lt: dayAfter }
    })

    if (events.length === 0) return console.log('📭 No events tomorrow.');

const users = await User.find().populate('interests'); // interests → array of Theme documents

for (const user of users) {
  const matchedEvents = events.filter(event =>
    user.interests.some(interest => interest.name === event.theme)
  );

  if (matchedEvents.length === 0) continue;

  const html = `
    <h3>Hi ${user.name || 'there'},</h3>
    <p>You have events tomorrow that match your interests:</p>
    <ul>
      ${matchedEvents.map(e => `<li><b>${e.eventName}</b> at ${e.location.address}</li>`).join('')}
    </ul>
    <p>Don’t miss out!</p>
  `;

   await sendEmail(user.email, '🎉 Upcoming Events Tomorrow', html);
}


    console.log('📧 Emails processed.');
  } catch (error) {
    console.error('❌ Error during scheduled job:', error.message);
  }
});
