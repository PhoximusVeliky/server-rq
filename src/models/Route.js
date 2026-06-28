const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название маршрута обязательно'],
    trim: true,
  },
  distanceKm: {
    type: Number,
    required: [true, 'Дистанция обязательна'],
  },
  // GeoJSON LineString для отображения маршрута
  geometry: {
    type: {
      type: String,
      enum: ['LineString'],
      default: 'LineString',
    },
    coordinates: {
      type: [[Number]], // Массив [долгота, широта]
      required: true,
    },
  },
  // GeoJSON Point для точки старта
  startPoint: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [долгота, широта]
      required: true,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Геопространственный индекс для поиска маршрутов рядом
routeSchema.index({ geometry: '2dsphere' });
routeSchema.index({ startPoint: '2dsphere' });

module.exports = mongoose.model('Route', routeSchema);