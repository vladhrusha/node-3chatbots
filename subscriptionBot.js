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
const deleteSubscription = require("./db/deleteSubscription");

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
let isSubscribing;

// eslint-disable-next-line
bot.onText(/\/sub/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    isSubscribing = true;
    await requestTime(bot, chatId, isSubscribing);
  } catch (err) {
    logger.error(err);
  }
});
const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

// eslint-disable-next-line
bot.onText(/\/unsub/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    isSubscribing = false;
    await requestTime(bot, chatId, isSubscribing);
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
  if (isSubscribing === false) {
    await bot.sendMessage(chatId, "Thanks for sending the unsub time!");
    const [hour, minute] = msg.text.split(":");
    try {
      await deleteSubscription(msg, hour, minute);
      bot.sendMessage(
        msg.chat.id,
        `You have unsubscribed from weather daily report at ${hour}:${minute}`,
      );
    } catch (err) {
      if (err.message === "there is nothing to delete") {
        await bot.sendMessage(chatId, "there is nothing to delete");
      }
    }
  } else if (isSubscribing === true) {
    await bot.sendMessage(chatId, "Thanks for sending the sub time!");
    const [hour, minute] = msg.text.split(":");
    try {
      await addCronJob(chatId, bot, hour, minute, userData.coordinates);
      await addSubscription(msg, hour, minute, userData);
      bot.sendMessage(
        msg.chat.id,
        `You have subscribed on weather daily report at ${hour}:${minute}`,
      );
    } catch (err) {
      if (err.message === "subscription at this time already exists") {
        await bot.sendMessage(
          chatId,
          "You already have a subscription at this timeslot",
        );
      }

      if (
        err.message ===
        "Cannot read properties of undefined (reading 'coordinates')"
      ) {
        await bot.sendMessage(
          chatId,
          "provide your geolocation using /location",
        );
      }
    }
  }
});
