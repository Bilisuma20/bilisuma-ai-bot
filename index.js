const { Telegraf, Markup } = require('telegraf');

// Token kee kan ati kennite
const BOT_TOKEN = '8804418698:AAF7rKklkOcYBWjpFYovZcQIenhW5bNmKzU';
const bot = new Telegraf(BOT_TOKEN);

// 1. Command: /start
bot.start((ctx) => {
  const firstName = ctx.from.first_name || 'Student';
  ctx.reply(
    `Hello ${firstName}! Welcome to **Bilisuma AI**.\n\nI am your web development tutor. I will help you learn HTML, CSS, and JavaScript from scratch.`,
    Markup.keyboard([
      ['🌐 Learn HTML', '🎨 Learn CSS'],
      ['⚡ Learn JavaScript', 'ℹ️ About Bilisuma AI']
    ]).resize()
  );
});

// 2. Command: /help
bot.help((ctx) => {
  ctx.reply(
    "Available Commands:\n" +
    "/start - Start the bot and see the menu\n" +
    "/html - Start learning HTML\n" +
    "/css - Start learning CSS\n" +
    "/javascript - Start learning JavaScript\n\n" +
    "You can also use the keyboard buttons below to navigate!"
  );
});

// 3. HTML Learning Content
const sendHtmlMenu = (ctx) => {
  ctx.reply(
    "🌐 **HTML (HyperText Markup Language)**\n\n" +
    "HTML is the standard markup language for creating Web pages. It defines the structure of a webpage.\n\n" +
    "Example:\n" +
    "`<h1>My First Heading</h1>`\n" +
    "`<p>My first paragraph.</p>`",
    { parse_mode: 'Markdown' }
  );
};
bot.command('html', sendHtmlMenu);
bot.hears('🌐 Learn HTML', sendHtmlMenu);

// 4. CSS Learning Content
const sendCssMenu = (ctx) => {
  ctx.reply(
    "🎨 **CSS (Cascading Style Sheets)**\n\n" +
    "CSS describes how HTML elements are to be displayed on screen, paper, or in other media. It saves a lot of work by controlling the layout of multiple web pages all at once!\n\n" +
    "Example:\n" +
    "`body {\n  background-color: lightblue;\n}\n" +
    "h1 {\n  color: white;\n  text-align: center;\n}`",
    { parse_mode: 'Markdown' }
  );
};
bot.command('css', sendCssMenu);
bot.hears('🎨 Learn CSS', sendCssMenu);

// 5. JavaScript Learning Content
const sendJsMenu = (ctx) => {
  ctx.reply(
    "⚡ **JavaScript (JS)**\n\n" +
    "JavaScript is the programming language of the Web. It is used to make webpages interactive and dynamic (e.g., button clicks, animations, calculations).\n\n" +
    "Example:\n" +
    "`let x = 5;\n" +
    "let y = 6;\n" +
    "let z = x + y;\n" +
    "console.log(z); // Outputs 11`",
    { parse_mode: 'Markdown' }
  );
};
bot.command('javascript', sendJsMenu);
bot.hears('⚡ Learn JavaScript', sendJsMenu);

// 6. About Section
bot.hears('ℹ️ About Bilisuma AI', (ctx) => {
  ctx.reply(
    "🤖 **About Bilisuma AI**\n\n" +
    "This bot is designed to provide quick and interactive web development lessons. Built with Node.js and Telegraf, hosted on Render."
  );
});

// Start the bot using Webhook (highly recommended for Render) or Polling
// For Render, we use simple polling or you can set up Webhooks. 
// Since Render requires a port to stay active, we add a simple dummy server.

const http = require('http');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bilisuma AI Bot is running...\n');
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  bot.launch()
    .then(() => console.log('Telegram bot started successfully!'))
    .catch((err) => console.error('Error starting bot:', err));
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));