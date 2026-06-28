const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Имя обязательно'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
    minlength: 6,
  },
  coins: {
    type: Number,
    default: 100, // Стартовый баланс
  },
  unlockedRoutes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
  }],
  unlockedAchievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Хэширование пароля перед сохранением
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Метод для проверки пароля
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);