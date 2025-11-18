import pkg from '@slack/bolt';
const { App, ExpressReceiver } = pkg;

// Crear receiver explícito con Express para manejar correctamente el challenge
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: receiver
});

// Responde cuando lo mencionan
app.event("app_mention", async ({ say }) => {
  await say("¡Hola! Soy ValBot 🤖 ¿Qué tal?");
});

// Responde en mensajes directos (DM)
app.message(async ({ message, say, client }) => {
  // Verificar que es un mensaje directo y no del bot mismo
  if (message.channel_type === "im" && message.subtype !== "bot_message") {
    await say("¡Hola Val! Esta es una respuesta automática 🤖✨");
  }
});

// Manejo de errores
app.error((error) => {
  console.error("Error del bot:", error);
});

(async () => {
  const port = process.env.PORT || 3000;
  
  // El ExpressReceiver ya tiene el endpoint /slack/events configurado automáticamente
  // y maneja el challenge de verificación de Slack
  // Solo necesitamos iniciar el servidor Express
  receiver.app.listen(port, () => {
    console.log(`ValBot está corriendo 🚀 en puerto ${port}`);
    console.log(`Endpoint de Slack: http://localhost:${port}/slack/events`);
    console.log(`El ExpressReceiver maneja automáticamente el challenge de verificación`);
  });
})();
