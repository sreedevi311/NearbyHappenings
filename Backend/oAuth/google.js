const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
    } else {
      user = await User.create({
        googleId: profile.id,
        email,
        name: profile.displayName
      });
    }

    return done(null, user._id); // ✅ store only ID in session
  } catch (err) {
    return done(err, null);
  }
}));

// ✅ store only user ID in the session
passport.serializeUser((userId, done) => {
  done(null, userId);
});

// ✅ retrieve full user from DB by ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
