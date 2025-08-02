const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/user.model')

const isProduction = process.env.NODE_ENV === 'production'
const baseBackendURL = isProduction
  ? 'https://nearbyhappenings.onrender.com'
  : 'http://localhost:5000'

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${baseBackendURL}/nearby-happenings/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value
    let user = await User.findOne({ email })

    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id
        await user.save()
      }
    } else {
      user = await User.create({
        googleId: profile.id,
        email,
        name: profile.displayName
      })
    }

    return done(null, user)
  } catch (err) {
    return done(err, null)
  }
}))
