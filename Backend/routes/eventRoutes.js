const express = require('express');
const router = express.Router();
const { getEventsByTheme } = require('../controllers/eventControllers');

router.get('/theme/:theme', getEventsByTheme);

module.exports = router;
