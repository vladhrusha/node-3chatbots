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

const addCronJob = require("./utils/addCronJob");

const {
  handleHelp,
  handleSetLocation,
  handleStart,
  handleSub,
  handleUnsub,
  handleSubscriptionMessages,
} = require("./utils/handlers");

const { getAllSubscriptions } = require("./services/subscription.service");

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
  subs = await getAllSubscriptions();
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
  userData = await handleStart(chatId, bot, userData);
});
// eslint-disable-next-line
bot.onText(/\/location/, async (msg) => {
  const chatId = msg.chat.id;
  userData = await handleSetLocation(msg, chatId, bot, userData);
});
let isSubscribingMap = new Map();

// eslint-disable-next-line
bot.onText(/\/sub/, async (msg) => {
  const chatId = msg.chat.id;
  isSubscribingMap = await handleSub(chatId, bot, isSubscribingMap);
});

// eslint-disable-next-line
bot.onText(/\/unsub/, async (msg) => {
  const chatId = msg.chat.id;
  isSubscribingMap = await handleUnsub(
    chatId,
    bot,
    isSubscribingMap,
    msg.from.username,
  );
});

// eslint-disable-next-line
bot.onText(/\help/, async (msg) => {
  const chatId = msg.chat.id;
  handleHelp(chatId, bot);
});
const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
bot.onText(timeRegex, async (msg) => {
  const chatId = msg.chat.id;
  const [hour, minute] = msg.text.split(":");
  handleSubscriptionMessages({
    isSubscribingMap,
    chatId,
    msg,
    hour,
    minute,
    bot,
    userData,
  });
});
