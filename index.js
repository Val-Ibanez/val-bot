require('dotenv').config();
const app = require('./src/bot');

(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Val Bot is running!');
  } catch (error) {
    console.error('Failed to start the bot:', error);
    process.exit(1);
  }
})();
