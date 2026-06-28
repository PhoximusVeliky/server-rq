const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Название достижения обязательно'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Описание обязательно'],
  },
  conditionType: {
    type: String,
    enum: ['distance', 'count', 'coins'], // Тип условия
    required: true,
  },
  conditionValue: {
    type: Number,
    required: [true, 'Пороговое значение обязательно'],
  },
  rewardCoins: {
    type: Number,
    default: 0, // Бонусные монеты за получение
  },
  icon: {
    type: String,
    default: 'emoji_events', // Название иконки Material Icons
  },
});

module.exports = mongoose.model('Achievement', achievementSchema);