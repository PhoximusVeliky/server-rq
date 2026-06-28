const express = require('express');
const router = express.Router();
const { createTrack, getUserTracks, getUserStats } = require('../controllers/trackController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createTrack);
router.get('/', protect, getUserTracks);
router.get('/stats', protect, getUserStats);

module.exports = router;