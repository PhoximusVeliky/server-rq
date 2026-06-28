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
        coins: user.coins ?? 0,
        unlockedRoutes: user.unlockedRoutes,
        unlockedAchievements: user.unlockedAchievements,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения профиля', error: error.message });
  }
};

// @desc    Обновить профиль пользователя
// @route   PUT /api/user/profile
const updateProfile = async (req, res) => {
  try {
    const { coins, name } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (coins !== undefined) user.coins = coins;
    if (name !== undefined) user.name = name;

    await user.save();

    res.json({
      success: true,
      message: 'Профиль обновлён',
      user: {
        _id: user._id,
        name: user.name,
        coins: user.coins,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления профиля', error: error.message });
  }
};

module.exports = { getProfile, updateProfile };