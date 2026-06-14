const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'Новая пробежка',
  },
  distance: {
    type: Number, // в метрах
    required: true,
  },
  duration: {
    type: Number, // в секундах
    required: true,
  },
  // GeoJSON объект для хранения маршрута (линии)
  route: {
    type: {
      type: String,
      enum: ['LineString'],
      required: true,
    },
    coordinates: {
      type: [[Number]], // Массив пар [долгота, широта]
      required: true,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// КРИТИЧНО ДЛЯ ДИПЛОМА: Геопространственный индекс для маршрута
trackSchema.index({ route: '2dsphere' });

module.exports = mongoose.model('Track', trackSchema);