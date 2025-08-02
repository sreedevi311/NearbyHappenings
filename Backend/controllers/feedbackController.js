
const Feedback = require('../models/feedback.model');

// Contact/Support feedback submission
const submitFeedback = async (req, res) => {
  const { name, email, rating, message } = req.body;

  try {
    const existing = await Feedback.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Feedback already submitted' });
    }

    const newFeedback = new Feedback({ name, email, rating, message });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Public reviews retrieval (with pagination)
const getPublicReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Feedback.countDocuments();

    res.status(200).json({
      feedbacks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load reviews.' });
  }
};

module.exports = {
  submitFeedback,
  getPublicReviews,
};