const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Получаем токен из заголовка
      token = req.headers.authorization.split(' ')[1];

      // Верифицируем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Добавляем пользователя в запрос (без пароля)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Ошибка авторизации:', error.message);
      return res.status(401).json({ message: 'Не авторизован, токен недействителен' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Не авторизован, токен отсутствует' });
  }
};

module.exports = { protect };