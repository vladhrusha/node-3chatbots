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
const addSubscription = require("./db/addSubscription");
// const collectSubscriptionsByUsername = require("./db/collectSubscriptionsByUsername");
const collectSubscriptions = require("./db/collectSubscriptions");
const {
  requestLocation,
  respondLocation,
  requestTime,
} = require("./utils/messages");
let userData;

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
let subs;
const start = async () => {
  establishConnection();
  subs = await collectSubscriptions();
  subs.forEach((sub) => {
    addCronJob(sub.chatId, bot, sub.hour, sub.minute, sub.coordinates);
  });
  // logger.info(subs);
};
start();

// eslint-disable-next-line
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    await requestLocation(bot, chatId);
  } catch (err) {
    logger.error(err);
  }
  userData = await onGetUserLocation(bot);
  try {
    await respondLocation(bot, chatId);
  } catch (err) {
    logger.error(err);
  }
  try {
    await requestTime(bot, chatId);
  } catch (err) {
    logger.error(err);
  }
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
      await addCronJob(chatId, bot, hour, minute, userData.coordinates);
      await addSubscription(bot, msg, hour, minute, userData);
      bot.sendMessage(
        msg.chat.id,
        `You have subscribed on weather daily report at ${hour}:${minute}`,
      );
      hour = undefined;
      minute = undefined;
    }
    // console.log("here");
    // console.log(userData);
  } catch (err) {
    logger.error(err);
  }
});
