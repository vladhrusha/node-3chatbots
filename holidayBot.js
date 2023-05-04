require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
let bot;
const token = process.env.HOLIDAYBOT_TOKEN;
const url = process.env.HEROKU_URL;
const logger = require("./utils/logger");
const { flag, name, code } = require("country-emoji");

const fetchHolidays = require("./utils/fetchHolidays");

const countries = ["JP", "AL", "BE", "HR", "DK", "PE", "QA", "NO"];
const countriesFlags = countries.map((country) => {
  return flag(country);
});
const port = process.env.PORT || 8443;
const options = {
  webHook: {
    port,
    key: `certs/yourdomain.key`, // Path to file with PEM private key
    cert: `certs/yourdomain.crt`, // Path to file with PEM certificate
  },
};

const establishConnection = () => {
  try {
    if (process.env.NODE_ENV === "production") {
      bot = new TelegramBot(token, options);
      bot.setWebHook(`${url}${token}`, {
        certificate: options.webHook.cert,
      });
    } else {
      bot = new TelegramBot(token, { polling: true });
    }
    // throw new Error();
  } catch (err) {
    logger.error(err);
  }
};

establishConnection();

bot.on("message", async (msg) => {
  try {
    const chatId = msg.chat.id;
    const input = code(msg.text);

    if (countries.includes(input)) {
      const data = await fetchHolidays(input);
      if (data.length > 0) {
        const reply = data[0].name;
        await bot.sendMessage(chatId, name(input) + " - " + reply);
      } else
        await bot.sendMessage(chatId, name(input) + " - " + "not a holiday");
    }
  } catch (err) {
    logger.error(err);
  }
});

// eslint-disable-next-line
bot.onText(/\/start/, async (msg) => {
  try {
    const reply = "Here is the list";
    const chatId = msg.chat.id;
    const opts = {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        keyboard: [countriesFlags],
      }),
    };
    await bot.sendMessage(chatId, reply, opts);
  } catch (err) {
    logger.error(err);
  }
});

module.exports = bot;
