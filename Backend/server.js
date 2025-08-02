const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
require('./oAuth/google');
const passport = require('passport');

const authRoutes = require('./routes/auth.routes');
const eventRoutes=require('./routes/eventRoutes')
const communityRoutes = require('./routes/communityRoutes');
const locationRoutes=require('./routes/location.routes')
const uploadRoutes = require('./routes/uploadRoutes')
const authenticate = require("./middleware/auth.middleware");
const contactRoutes = require('./routes/contact.routes');
const feedbackRoutes = require('./routes/feedback.routes');


const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://nearbyhappenings.vercel.app' // no localhost here
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));



app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/nearby-happenings/auth', authRoutes);
app.use('/nearby-happenings/events',eventRoutes);
app.use('/nearby-happenings/communities',communityRoutes)
app.use('/nearby-happenings/location',locationRoutes)
app.use('/nearby-happenings/upload', uploadRoutes)

app.use('/nearby-happenings/contact', contactRoutes);

app.use('/nearby-happenings/feedback', feedbackRoutes);


app.get('/', (req, res) => {
  res.send('Nearby Happenings API');
});
app.get("/nearby-happenings/protected", authenticate, (req, res) => {
  res.json({ message: "Access granted to protected route", userId: req.user.userId });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`)))
  .catch(err => console.error(err));
