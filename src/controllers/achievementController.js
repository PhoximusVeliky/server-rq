const Achievement = require('../models/Achievement');

// @desc    Получить список всех достижений
// @route   GET /api/achievements
const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json({ success: true, achievements });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения достижений', error: error.message });
  }
};

module.exports = { getAllAchievements };