require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
let bot;
const token = process.env.SUBSCRIPTIONBOT_TOKEN;
const url = process.env.HEROKU_URL;
const logger = require("./utils/logger");
const port = process.env.PORT || 8443;
const options = {
  webHook: {
    port,
  },
};
const fetchForecast = require("./utils/fetchForecast");
const composeForecast = require("./utils/composeForecast");

const establishConnection = () => {
  try {
    if (process.env.NODE_ENV === "production") {
      bot = new TelegramBot(token, options);
      bot.setWebHook(`${url}bot${token}`, {
        certificate: options.webHook.cert,
      });
    } else {
      bot = new TelegramBot(token, { polling: true });
    }
    // throw new Error();
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

establishConnection();

// eslint-disable-next-line
bot.onText(/\help/, async (msg) => {
  try {
    const reply = "Here is the list";
    const chatId = msg.chat.id;
    const opts = {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        keyboard: [
          ["/weather - get Weather report"],
          ["/help - list all commands"],
        ],
      }),
    };
    await bot.sendMessage(chatId, reply, opts);
  } catch (err) {
    logger.error(err);
  }
});

// eslint-disable-next-line
bot.onText(/\/start/, async (msg) => {
  try {
    bot.sendMessage(msg.chat.id, "Please share your location", {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Share Location",
              request_location: true,
            },
          ],
        ],
        one_time_keyboard: true,
      },
    });
  } catch (err) {
    logger.error(err);
  }
});

bot.on("location", async (msg) => {
  let data;
  let chatId;
  try {
    chatId = msg.chat.id;
    const coordinates = {
      lat: msg.location.latitude,
      lon: msg.location.longitude,
    };
    data = await fetchForecast(coordinates);
    if (data === undefined) {
      await bot.sendMessage(chatId, "Weather server request error", {
        parse_mode: "HTML",
      });
      return;
    }
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
  try {
    const weatherDataArray = await composeForecast(data);
    await bot.sendMessage(chatId, "Here is a forecast for next 5 days", {
      parse_mode: "HTML",
    });
    for (const weatherDataObject of weatherDataArray) {
      let weatherReport = "";
      weatherReport += "<b>Weather Forecast</b>\n";
      for (const key in weatherDataObject) {
        const value = weatherDataObject[key];
        weatherReport += "<i>" + key + "</i> - " + value + "\n";
        if (key === "time") weatherReport += "\n";
      }
      await bot.sendMessage(chatId, weatherReport, { parse_mode: "HTML" });
    }
  } catch (err) {
    logger.error(err);
  }
});
