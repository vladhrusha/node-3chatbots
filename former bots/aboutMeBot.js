require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
let bot;
const token = process.env.TELEGRAM_TOKEN;
const url = process.env.HEROKU_URL;
const logger = require("../utils/logger");

const establishConnection = () => {
  try {
    if (process.env.NODE_ENV === "production") {
      bot = new TelegramBot(token);
      bot.setWebHook(`${url}${token}`);
    } else {
      bot = new TelegramBot(token, { polling: true });
    }
    // throw new Error();
  } catch (err) {
    logger.error(err);
  }
};

establishConnection();

// eslint-disable-next-line
bot.onText(/\about/, async (msg) => {
  try {
    const reply = "My name is Vlad";
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, reply);
  } catch (err) {
    logger.error(err);
  }
});
// eslint-disable-next-line
bot.onText(/\links/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const mySocials = {};
    mySocials.linkedIn = "https://www.linkedin.com/in/vladyslavhrusha/";
    mySocials.facebook = "https://www.facebook.com/vladyslav.hrusha";
    const reply = `Welcome, here are my social links \n
  - LinkenIn - ${mySocials.linkedIn}\n
  - Facebook - ${mySocials.facebook}`;
    await bot.sendMessage(chatId, reply);
  } catch (err) {
    logger.error(err);
  }
});
// eslint-disable-next-line
bot.onText(/\help/, async (msg) => {
  try {
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
    await bot.sendMessage(chatId, reply, opts);
  } catch (err) {
    logger.error(err);
  }
});

module.exports = bot;
