const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const plain = "password123";
const hash = "$2b$10$mG/U1wr3lfKQNJknTpVrOOjp6.XJuznn76nu681jOEDkbN9MPZ8.e"; // Paste the hashed password from your signup console

bcrypt.compare(plain, hash).then(match => {
  console.log("✅ Match result:", match); // Should print true
});

const login = async (req, res) => {
    console.log("🪵 Received login body:", req.body); 
    
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user){
    console.log("❌ no user found");
    return res.status(401).json({ message: "Invalid credentials" });
  }
  console.log("Login email:", email);
console.log("Login password:", password);
console.log("DB hashed password:", user.password);
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    console.log("❌ Password mismatch");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // OPTIONAL: store refresh token in DB
  user.refreshToken = refreshToken;
  await user.save();

  res.json({ accessToken, refreshToken });
};

const signup = async (req, res) => {
  const { email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already exists" });

  const newUser = new User({ email, password }); // plain password here
  await newUser.save(); // schema will hash it

  res.status(201).json({ message: "User created successfully" });
};



const logout = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  res.json({ message: "Logged out successfully" });
};


const jwt = require("jsonwebtoken");

const refreshToken = async (req, res) => {
  const { token } = req.body;
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

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = { login, signup ,refreshToken, logout};
