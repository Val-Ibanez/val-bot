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
  
  // Middleware para loggear todas las peticiones POST a /slack/events
  // Esto ayuda a debuggear si Slack está enviando eventos correctamente
  // Usamos app.use para que se ejecute antes que otros handlers
  receiver.app.use("/slack/events", (req, res, next) => {
    if (req.method === 'POST') {
      console.log("=== Slack Event Received ===");
      console.log("Headers:", req.headers);
      console.log("Body:", JSON.stringify(req.body, null, 2));
      console.log("===========================");
    }
    next(); // Pasar al siguiente handler (ExpressReceiver)
  });
  
  // Health check endpoint para mantener la app despierta en Render
  receiver.app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'val-bot' });
  });
  
  // Endpoint raíz para verificar que el servidor está corriendo
  receiver.app.get('/', (req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      service: 'val-bot',
      endpoint: '/slack/events'
    });
  });
  
  // Handler para GET en /slack/events (para que Render/Slack puedan verificar que existe)
  // El ExpressReceiver maneja POST automáticamente, pero GET necesita respuesta explícita
  receiver.app.get('/slack/events', (req, res) => {
    res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests from Slack'
    });
  });
  
  // El ExpressReceiver ya tiene el endpoint /slack/events configurado automáticamente
  // y maneja el challenge de verificación de Slack (POST requests)
  // Solo necesitamos iniciar el servidor Express
  receiver.app.listen(port, () => {
    console.log(`ValBot está corriendo 🚀 en puerto ${port}`);
    console.log(`Endpoint de Slack: http://localhost:${port}/slack/events`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`El ExpressReceiver maneja automáticamente el challenge de verificación`);
  });
})();
