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
const handleSubscriptionMessage = require("./utils/handleSubscriptionMessages");
// const collectSubscriptionsByUsername = require("./db/collectSubscriptionsByUsername");
const collectSubscriptions = require("./db/collectSubscriptions");
const updateLocation = require("./db/updateLocation");

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
  if (subs.length === 1) {
    const sub = subs[0];
    sub.times.forEach((time) => {
      addCronJob(sub.chatId, bot, time.hour, time.minute, sub.coordinates);
    });
  } else {
    subs.forEach((sub) => {
      sub.times.forEach((time) => {
        addCronJob(sub.chatId, bot, time.hour, time.minute, sub.coordinates);
      });
    });
  }
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
});
// eslint-disable-next-line
bot.onText(/\/location/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    await requestLocation(bot, chatId);
  } catch (err) {
    logger.error(err);
  }
  userData = await onGetUserLocation(bot);
  try {
    await respondLocation(bot, chatId);
    updateLocation(
      msg.from.username,
      userData.coordinates.lat,
      userData.coordinates.lon,
    );
  } catch (err) {
    logger.error(err);
  }
});
const isSubscribingMap = new Map();

// eslint-disable-next-line
bot.onText(/\/sub/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    isSubscribingMap.set(chatId, true);
    await requestTime(bot, chatId, isSubscribingMap.get(chatId));
  } catch (err) {
    logger.error(err);
  }
});
const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

// eslint-disable-next-line
bot.onText(/\/unsub/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    isSubscribingMap.set(chatId, false);
    await requestTime(bot, chatId, isSubscribingMap.get(chatId));
  } catch (err) {
    logger.error(err);
  }
});

// eslint-disable-next-line
bot.onText(/\help/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Welcome", {
    reply_markup: {
      keyboard: [["/location", "/sub", "/unsub"]],
    },
  });
});

bot.onText(timeRegex, async (msg) => {
  const chatId = msg.chat.id;
  const [hour, minute] = msg.text.split(":");
  handleSubscriptionMessage(
    isSubscribingMap,
    chatId,
    msg,
    hour,
    minute,
    bot,
    userData,
  );
});
