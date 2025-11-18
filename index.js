import pkg from '@slack/bolt';
const { App } = pkg;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true
});

// Responde cuando lo mencionan
app.event("app_mention", async ({ say }) => {
  await say("¡Hola! Soy ValBot 🤖 ¿Qué tal?");
});

// Responde en mensajes privados
app.message(async ({ message, say }) => {
  if (message.channel_type === "im") {
    await say("¡Hola Val! Esta es una respuesta automática 🤖✨");
  }
});

(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`ValBot está corriendo 🚀 en puerto ${port}`);
  console.log(`Endpoint de Slack: http://localhost:${port}/slack/events`);
})();
