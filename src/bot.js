const { App } = require('@slack/bolt');

// Initialize the app with bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Respond to 'hello' messages
app.message('hello', async ({ message, say }) => {
  await say({
    text: `Hello <@${message.user}>! 👋`,
    thread_ts: message.ts,
  });
});

// Respond to 'help' command
app.message('help', async ({ say }) => {
  await say({
    text: `*Available Commands:*
• Say "hello" - I'll greet you!
• Say "help" - Show this help message
• Use /ping - Check if bot is responsive`,
  });
});

// Slash command example
app.command('/ping', async ({ command, ack, respond }) => {
  await ack();
  await respond('Pong! 🏓');
});

// Listen for app mentions
app.event('app_mention', async ({ event, say }) => {
  await say({
    text: `Hi there, <@${event.user}>! How can I help you?`,
    thread_ts: event.ts,
  });
});

// Error handler
app.error(async (error) => {
  console.error('Error:', error);
});

module.exports = app;
