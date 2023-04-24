require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN_THREEDOTONEABOUTMEBOT;
const bot = new TelegramBot(token, { polling: true });
// bot.on("message", (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, "Hello World");
// });

// eslint-disable-next-line
bot.onText(/\about/, (msg) => {
  const reply = "about";
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, reply);
});
// eslint-disable-next-line
bot.onText(/\links/, (msg) => {
  const reply = "links";
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, reply);
});
// eslint-disable-next-line
bot.onText(/\start/, (msg) => {
  const reply = "start";
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, reply);
});
// eslint-disable-next-line
bot.onText(/\help/, (msg) => {
  const reply = "help";
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, reply);
});
