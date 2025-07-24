const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

// Helper to set cookies
function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true, // set true in production with HTTPS
    sameSite: 'Lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

const profile = async (req, res) => {
  try {
    const userId = req.user.userId; // set by JWT auth middleware
    const user = await User.findById(userId).select('-password -refreshToken'); // exclude sensitive fields

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error("❌ Failed to fetch profile:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  console.log("🪵 Received login body:", req.body); 
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    console.log("❌ no user found");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    console.log("❌ Password mismatch");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);

  res.json({
  success: true,
  user: {
    _id: user._id,
    email: user.email,
    city: user.city,
    interests: user.interests
  }
});

};

const signup = async (req, res) => {
  const { email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already exists" });

  const newUser = new User({ email, password }); // plain password here
  const accessToken = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);

  newUser.refreshToken = refreshToken;
  await newUser.save();

  setAuthCookies(res, accessToken, refreshToken);

  res.json({
  success: true,
  user: {
    _id: newUser._id,
    email: newUser.email,
    city: newUser.city,
    interests: newUser.interests
  }
});

};

const logout = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: "Logged out successfully" });
};

const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken; // 🍪 read from cookie

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(payload.userId);
    if (!user || user.refreshToken !== token)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    setAuthCookies(res, newAccessToken, newRefreshToken);

    res.json({ success: true });
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

const updateUserPreferences = async (req, res) => {
  const { city, interests } = req.body;
  const userId = req.user.userId; // set by auth middleware

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    if (city) user.city = city;
    if (interests) user.interests = interests;

    await user.save();

    res.json({ success: true, user: { email: user.email, city: user.city, interests: user.interests } });
  } catch (err) {
    console.error("❌ Failed to update preferences:", err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = {
  profile,
  login,
  signup,
  refreshToken,
  logout,
  updateUserPreferences
};
