require("dotenv").config();
const logger = require("./utils/logger");

const TelegramBot = require("node-telegram-bot-api");
let bot;
const token = process.env.SUBSCRIPTIONBOT_TOKEN;
const url = process.env.HEROKU_URL;
const port = process.env.PORT || 8443;
const options = {
  webHook: {
    port,
  },
};

const onGetUserLocation = require("./utils/onGetUserLocation");
const addCronJob = require("./utils/addCronJob");

let userData;
let subsCollection;

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
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
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

  userData = await onGetUserLocation(bot);
  await bot.sendMessage(chatId, "Received Coordinates", {
    reply_markup: {
      remove_keyboard: true,
    },
  });
  await bot.sendMessage(
    chatId,
    "Please provide the time in UTC timezone that you want to schedule the task in the format 'hh:mm' using the 24-hour clock." +
      " For example, if you want to schedule the task for 3:30 PM, enter '15:30'.",
  );
});

let hour, minute;
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;
  const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  try {
    if (timeRegex.test(message)) {
      await bot.sendMessage(chatId, "Thanks for sending the time!");
      [hour, minute] = message.split(":");
    }
    addCronJob(msg, bot, hour, minute, userData, subsCollection);
    hour = undefined;
    minute = undefined;
  } catch (err) {
    logger.error(err);
  }
});
