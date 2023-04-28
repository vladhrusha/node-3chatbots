require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
let bot;
const token = process.env.TELEGRAM_TOKEN;
const url = process.env.HEROKU_URL;

if (process.env.NODE_ENV === "production") {
  bot = new TelegramBot(token);
  bot.setWebHook(`${url}${token}`);
} else {
  bot = new TelegramBot(token, { polling: true });
}

// eslint-disable-next-line
bot.onText(/\about/, async (msg) => {
  const reply = "My name is Vlad";
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, reply);
});
// eslint-disable-next-line
bot.onText(/\links/, async (msg) => {
  const chatId = msg.chat.id;
  const mySocials = {};
  mySocials.linkedIn = "https://www.linkedin.com/in/vladyslavhrusha/";
  mySocials.facebook = "https://www.facebook.com/vladyslav.hrusha";
  const reply = `Welcome, here are my social links \n
  - LinkenIn - ${mySocials.linkedIn}\n
  - Facebook - ${mySocials.facebook}`;
  bot.sendMessage(chatId, reply);
});
// eslint-disable-next-line
bot.onText(/\help/, async (msg) => {
  const reply = "Here is the list";
  const chatId = msg.chat.id;

  const opts = {
    reply_to_message_id: msg.message_id,
    reply_markup: JSON.stringify({
      keyboard: [
        ["/start - start bot"],
        ["/help - list all commands"],
        ["/links - provide my social links"],
        ["/about - provide short info about me"],
      ],
    }),
  };
  bot.sendMessage(chatId, reply, opts);
});

module.exports = bot;
