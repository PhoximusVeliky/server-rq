const express = require('express');
const router = express.Router();
const { getUserRoutes, buyRoute, deleteRoute } = require('../controllers/routeController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getUserRoutes);
router.post('/', protect, buyRoute);
router.delete('/:id', protect, deleteRoute);

module.exports = router;