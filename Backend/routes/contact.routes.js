const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/auth.controller');

router.post('/', submitContactForm); // Handles POST /nearby-happenings/contact

module.exports = router;