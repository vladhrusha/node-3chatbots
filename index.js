require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN_THREEDOTONEABOUTMEBOT;
let bot;
// const bot = new TelegramBot(token, { polling: true });
// bot.on("message", (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, "Hello World");
// });

if (process.env.NODE_ENV === "production") {
  bot = new TelegramBot(token);
  bot.setWebHook(process.env.HEROKU_URL + token);
  // eslint-disable-next-line
  console.log(process.env.NODE_ENV);
} else {
  bot = new TelegramBot(token, { polling: true });
}

// eslint-disable-next-line
console.log("Bot server started in the " + process.env.NODE_ENV + " mode");

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
  const reply = "help2";
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, reply);
});
