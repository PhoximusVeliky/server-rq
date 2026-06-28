const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Загрузка переменных окружения
dotenv.config();

// Подключение к БД
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Увеличиваем лимит для GeoJSON

// Маршруты
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tracks', require('./routes/trackRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));

// Тестовый маршрут
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'RunQuest Server is running!' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так на сервере!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});