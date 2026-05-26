const { Telegraf } = require('telegraf');
// Library sirrii ta'e kanaan waamna
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Token kee fi API Key kee
const BOT_TOKEN = '8804418698:AAF7rKklkOcYBWjpFYovZcQIenhW5bNmKzU';
const GEMINI_API_KEY = 'AIzaSyANQoY2EQiwMeWeKmQimFcsXtEsRY18Lvg';

const bot = new Telegraf(BOT_TOKEN);

// Gemini Initialize gochuu bifa sirriin
const configuration = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = configuration.getGenerativeModel({
    model: "gemini-1.5-flash", // Model saffisa qabu
    systemInstruction: `You are Bilisuma AI, a strict and dedicated Web Development tutor.
Your ONLY job is to teach, explain, and write code for HTML, CSS, and JavaScript.

CRITICAL RULES:
1. If the user asks about ANY topic outside of HTML, CSS, and JavaScript (such as math, history, sports, politics, general knowledge, storytelling, or other programming languages like Python/Java), you MUST politely refuse.
2. In your refusal, say: "I am Bilisuma AI, your Web Development tutor. I can only help you learn HTML, CSS, and JavaScript. Please ask a question related to these topics!"
3. Always respond in English. Keep explanations clear and beginner-friendly.`
});

// 1. Command: /start
bot.start((ctx) => {
  ctx.reply(
    "Hello Student! Welcome to Bilisuma AI 🚀.\n\n" +
    "I am your personal AI tutor dedicated ONLY to teaching you HTML, CSS, and JavaScript.\n\n" +
    "👉 Ask me anything about web development (e.g., 'What is HTML?', 'How to style a button in CSS?')."
  );
});

// 2. Command: /help
bot.help((ctx) => {
  ctx.reply(
    "💡 Bilisuma AI Help\n\n" +
    "Simply type your question in English about HTML, CSS, or JavaScript.\n\n" +
    "⚠️ Note: I will not answer questions about any other subjects."
  );
});

// 3. Message Handler
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;

  // Ergaa 'Thinking...' erguu
  const loadingMessage = await ctx.reply("Thinking... 🧠");

  try {
    // Gemini API waamicha sirrii
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userMessage }] }]
    });
    
    const responseText = result.response.text();

    // Ergaa loading sana deebii AI tiin jijjiiruu
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      loadingMessage.message_id,
      null,
      responseText
    );

  } catch (error) {
    // Console irratti dogoggora jiru arguuf (Render logs irratti siif mul'ata)
    console.error("Gemini Error Details:", error);
    
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      loadingMessage.message_id,
      null,
      "I am Bilisuma AI. Please make sure your question is strictly about HTML, CSS, or JS, or check if my API key is fully active!"
    );
  }
});

// Dummy HTTP Server Render-f barbaachisu
const http = require('http');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bilisuma AI Bot is running...\n');
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  bot.launch()
    .then(() => console.log('Bilisuma AI Bot is live!'))
    .catch((err) => console.error('Error starting bot:', err));
});

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));