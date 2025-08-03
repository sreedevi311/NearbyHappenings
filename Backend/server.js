const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./oAuth/google'); // Load Google OAuth config

// Routes
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/eventRoutes');
const communityRoutes = require('./routes/communityRoutes');
const locationRoutes = require('./routes/location.routes');
const uploadRoutes = require('./routes/uploadRoutes');
const contactRoutes = require('./routes/contact.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const authenticate = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS setup
const allowedOrigins = [
  'https://nearby-happenings.vercel.app',
  'https://nearby-happenings-5t62c9sm9-sreedevi311s-projects.vercel.app',
  'http://localhost:5173'
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

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Session middleware BEFORE passport
app.use(session({
  secret: process.env.JWT_SECRET || 'default_secret', // use JWT_SECRET or fallback
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,            // ✅ required for HTTPS (e.g., Render)
    sameSite: 'none',        // ✅ allow cross-origin cookie with Vercel
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// ✅ Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use('/nearby-happenings/auth', authRoutes);
app.use('/nearby-happenings/events', eventRoutes);
app.use('/nearby-happenings/communities', communityRoutes);
app.use('/nearby-happenings/location', locationRoutes);
app.use('/nearby-happenings/upload', uploadRoutes);
app.use('/nearby-happenings/contact', contactRoutes);
app.use('/nearby-happenings/feedback', feedbackRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('Nearby Happenings API');
});

// ✅ Protected test route
app.get('/nearby-happenings/protected', authenticate, (req, res) => {
  res.json({ message: "Access granted to protected route", userId: req.user.userId });
});

// ✅ DB + Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`)))
  .catch(err => console.error("MongoDB Error ❌", err));
