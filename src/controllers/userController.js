const User = require('../models/User');

// @desc    Получить профиль пользователя
// @route   GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('unlockedRoutes')
      .populate('unlockedAchievements');

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        coins: user.coins,
        unlockedRoutes: user.unlockedRoutes,
        unlockedAchievements: user.unlockedAchievements,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения профиля', error: error.message });
  }
};

module.exports = { getProfile };