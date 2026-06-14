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
app.use(cors()); // Разрешаем запросы с Flutter
app.use(express.json()); // Парсим JSON из тела запроса

// Маршруты
app.use('/api/auth', require('./routes/authRoutes'));

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