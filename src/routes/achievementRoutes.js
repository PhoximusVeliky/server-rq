const express = require('express');
const router = express.Router();
const { getAllAchievements } = require('../controllers/achievementController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllAchievements);

module.exports = router;