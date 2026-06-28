const Route = require('../models/Route');
const User = require('../models/User');

// @desc    Получить каталог маршрутов пользователя
// @route   GET /api/routes
const getUserRoutes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('unlockedRoutes');
    res.json({ success: true, routes: user.unlockedRoutes });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения маршрутов', error: error.message });
  }
};

// @desc    Купить и добавить маршрут
// @route   POST /api/routes
const buyRoute = async (req, res) => {
  try {
    const { name, distanceKm, geometry, startPoint } = req.body;
    const routeCost = 10;

    // Проверяем баланс
    const user = await User.findById(req.user._id);
    if (user.coins < routeCost) {
      return res.status(400).json({ message: 'Недостаточно монет' });
    }

    // Создаём маршрут
    const route = await Route.create({
      name,
      distanceKm,
      geometry,
      startPoint,
      createdBy: req.user._id,
    });

    // Списываем монеты и добавляем маршрут
    user.coins -= routeCost;
    user.unlockedRoutes.push(route._id);
    await user.save();

    res.status(201).json({
      success: true,
      route,
      coins: user.coins,
      message: 'Маршрут куплен',
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка покупки маршрута', error: error.message });
  }
};

// @desc    Удалить маршрут
// @route   DELETE /api/routes/:id
const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({ message: 'Маршрут не найден' });
    }

    // Проверяем, принадлежит ли маршрут пользователю
    if (route.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Нет прав на удаление' });
    }

    await route.deleteOne();

    // Удаляем из списка пользователя
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { unlockedRoutes: req.params.id },
    });

    res.json({ success: true, message: 'Маршрут удалён' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления маршрута', error: error.message });
  }
};

module.exports = { getUserRoutes, buyRoute, deleteRoute };