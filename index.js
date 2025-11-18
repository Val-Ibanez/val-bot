import { App } from "@slack/bolt";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
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
  await app.start(process.env.PORT || 3000);
  console.log("ValBot está corriendo 🚀");
})();
