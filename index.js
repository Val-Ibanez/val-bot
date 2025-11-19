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
app.message(async ({ message, say }) => {
  // Verificar que es un mensaje directo y no del bot mismo
  if (message.channel_type !== "im" || message.subtype === "bot_message") {
    return;
  }

  const texto = (message.text || "").toLowerCase().trim();

  // Si el mensaje es muy corto (menos de 20 caracteres), probablemente es solo un saludo
  if (texto.length < 20) {
    // Normalizar removiendo signos y espacios extra
    const limpio = texto
      .replace(/[¿?¡!,.\-_\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Lista expandida de saludos y variaciones
    const saludos = [
      "hola",
      "hola val",
      "hola val como estas",
      "hola como estas",
      "hola como estas val",
      "hola que tal",
      "hola que tal val",
      "buenas",
      "buenos dias",
      "buen dia",
      "buenas tardes",
      "buenas noches",
      "hello",
      "hey",
      "holi",
      "hi",
      "que tal",
      "que tal val",
      "como estas",
      "como estas val",
      "como va",
      "como va val",
      "que onda",
      "que onda val",
      "saludos",
      "buen dia val",
      "buenas val"
    ];

    // Verificar si el mensaje es exactamente un saludo o empieza con uno
    const esSaludo = saludos.includes(limpio) || 
                     saludos.some(saludo => limpio.startsWith(saludo + " ") || limpio === saludo);

    if (esSaludo) {
      await say("Un saludo no es un mensaje 😄 https://nohello.com");
      return;
    }
  }

  // Respuesta por defecto
  await say("¡Hola Val! Esta es una respuesta automática 🤖✨");
});

// Manejo de errores
app.error((error) => {
  console.error("Error del bot:", error);
});

(async () => {
  const port = process.env.PORT || 3000;
  
  // Middleware para loggear todas las peticiones POST a /slack/events
  receiver.app.use("/slack/events", (req, res, next) => {
    if (req.method === 'POST') {
      console.log("=== Slack Event Received ===");
      console.log("Headers:", req.headers);
      console.log("Body:", JSON.stringify(req.body, null, 2));
      console.log("===========================");
    }
    next();
  });
  
  // Health check endpoint
  receiver.app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'val-bot' });
  });
  
  // Root endpoint
  receiver.app.get('/', (req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      service: 'val-bot',
      endpoint: '/slack/events'
    });
  });
  
  receiver.app.get('/slack/events', (req, res) => {
    res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests from Slack'
    });
  });
  
  receiver.app.listen(port, () => {
    console.log(`ValBot está corriendo 🚀 en puerto ${port}`);
    console.log(`Endpoint de Slack: http://localhost:${port}/slack/events`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`El ExpressReceiver maneja automáticamente el challenge de verificación`);
  });
})();
