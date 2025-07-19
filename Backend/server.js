const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const eventRoutes=require('./routes/eventRoutes')
const authenticate = require("./middleware/auth.middleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/nearby-happenings/auth', authRoutes);
app.use('/nearby-happenings/events',eventRoutes);

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
