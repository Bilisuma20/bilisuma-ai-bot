const { Telegraf } = require('telegraf');
const { GoogleGenAI } = require('@google/genai');

// 1. Token Telegram fi API Key Gemini kee kan kallattiin hojjetan
const BOT_TOKEN = '8804418698:AAF7rKklkOcYBWjpFYovZcQIenhW5bNmKzU';
const GEMINI_API_KEY = 'AIzaSyANQoY2EQiwMeWeKmQimFcsXtEsRY18Lvg';

const bot = new Telegraf(BOT_TOKEN);
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// 2. System Instruction (Gemini akka HTML, CSS, fi JS qofa barsiisu dirqamsiisu)
const SYSTEM_INSTRUCTION = `
You are Bilisuma AI, a strict and dedicated Web Development tutor.
Your ONLY job is to teach, explain, and write code for HTML, CSS, and JavaScript.

CRITICAL RULES:
1. If the user asks about ANY topic outside of HTML, CSS, and JavaScript (such as math, history, sports, politics, general knowledge, storytelling, or other programming languages like Python/Java), you MUST politely refuse.
2. In your refusal, say: "I am Bilisuma AI, your Web Development tutor. I can only help you learn HTML, CSS, and JavaScript. Please ask a question related to these topics!"
3. Always respond in English. Keep explanations clear, beginner-friendly, and format your code snippets beautifully using Markdown blocks.
`;

// 3. Command: /start
bot.start((ctx) => {
  const firstName = ctx.from.first_name || 'Student';
  ctx.reply(
    `Hello ${firstName}! Welcome to **Bilisuma AI** 🚀.\n\n` +
    `I am your personal AI tutor dedicated ONLY to teaching you **HTML, CSS, and JavaScript**.\n\n` +
    `👉 Ask me anything about web development (e.g., "How to create a button in HTML?", "What is CSS Flexbox?", or "Explain JS functions").`,
    { parse_mode: 'Markdown' }
  );
});

// 4. Command: /help
bot.help((ctx) => {
  ctx.reply(
    "💡 **Bilisuma AI Help**\n\n" +
    "Simply type your question in English about HTML, CSS, or JavaScript.\n\n" +
    "⚠️ *Note: I will not answer questions about any other subjects or other programming languages.*",
    { parse_mode: 'Markdown' }
  );
});

// 5. Message Handler (Bakka Gemini itti gaafatamu)
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;

  // Ergaa 'Thinking...' agarsiisuuf
  const loadingMessage = await ctx.reply("Thinking... 🧠");

  try {
    // Gemini API waamuu
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, // Temperature gadi aanaan deebiin isaa daangaa akka hordufeef gargaara
      }
    });

    // Ergaa loading sana deebii Gemini tiin jijjiiruu
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      loadingMessage.message_id,
      null,
      response.text,
      { parse_mode: 'Markdown' }
    );

  } catch (error) {
    console.error("Gemini Error:", error);
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      loadingMessage.message_id,
      null,
      "Sorry, I am having trouble connecting to my AI brain. Please try again in a moment."
    );
  }
});

// 6. Dummy HTTP Server Render-f barbaachisu
const http = require('http');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bilisuma AI Bot is running with Gemini live API...\n');
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  bot.launch()
    .then(() => console.log('Bilisuma AI Bot is live and working!'))
    .catch((err) => console.error('Error starting bot:', err));
});

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));