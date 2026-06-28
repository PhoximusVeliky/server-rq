const Track = require('../models/Track');
const User = require('../models/User');
const Achievement = require('../models/Achievement');

// @desc    Сохранить результат тренировки
// @route   POST /api/tracks
const createTrack = async (req, res) => {
  try {
    const { distance, duration, geometry, startTime, endTime, routeId } = req.body;

    const track = await Track.create({
      user: req.user._id,
      distance,
      duration,
      route: geometry,
      startTime,
      endTime,
      routeId: routeId || null,
      earnedCoins: Math.floor(distance / 10),
    });

    // ✅ Безопасное начисление монет
    const user = await User.findById(req.user._id);
    if (user.coins === undefined || user.coins === null) {
      user.coins = 0;
    }
    user.coins += track.earnedCoins;
    await user.save();

    // Проверяем достижения
    await checkAchievements(req.user._id);

    res.status(201).json({
      success: true,
      track,
      message: 'Тренировка сохранена',
    });
  } catch (error) {
    console.error('Ошибка сохранения тренировки:', error);
    res.status(500).json({ message: 'Ошибка сохранения тренировки', error: error.message });
  }
};

// @desc    Получить историю тренировок пользователя
// @route   GET /api/tracks
const getUserTracks = async (req, res) => {
  try {
    const tracks = await Track.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(50);

    res.json({ success: true, tracks });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения тренировок', error: error.message });
  }
};

// @desc    Получить статистику пользователя
// @route   GET /api/tracks/stats
const getUserStats = async (req, res) => {
  try {
    const tracks = await Track.find({ user: req.user._id });

    const totalDistance = tracks.reduce((sum, t) => sum + t.distance, 0);
    const totalDuration = tracks.reduce((sum, t) => sum + t.duration, 0);
    const totalTracks = tracks.length;

    const activityByDate = {};
    tracks.forEach(track => {
      const date = track.date.toISOString().split('T')[0];
      activityByDate[date] = (activityByDate[date] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        totalDistance,
        totalDuration,
        totalTracks,
        activityByDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения статистики', error: error.message });
  }
};

// Проверка и выдача достижений
const checkAchievements = async (userId) => {
  const user = await User.findById(userId);
  const tracks = await Track.find({ user: userId });
  const allAchievements = await Achievement.find();

  const totalDistance = tracks.reduce((sum, t) => sum + t.distance, 0) / 1000;
  const totalTracks = tracks.length;

  for (const achievement of allAchievements) {
    if (user.unlockedAchievements.includes(achievement._id)) continue;

    let unlocked = false;

    if (achievement.conditionType === 'distance' && totalDistance >= achievement.conditionValue) {
      unlocked = true;
    } else if (achievement.conditionType === 'count' && totalTracks >= achievement.conditionValue) {
      unlocked = true;
    } else if (achievement.conditionType === 'coins' && user.coins >= achievement.conditionValue) {
      unlocked = true;
    }

    if (unlocked) {
      user.unlockedAchievements.push(achievement._id);
      user.coins += achievement.rewardCoins;
    }
  }

  await user.save();
};

module.exports = { createTrack, getUserTracks, getUserStats };