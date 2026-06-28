const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Achievement = require('../models/Achievement');

dotenv.config();

const achievements = [
  {
    title: 'Первый шаг',
    description: 'Пробежать 1 км',
    conditionType: 'distance',
    conditionValue: 1,
    rewardCoins: 50,
    icon: 'directions_walk',
  },
  {
    title: 'Пятикилометровщик',
    description: 'Пробежать 5 км за одну тренировку',
    conditionType: 'distance',
    conditionValue: 5,
    rewardCoins: 100,
    icon: 'emoji_events',
  },
  {
    title: 'Марафонец',
    description: 'Пробежать 42 км суммарно',
    conditionType: 'distance',
    conditionValue: 42,
    rewardCoins: 500,
    icon: 'pool',
  },
  {
    title: 'Начало пути',
    description: 'Завершить 5 тренировок',
    conditionType: 'count',
    conditionValue: 5,
    rewardCoins: 75,
    icon: 'flag',
  },
  {
    title: 'Регулярный бегун',
    description: 'Завершить 20 тренировок',
    conditionType: 'count',
    conditionValue: 20,
    rewardCoins: 200,
    icon: 'trending_up',
  },
  {
    title: 'Коллекционер',
    description: 'Накопить 500 монет',
    conditionType: 'coins',
    conditionValue: 500,
    rewardCoins: 100,
    icon: 'monetization_on',
  },
];

const seedAchievements = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB подключен');

    await Achievement.deleteMany({});
    console.log('🗑️ Старые достижения удалены');

    await Achievement.insertMany(achievements);
    console.log(`✅ Создано ${achievements.length} достижений`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
};

seedAchievements();