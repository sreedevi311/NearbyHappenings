
const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getPublicReviews,
} = require('../controllers/feedbackController');

// Route: POST /nearby-happenings/feedback (for contact/support)
router.post('/', submitFeedback);

// Route: GET /nearby-happenings/feedback/reviews?page=1&limit=5 (for public reviews)
router.get('/', getPublicReviews);

module.exports = router;